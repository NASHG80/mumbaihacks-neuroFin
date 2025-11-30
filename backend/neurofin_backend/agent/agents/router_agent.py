import re
import requests

# agent/agents/router_agent.py

from agent.agents.planner_agent import planner_agent
from agent.agents.analyst_agent import analyst_agent
from agent.agents.forecast_agent import forecast_agent
from agent.agents.classifier_agent import classifier_agent
from agent.agents.llm import call_llm
from agent.agents.risk_agent import risk_agent
from agent.agents.investment_agent import investment_agent
from agent.agents.savings_analyzer_agent import savings_analyzer_agent
from agent.agents.automation_agent import automation_agent

# ----------------------------------------------------
# INTENT DETECTION
# ----------------------------------------------------
def detect_intent(message):
    q = message.lower()

    if any(w in q for w in ["forecast", "next month", "projection", "future"]):
        return "FORECAST"

    if any(w in q for w in ["saving", "save more", "savings rate"]):
        return "ANALYZE_SAVINGS"

    if any(w in q for w in ["invest", "portfolio", "mutual fund", "stock"]):
        return "INVESTMENT_ADVICE"

    if "risk" in q:
        return "RISK_CHECK"

    if any(w in q for w in ["spending", "analysis", "expenses"]):
        return "ANALYZE_SPENDING"

    return "WEEKLY_SUMMARY"


# ----------------------------------------------------
# ROUTER AGENT (MAIN LOGIC)
# ----------------------------------------------------
def router_agent(user_id, message):
    intent = detect_intent(message)

    # Call supporting agents
    analyst_data = analyst_agent(user_id)
    forecast_data = forecast_agent(user_id)          # FIX ✔ expects user_id only
    risk_data = risk_agent(user_id)
    investment_data = investment_agent(user_id)
    savings_data = savings_analyzer_agent(user_id)

    # ------------------------------------------------
    # FORECAST
    # ------------------------------------------------
    if intent == "FORECAST":
        prompt = f"""
Generate a clear, simple financial forecast based on this data:

{forecast_data}

Return:
- 30-day summary
- Trend interpretation
- Risks
- One actionable recommendation
"""
        return {"answer": call_llm(prompt)}

    # ------------------------------------------------
    # SPENDING ANALYSIS
    # ------------------------------------------------
    if intent == "ANALYZE_SPENDING":
        prompt = f"""
User spending data:
{analyst_data}

Write:
- 4 insights
- 3 improvements
- Spending risk score
"""
        return {"answer": call_llm(prompt)}

    # ------------------------------------------------
    # SAVINGS ANALYSIS
    # ------------------------------------------------
    if intent == "ANALYZE_SAVINGS":
        prompt = f"""
Savings profile:
{savings_data}

Explain:
- Savings health
- How much user should ideally save
- 3 improvement strategies
"""
        return {"answer": call_llm(prompt)}

    # ------------------------------------------------
    # INVESTMENT ADVICE
    # ------------------------------------------------
    if intent == "INVESTMENT_ADVICE":
        prompt = f"""
Investment profile:
{investment_data}

Write:
- Ideal portfolio allocation
- 3 safe options
- 3 growth options
- Risk score
"""
        return {"answer": call_llm(prompt)}

    # ------------------------------------------------
    # RISK CHECK
    # ------------------------------------------------
    if intent == "RISK_CHECK":
        prompt = f"""
Risk data:
{risk_data}

Explain:
- Major risk factors
- Probability of financial instability
- Fixes the user should apply immediately
"""
        return {"answer": call_llm(prompt)}

    # ------------------------------------------------
    # DEFAULT → WEEKLY SUMMARY
    # ------------------------------------------------
    summary_prompt = f"""
Create a weekly summary using:

Spending Analysis:
{analyst_data}

Risk Profile:
{risk_data}

Forecast:
{forecast_data}

Write:
- 3 key insights
- Current financial score (0–100)
- 3 fixes for next week
"""
    return {"answer": call_llm(summary_prompt)}
