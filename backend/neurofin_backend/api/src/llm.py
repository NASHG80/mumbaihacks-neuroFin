# api/src/llm.py
import os
import requests

def call_llm(prompt: str) -> str:
    """
    Calls Groq LLM using Chat Completions API.
    Returns the assistant text response.
    """

    GROQ_API_KEY = os.getenv("GROQ_API_KEY")

    if not GROQ_API_KEY:
        return "❌ ERROR: GROQ_API_KEY missing in environment variables."

    url = "https://api.groq.com/openai/v1/chat/completions"

    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    data = {
        "model": "llama-3.1-8b-instant",     # or llama3.1-70b if enabled
        "messages": [
            {"role": "system", "content": "You are NeuroFin AI. Respond clearly and helpfully."},
            {"role": "user", "content": prompt}
        ],
        "max_tokens": 300
    }

    try:
        r = requests.post(url, json=data, headers=headers, timeout=30)

        if r.status_code != 200:
            return f"❌ Groq API error {r.status_code}: {r.text}"

        response_json = r.json()
        return response_json["choices"][0]["message"]["content"]

    except Exception as e:
        return f"❌ LLM request failed: {e}"
