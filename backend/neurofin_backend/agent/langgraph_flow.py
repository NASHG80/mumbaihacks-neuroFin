# agent/langgraph_flow.py
print("🔥 Flask is starting langgraph_flow.py ...", flush=True)

import os
import json
import logging
from datetime import datetime
from flask import Flask, request, jsonify
import requests
import re
from respond import bp as respond_bp

# --- logging ---
logger = logging.getLogger("langgraph_agent")
logging.basicConfig(level=logging.INFO)
# near top of langgraph_flow.py
from rag import retrieve as rag_retrieve


# --- Flask app must be created before using @app.route ---
app = Flask("langgraph_agent")
app.register_blueprint(respond_bp)

# --- config ---
API_BASE = os.environ.get("NEUROFIN_API", "http://api:4000")
RISK_AGENT_URL = os.environ.get("RISK_AGENT_URL", "http://risk:7000/agent/risk/check")
GROQ_API_KEY = os.environ.get("GROQ_API_KEY", "")
GROQ_MODEL = os.environ.get("GROQ_MODEL", "llama-3.1-8b-instant")

if not GROQ_API_KEY:
    logger.warning("GROQ_API_KEY is missing – agentic AI will not respond.")



# --- import langgraph after app exists (so any decorators inside won't break) ---
from langgraph.graph import StateGraph, START, END
from langgraph.graph import MessagesState  # convenient state type for LLM-like exchanges

# --- helper utilities ---
def safe_json_serialize(obj):
    """
    Attempt to JSON serialize; on failure convert non-serializable values to strings.
    Works recursively for dict/list/tuple.
    """
    try:
        json.dumps(obj)
        return obj
    except Exception:
        if isinstance(obj, dict):
            return {k: safe_json_serialize(v) for k, v in obj.items()}
        if isinstance(obj, (list, tuple)):
            return [safe_json_serialize(v) for v in obj]
        try:
            return str(obj)
        except Exception:
            return "<unserializable>"

def extract_json_from_text(text):
    """Find the first or last JSON object in text and parse it. Return dict or None."""
    matches = list(re.finditer(r"(\{[\s\S]*\})", text))
    if not matches:
        return None
    for m in reversed(matches):
        candidate = m.group(1)
        try:
            return json.loads(candidate)
        except Exception:
            continue
    return None

# --- helper functions used as graph nodes ---
def fetch_transactions(state: MessagesState):
    user_id = state.context.get("user_id")
    if not user_id:
        return {"error": "missing user_id"}
    url = f"{API_BASE}/api/v1/transactions/{user_id}?limit=200"
    try:
        r = requests.get(url, timeout=8)
        if r.status_code != 200:
            logger.warning("fetch_transactions non-200: %s %s", r.status_code, r.text[:500])
            return {"error": f"transactions_fetch_failed: {r.status_code}"}
        try:
            txs = r.json()
        except Exception:
            txs = r.text
    except Exception as e:
        logger.exception("fetch_transactions request failed")
        return {"error": f"transactions_fetch_exception: {str(e)}"}
    state.context["transactions"] = txs
    return {"ok": True}

def call_kalman_smoother(state: MessagesState):
    user_id = state.context.get("user_id")
    if not user_id:
        return {"error": "missing_user_id"}
    url = f"{API_BASE}/api/v1/smoothed/{user_id}?limit=30"
    try:
        r = requests.get(url, timeout=8)
        if r.status_code != 200:
            logger.warning("call_kalman_smoother non-200: %s %s", r.status_code, r.text[:500])
            raise RuntimeError(f"status {r.status_code}")
        smoothed = r.json()
        state.context["smoothed"] = smoothed
        return {"ok": True}
    except Exception:
        txs = state.context.get("transactions") or []
        try:
            recent = txs[-10:] if isinstance(txs, list) else []
            balance = 0
            for t in recent:
                amt = t.get("amount", 0) if isinstance(t, dict) else 0
                direction = (t.get("direction") if isinstance(t, dict) else "debit")
                balance += (amt if direction == "credit" else -amt)
        except Exception:
            balance = 0
        state.context["smoothed"] = [{"as_of": datetime.utcnow().isoformat(), "smoothed_balance": balance}]
        return {"notice": "fallback_smoothed_used"}

