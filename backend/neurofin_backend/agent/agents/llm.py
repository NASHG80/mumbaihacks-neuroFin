import os
import time
import random
import requests

# --- config ---
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "groq").lower()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
MODEL = os.getenv("LLM_MODEL", "llama-3.1-8b-instant")


def call_llm(prompt: str) -> str:
    """
    Universal LLM entry function.
    Priority:
    1. Groq (fast, free)
    2. OpenAI (only if configured)
    """

    if LLM_PROVIDER == "groq":
        return groq_llm(prompt)
    else:
        return openai_llm(prompt)


# -------------------------------------------------------
#   GROQ LLaMA-3
# -------------------------------------------------------
def groq_llm(prompt: str) -> str:
    if not GROQ_API_KEY:
        return "[Groq Error] GROQ_API_KEY missing."

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    body = {
        "model": MODEL,
        "messages": [
            {"role": "system", "content": "You are NeuroFin AI assistant."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 300,
        "temperature": 0.2
    }

    try:
        r = requests.post(url, json=body, headers=headers, timeout=15)
        r.raise_for_status()
        data = r.json()

        # Groq uses OpenAI ChatCompletion format
        return data["choices"][0]["message"]["content"]

    except Exception as e:
        return f"[Groq Error] {str(e)}"


# -------------------------------------------------------
#   OPENAI (used only during hackathon)
# -------------------------------------------------------
def openai_llm(prompt: str) -> str:
    if not OPENAI_API_KEY:
        return "[OpenAI Error] OPENAI_API_KEY missing."

    url = "https://api.openai.com/v1/responses"
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }

    body = {
        "model": MODEL,
        "input": prompt,
        "max_output_tokens": 350,
        "temperature": 0.2
    }

    last_err = "Unknown"
    for attempt in range(5):
        try:
            r = requests.post(url, json=body, headers=headers, timeout=20)

            # Rate limit
            if r.status_code == 429:
                wait = (2 ** attempt) + random.random()
                time.sleep(wait)
                continue

            r.raise_for_status()
            data = r.json()

            # Extract the actual text
            output_text = ""
            for o in data.get("output", []):
                for c in o.get("content", []):
                    if isinstance(c, dict) and "text" in c:
                        output_text += c["text"]

            return output_text.strip() or "[OpenAI Warning] No output returned."

        except Exception as e:
            last_err = str(e)

    return f"[OpenAI Error After Retries] {last_err}"
