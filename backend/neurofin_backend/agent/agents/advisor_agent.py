import json

# Imports
from agent.agents.analyst_agent import analyst_agent
from agent.agents.forecast_agent import forecast_agent
from agent.agents.classifier_agent import classifier_agent
from agent.agents.risk_agent import risk_agent
from agent.agents.llm import call_llm

from api.src.memory import (
    get_user_profile,
    get_goals,
    get_spending_pattern,
    fix_mongo_ids
)


def advisor_agent(user_id: str, user_message: str) -> dict:
    """
    NeuroFin Senior Advisor
    All sub-agents now use sandboxmonthlytransactions.
    advisor_agent combines memory + analytics + LLM summarization.
    """

    # ------------------------------------------
    # 1️⃣ Load persistent memory (ONLY these need fix_mongo_ids)
    # ------------------------------------------
    profile = fix_mongo_ids(get_user_profile(user_id))
    goals = fix_mongo_ids(get_goals(user_id))
    patterns = fix_mongo_ids(get_spending_pattern(user_id))

    # ------------------------------------------
    # 2️⃣ Sub-agents (DO NOT use fix_mongo_ids)
    # ------------------------------------------
    try:
        analyst = analyst_agent()
    except:
        analyst = {"error": "analyst_failed"}

    try:
        forecast = forecast_agent()
    except:
        forecast = {"error": "forecast_failed"}

    try:
        risk_eval = risk_agent()
    except:
        risk_eval = {"error": "risk_failed"}

    try:
        classifier_stats = classifier_agent()
    except:
        classifier_stats = {"error": "classifier_failed"}

    # ------------------------------------------
    # 3️⃣ Build final LLM prompt
    # ------------------------------------------
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

Now create a final advisory message:

1. Summary Insight (1–2 sentences)
2. Your Financial Health — explain risk clearly
3. Goal Progress & Feasibility
4. Personalized Plan — 3 actionable steps
5. If any danger → One-sentence urgent warning

Tone: empathetic, helpful, professional.
"""

    # ------------------------------------------
    # 4️⃣ Get final AI response
    # ------------------------------------------
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