def build_llm_prompt(state: MessagesState):
    txs = state.context.get("transactions", []) or []
    smoothed = state.context.get("smoothed", []) or []
    latest_balance = "unknown"
    try:
        if isinstance(smoothed, list) and len(smoothed) > 0 and isinstance(smoothed[0], dict):
            latest_balance = smoothed[0].get("smoothed_balance", "unknown")
        elif isinstance(smoothed, dict):
            latest_balance = smoothed.get("smoothed_balance", "unknown")
    except Exception:
        latest_balance = "unknown"

    summary_lines = []
    try:
        recent = txs[-10:] if isinstance(txs, list) else []
    except Exception:
        recent = []
    for t in reversed(recent):
        if not isinstance(t, dict):
            summary_lines.append(str(t))
            continue
        ts = t.get("timestamp") or t.get("ts") or t.get("created_at", "")
        summary_lines.append(f"{ts} | {t.get('direction')} | {t.get('amount')} | {t.get('category')} | {t.get('merchant')}")
    summary = "\n".join(summary_lines) or "no recent transactions"

    prompt = f"""
You are NeuroFin — an AI financial coach.
User ID: {state.context.get('user_id')}
Latest smoothed balance (approx): {latest_balance}

Recent transactions (latest first):
{summary}

Question: Based on the smoothed balance and recent transactions, give:
1) A one-line risk assessment: {{"LOW"|"MEDIUM"|"HIGH"}} and why.
2) Two concrete short-term actions the user can take in the next 7 days (each: action + reason).
3) If we should alert user immediately (yes/no) and suggested alert text.
4) Provide a short JSON object ONLY in this exact schema:
{{"risk":"LOW|MEDIUM|HIGH","actions":[{{"action":"", "reason":""}},{{"action":"", "reason":""}}],"alert":{"send":true|false,"text":""}}}
Be concise and conservative.
"""
    state.context["prompt"] = prompt.strip()
    return {"ok": True}

def call_openai_node(state: MessagesState):
    """
    Groq Llama-3.x node for LangGraph.
    """
    import requests, time, random, json

    prompt = state.context.get("prompt")
    if not prompt:
        return {"error": "no prompt"}

    if not GROQ_API_KEY:
        return {"error": "groq_key_missing"}

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json",
    }

    payload = {
        "model": GROQ_MODEL,
        "messages": [
            {"role": "system", "content": "You are NeuroFin AI Assistant."},
            {"role": "user", "content": prompt},
        ],
        "max_tokens": 500,
        "temperature": 0.4,
    }

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
                    text = data["choices"][0]["message"]["content"]
                except:
                    return {"error": "groq_parse_failed"}

                # Extract JSON from LLM output (your helper)
                parsed = extract_json_from_text(text)
                if parsed is None:
                    parsed = {"raw": text.strip()}

                state.context["llm_advice"] = parsed
                return {"ok": True}

            if r.status_code == 429:
                time.sleep(1 + random.random())
                continue

            if 500 <= r.status_code < 600:
                time.sleep(1 + random.random())
                continue

            last_error = f"{r.status_code}: {r.text[:500]}"
            break

        except Exception as e:
            last_error = str(e)
            time.sleep(1)
            continue

    return {"error": f"groq_failed_after_retries: {last_error}"}



def risk_check_node(state: MessagesState):
    advice = state.context.get("llm_advice")
    if not advice:
        return {"error": "missing_advice"}
    payload = {"user_id": state.context.get("user_id"), "advice": advice}
    try:
        r = requests.post(RISK_AGENT_URL, json=payload, timeout=6)
        if r.status_code != 200:
            logger.warning("risk_check_node non-200: %s %s", r.status_code, r.text[:500])
            state.context["risk_check"] = {"ok": False, "detail": f"{r.status_code}"}
            return {"warn": "risk_service_failure"}
        try:
            rr = r.json()
        except Exception:
            rr = {"raw": r.text}
        state.context["risk_check"] = rr
        return {"ok": True}
    except Exception as e:
        logger.exception("risk_check_node failed")
        state.context["risk_check"] = {"ok": False, "error": str(e)}
        return {"error": "risk_call_failed"}

def finalize_node(state: MessagesState):
    result = {
        "user_id": state.context.get("user_id"),
        "timestamp": datetime.utcnow().isoformat(),
        "advice": state.context.get("llm_advice"),
        "risk_check": state.context.get("risk_check"),
        "smoothed": (state.context.get("smoothed") or [])[:3],
    }
    state.context["result"] = result
    return {"ok": True, "result": result}

# --- build LangGraph graph once ---
graph = StateGraph(MessagesState)
graph.add_node(fetch_transactions, name="fetch_transactions")
graph.add_node(call_kalman_smoother, name="call_kalman_smoother")
graph.add_node(build_llm_prompt, name="build_llm_prompt")
graph.add_node(call_openai_node, name="call_openai_node")
graph.add_node(risk_check_node, name="risk_check_node")
graph.add_node(finalize_node, name="finalize_node")

graph.add_edge(START, "fetch_transactions")
graph.add_edge("fetch_transactions", "call_kalman_smoother")
graph.add_edge("call_kalman_smoother", "build_llm_prompt")
graph.add_edge("build_llm_prompt", "call_openai_node")
graph.add_edge("call_openai_node", "risk_check_node")
graph.add_edge("risk_check_node", "finalize_node")
graph.add_edge("finalize_node", END)

graph = graph.compile()

