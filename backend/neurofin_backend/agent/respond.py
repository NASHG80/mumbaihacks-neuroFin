# agent/respond.py
import os
import json
import importlib
from flask import Blueprint, request, jsonify
from dotenv import load_dotenv

load_dotenv()

bp = Blueprint("respond_bp", __name__)

# -----------------------
# Fallback stubs (safe)
# -----------------------
def fetch_user_context(uid):
    return {"smoothed": [], "forecast": {}}

def call_risk_agent(uid, ctx):
    return {"error": "risk-agent-not-available"}

def call_llm(prompt):
    """
    Groq Llama-3.x completion with robust safety and fallback.
    """

    import os, time, random, requests, json

    GROQ_API_KEY = os.getenv("GROQ_API_KEY")
    if not GROQ_API_KEY:
        return "Groq key missing. Set GROQ_API_KEY in environment."

    model = os.getenv("GROQ_MODEL", "llama-3.1-8b-instant")

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": model,
        "messages": [
            {"role": "system", "content": "You are NeuroFin AI Assistant."},
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.4,
        "max_tokens": 512,
    }

    # Retry loop like your OpenAI version
    max_attempts = 5
    attempt = 0
    last_error = None

    while attempt < max_attempts:
        attempt += 1
        try:
            r = requests.post(url, json=payload, headers=headers, timeout=20)

            if r.status_code == 200:
                data = r.json()
                try:
                    return data["choices"][0]["message"]["content"]
                except:
                    return json.dumps(data)[:2000]

            # Handle rate limit (Groq returns 429)
            if r.status_code == 429:
                sleep_time = 1 + random.random() * 2
                time.sleep(sleep_time)
                continue

            if 500 <= r.status_code < 600:
                # server error retry
                time.sleep(1 + random.random())
                continue

            # Other errors → break
            last_error = f"{r.status_code}: {r.text}"
            break

        except Exception as e:
            last_error = str(e)
            time.sleep(1)
            continue

    return f"Groq LLM failed after retries: {last_error}"



# -----------------------
# Lazy loader to avoid circular import
# -----------------------
def _ensure_langgraph_agent_loaded():
    """
    Attempt to import langgraph_agent and override local stubs.
    Safe to call repeatedly; it only replaces stubs if import succeeds.
    """
    global fetch_user_context, call_risk_agent, call_llm
    try:
        lga = importlib.import_module("langgraph_agent")
        # override only if attributes exist in the module
        if hasattr(lga, "fetch_user_context"):
            fetch_user_context = lga.fetch_user_context
        if hasattr(lga, "call_risk_agent"):
            call_risk_agent = lga.call_risk_agent
        if hasattr(lga, "call_llm"):
            call_llm = lga.call_llm
    except Exception:
        # If import fails, keep fallbacks. We don't log here to avoid noise during import-time.
        pass

# -----------------------
# RAG retriever fallback
# -----------------------
try:
    from rag import retrieve as rag_retrieve
except Exception:
    # fallback stub if rag not yet ready
    def rag_retrieve(user_id, k=5):
        return []

# -----------------------
# Blueprint handler
# -----------------------
@bp.route("/agent/respond", methods=["POST"])
def respond():
    payload = request.json or {}
    user_id = payload.get("user_id")
    # support both "question" and "input" keys
    question = payload.get("question") or payload.get("input") or payload.get("text")
    if not user_id or not question:
        return jsonify({"error":"missing user_id or question"}), 400

    # ensure langgraph_agent helpers are loaded (avoids circular import at module load)
    _ensure_langgraph_agent_loaded()

    # 1) gather context
    ctx = fetch_user_context(user_id)

    # 2) call risk agent (best-effort)
    try:
        risk_context = {
            "short_text": question,
            "smoothed_snapshot": ctx.get("smoothed", [])[:5],
            "forecast_summary": ctx.get("forecast", {})
        }
        risk = call_risk_agent(user_id, risk_context)
    except Exception as e:
        risk = {"error": str(e)}

    # 3) RAG retrieval
    try:
        retrieved = rag_retrieve(user_id, k=5) or []
    except Exception as e:
        retrieved = []
        # print is intentionally minimal to surface errors during dev
        print("RAG retrieval error:", e)

    retr_texts = [f"- {r.get('text')} (meta={r.get('meta')})" for r in retrieved]
    retr_context = "\n".join(retr_texts) if retr_texts else "(no retrieval results)"

    # 4) build prompt
    prompt = f"""
User question: {question}

Retrieved context:
{retr_context}

Smoothed snapshot:
{ctx.get('smoothed', [])[:3]}

Forecast snapshot:
{ctx.get('forecast', {})}

Risk agent output:
{json.dumps(risk, default=str)}

Provide a concise, empathetic financial explanation.
If risk severity is medium or high, include a two-step actionable suggestion.
"""

    # 5) call the LLM
    try:
        answer = call_llm(prompt)
    except Exception as e:
        answer = f"LLM call failed: {e}"

    return jsonify({"answer": answer, "risk": risk, "retrieved_count": len(retrieved)})
