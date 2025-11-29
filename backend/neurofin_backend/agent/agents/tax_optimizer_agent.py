#!/usr/bin/env python3
import os
from dotenv import load_dotenv
from nanda_core import NANDA
import google.generativeai as genai

# ----------------------------------------------------
# LOAD .env FROM THE SAME FOLDER AS THIS FILE
# ----------------------------------------------------
ENV_PATH = os.path.join(os.path.dirname(__file__), ".env")
load_dotenv(dotenv_path=ENV_PATH)

print("\n🔑 Loaded GOOGLE_API_KEY =", os.getenv("GOOGLE_API_KEY"))

# ----------------------------------------------------
# CONFIGURE GEMINI LLM
# ----------------------------------------------------
genai.configure(api_key=os.getenv("GOOGLE_API_KEY"))


# ----------------------------------------------------
# GEMINI LLM LOGIC (MCP-COMPATIBLE FORMAT)
# ----------------------------------------------------
def agent_logic(message: str, conversation_id: str = "tax-session"):
    system_prompt = f"""
You are {os.getenv('AGENT_NAME','TaxOptimizer')}, an expert Indian Tax Advisor.

Responsibilities:
- Explain Indian income tax rules
- Compare old & new tax regime
- Suggest 80C, 80D, NPS, HRA, 24B deductions
- Provide step-by-step savings strategy
- Answer in clear, simple English
"""

    try:
        model = genai.GenerativeModel("gemini-1.5-flash")

        gemini_response = model.generate_content(
            system_prompt + "\n\nUser: " + message
        )

        final_text = gemini_response.text or "⚠️ Gemini returned empty response."

        # ----------------------------------------------------
        # RETURN RESPONSE IN NANDA MCP FORMAT (REQUIRED)
        # ----------------------------------------------------
        return {
            "messages": [
                {
                    "role": "agent",
                    "parts": [
                        {
                            "type": "output_text",
                            "text": final_text
                        }
                    ]
                }
            ]
        }

    except Exception as e:
        return {
            "messages": [
                {
                    "role": "agent",
                    "parts": [
                        {
                            "type": "output_text",
                            "text": f"⚠️ Gemini Error: {str(e)}"
                        }
                    ]
                }
            ]
        }


# ------------------------------------------------------
# WRAPPER FOR NEUROFIN ROUTER
# ------------------------------------------------------
def tax_optimizer_agent(message: str):
    return agent_logic(message)


# ------------------------------------------------------
# NANDA AGENT SERVER
# ------------------------------------------------------
if __name__ == "__main__":
    port = int(os.getenv("PORT", "7000"))

    print("\n🤖 Starting Gemini Tax Agent…")

    nanda = NANDA(
        agent_id=os.getenv("AGENT_ID", "tax-optimizer-001"),
        agent_logic=agent_logic,
        port=port,
        public_url=f"http://localhost:{port}",
        registry_url=None,          # no registry
        enable_telemetry=False      # disable telemetry
    )

    print(f"✅ Gemini Tax Agent is LIVE!")
    print(f"📡 Local URL: http://localhost:{port}/a2a\n")

    nanda.start()