# --- single robust /agent/run endpoint ---
@app.route("/agent/run", methods=["POST"])
def agent_run():
    """
    Run the compiled langgraph graph.
    Accepts optional JSON body: {"user_id":"<id>", "input":"<optional user input>"}
    """
    body = request.get_json(silent=True) or {}
    user_id = body.get("user_id")
    user_input = body.get("input", "")

    if not user_id:
        return jsonify({"error": "user_id required"}), 400

    short_input = (user_input[:200] + "...") if isinstance(user_input, str) and len(user_input) > 200 else user_input
    logger.info("agent/run invoked for user_id=%s input=%s", user_id, short_input)

    # build initial state: prefer using MessagesState instance because nodes expect .context/.messages
    init_state = None
    try:
        # If client sent a dict-shaped state (messages/context), coerce to MessagesState
        if isinstance(body, dict) and ("messages" in body or "context" in body):
            init_state = MessagesState()
            init_state.messages = body.get("messages", [{"role": "user", "content": user_input or f"start for {user_id}"}])
            init_state.context = body.get("context", {"user_id": user_id})
        else:
            # default construction
            init_state = MessagesState()
            init_state.messages = [{"role": "user", "content": user_input or f"start for {user_id}"}]
            init_state.context = {"user_id": user_id}

        logger.info("invoking graph with init_state type=%s", type(init_state))

        invocation = None  # ensure variable exists for exception logging
        invocation = graph.invoke(init_state)
        logger.info("graph.invoke returned type=%s", type(invocation))

        if invocation is None:
            raise RuntimeError("graph.invoke returned None")

        # Defensive normalization: prefer dict handling first
        ctx = None

        # 1) If it's a plain dict-like return, use that first
        if isinstance(invocation, dict):
            if "context" in invocation:
                ctx = invocation["context"]
            elif "result" in invocation:
                ctx = invocation["result"]
            else:
                safe_inv = safe_json_serialize(invocation)
                return jsonify({"status": "ok", "invocation": safe_inv}), 200

        # 2) If it's an object with attribute 'context' use it safely
        elif hasattr(invocation, "context"):
            try:
                ctx = invocation.context
            except Exception:
                try:
                    ctx = dict(getattr(invocation, "__dict__", {}) or {})
                except Exception:
                    ctx = str(invocation)

        # 3) Unknown type, coerce to string
        else:
            ctx = str(invocation)

        safe_ctx = safe_json_serialize(ctx)
        return jsonify({"status": "ok", "context": safe_ctx}), 200

    except Exception as e:
        try:
            logger.exception("agent/run failed; invocation repr: %s", repr(invocation)[:800])
        except Exception:
            logger.exception("agent/run failed and invocation repr unavailable")
        return jsonify({"error": "internal", "detail": str(e)}), 500
# --- compatibility endpoint: /agent/respond (simple user-facing) ---
@app.route("/agent/respond", methods=["POST"])
def agent_respond():
    """
    Lightweight compatibility endpoint.
    Accepts JSON body: {"user_id": "...", "question": "..."} or {"user_id":"...", "input":"..."}
    Internally invokes the same graph flow but returns a compact response:
      { answer: <text-or-advice>, risk_check: <...>, context: <smaller-context> }
    """
    body = request.get_json(silent=True) or {}
    user_id = body.get("user_id")
    # allow both "question" and "input"
    user_input = body.get("question") or body.get("input") or ""

    if not user_id:
        return jsonify({"error": "user_id required"}), 400

    # create minimal MessagesState context (same as agent_run)
    init_state = MessagesState()
    init_state.messages = [{"role": "user", "content": user_input or f"start for {user_id}"}]
    init_state.context = {"user_id": user_id}

    try:
        invocation = graph.invoke(init_state)

        # attempt to extract the finalized result stored by finalize_node
        ctx = None
        if isinstance(invocation, dict):
            ctx = invocation.get("context") or invocation.get("result") or invocation
        elif hasattr(invocation, "context"):
            try:
                ctx = invocation.context
            except Exception:
                ctx = dict(getattr(invocation, "__dict__", {}) or {})
        else:
            # try safe serialization fallback
            ctx = safe_json_serialize(invocation)

        # normalized dict
        ctx = safe_json_serialize(ctx) if ctx is not None else {}

        # prefer the explicit result shape if present
        if isinstance(ctx, dict) and "result" in ctx:
            final = ctx["result"]
        elif isinstance(ctx, dict) and "llm_advice" in ctx:
            final = {
                "user_id": ctx.get("user_id"),
                "advice": ctx.get("llm_advice"),
                "risk_check": ctx.get("risk_check"),
                "smoothed": (ctx.get("smoothed") or [])[:3],
            }
        else:
            # best-effort extraction
            final = ctx

        # If LLM produced nested JSON object, prefer that as "answer"
        answer = None
        if isinstance(final, dict):
            answer = final.get("advice") or final.get("llm_advice") or final.get("answer")
        if not answer:
            answer = str(final)

        # send compact response
        return jsonify({
            "status": "ok",
            "answer": answer,
            "result": final
        }), 200

    except Exception as e:
        logger.exception("agent/respond failed")
        return jsonify({"error": "internal", "detail": str(e)}), 500

# lightweight health
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "groq_key_present": bool(GROQ_API_KEY)
    })

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 6000))
    app.run(host="0.0.0.0", port=port)
