import json
from agents.analyst_agent import analyst_agent
from agents.forecast_agent import forecast_agent
from agents.classifier_agent import classifier_agent
from agents.risk_agent import risk_agent
from agents.llm import call_llm

from api.src.memory import (
    get_user_profile,
    get_goals,
    get_spending_pattern,
    fix_mongo_ids
)



def advisor_agent(user_id: str, user_message: str) -> dict:
    """
    NeuroFin Senior Advisor:
    Combines all sub-agents + memory + LLM synthesis.
    """

    # -------------------------------
    # 1) Load memory data (ObjectId → str)
    # -------------------------------
    profile = fix_mongo_ids(get_user_profile(user_id))
    goals = fix_mongo_ids(get_goals(user_id))
    patterns = fix_mongo_ids(get_spending_pattern(user_id))

    # -------------------------------
    # 2) Run sub-agents (also fix id fields)
    # -------------------------------
    analyst = fix_mongo_ids(analyst_agent(user_id))
    forecast = forecast_agent(user_id)
    risk_eval = risk_agent(user_id)
    classifier_stats = classifier_agent(user_id)

    # -------------------------------
    # 3) Build LLM reasoning prompt
    # -------------------------------
    prompt = f"""
You are NeuroFin’s Senior Financial Advisor AI.

User message:
"{user_message}"

User Profile:
{json.dumps(profile, indent=2)}

User Goals:
{json.dumps(goals, indent=2)}

Spending Pattern Memory:
{json.dumps(patterns, indent=2)}

Analyst Insights:
{json.dumps(analyst, indent=2)}

30-Day Forecast:
{json.dumps(forecast, indent=2)}

Risk Assessment:
{json.dumps(risk_eval, indent=2)}

Spending Classification:
{json.dumps(classifier_stats, indent=2)}

Now produce a final advisory message for the user in this structure:

1. **Summary Insight** (1–2 lines)
2. **Your Financial Health** — explain the risk clearly
3. **Goal Progress & Feasibility**
4. **Personalized Plan: 3 actionable steps**
5. **If danger: Immediate warning in ONE sentence**

Tone: empathetic, helpful, concise, professional.
"""

    # -------------------------------
    # 4) LLM final answer
    # -------------------------------
    answer = call_llm(prompt)

    return {
        "advisor_response": answer,
        "profile": profile,
        "goals": goals,
        "patterns": patterns,
        "analyst": analyst,
        "forecast": forecast,
        "risk": risk_eval,
        "classifier_stats": classifier_stats
    }
