import re
import requests

from agents.planner_agent import planner_agent
from api.src.memory import (
    get_user_profile,
    update_user_profile,
    get_goals,
    add_goal,
    get_spending_pattern,
    fix_json
)

from agents.analyst_agent import analyst_agent
from agents.forecast_agent import forecast_agent
from agent.agents.advisor_agent import advisor_agent
from agents.risk_agent import risk_agent
from agents.classifier_agent import classifier_agent
from agents.llm import call_llm

from agents.investment_agent import investment_agent
from agents.savings_analyzer_agent import savings_analyzer_agent
from agents.automation_agent import automation_agent


# ---------------------------------------------------
# ⭐ NANDA TAX AGENT
# ---------------------------------------------------
def nanda_tax_agent(message: str):
    try:
        res = requests.post(
            "http://localhost:7000/a2a",
            json={"input": message}
        )
        data = res.json()
        return data.get("output_text", "⚠️ Nanda didn't return any response.")
    except Exception as e:
        return f"❌ Nanda error: {str(e)}"


# ---------------------------------------------------
# ⭐ INTENT DETECTION
# ---------------------------------------------------
def detect_intent(message: str):
    q = message.lower()

    # TAX BOT
    if any(w in q for w in ["tax", "80c", "80d", "80ccd", "regime", "nanda"]):
        return "NANDA_TAX"

    # FORECASTING INTENT
    if any(w in q for w in [
        "forecast", "predict", "projection", "future",
        "next month", "next year", "10 years",
        "spending forecast", "cashflow", "expense forecast"
    ]):
        return "FORECAST"

    # SPENDING ANALYSIS
    if any(w in q for w in ["analysis", "breakdown", "review spending"]):
        return "ANALYZE_SPENDING"

    # SAVINGS
    if any(w in q for w in ["save", "saving", "improve savings"]):
        return "ANALYZE_SAVINGS"

    # INVESTMENT
    if any(w in q for w in ["invest", "investment", "portfolio", "sip"]):
        return "INVESTMENT_ADVICE"

    # AUTOMATION
    if "automation" in q:
        return "AUTOMATION_HELP"

    # RISK
    if "risk" in q:
        return "RISK_CHECK"

    return "WEEKLY_SUMMARY"


# ---------------------------------------------------
# ⭐ MAIN ROUTER
# ---------------------------------------------------
def router_agent(user_id: str, message: str):
    intent = detect_intent(message)

    analyst = analyst_agent(user_id)
    forecast_data = forecast_agent(user_id)
    risk = risk_agent(user_id)

    # -----------------------------------------------
    # 1️⃣ NANDA TAX
    # -----------------------------------------------
    if intent == "NANDA_TAX":
        return fix_json({
            "intent": "NANDA_TAX",
            "answer": nanda_tax_agent(message)
        })


    # -----------------------------------------------
    # 2️⃣ ⭐ ADVANCED FORECAST BLOCK (FINAL)
    # -----------------------------------------------
    if intent == "FORECAST":
        fore = forecast_data

        prompt = f"""
You are a senior financial forecasting expert for Indian users.

Below is the raw forecast data:
{fore}

Write a fully structured forecast narrative with the following sections:

1) Short-Term Forecast (Next 7 Days)
   - Expected daily spending pattern
   - Highest-risk day
   - Short-term cashflow movement

2) Next Month Forecast
   - Expected spending total for the month (₹)
   - Trend direction (upward / downward / stable)
   - Category-wise spending prediction (₹)
   - Expected spikes (food, transport, shopping, bills)

3) 3-Month Projection
   - Total expected spending next 3 months
   - Savings probability
   - Expected category inflation
   - Subscription burn estimate

4) One-Year Projection
   - Expected annual spend (₹)
   - Lifestyle creep impact
   - Festival & travel seasonality
   - Overspending risk
   - Savings rate movement

5) Five-Year & Ten-Year Outlook
   - Long-term expense trajectory
   - Financial stability vs debt-risk
   - Inflation-adjusted impact
   - Net-worth projection (basic)

6) Category-Wise Future Forecast
   - Fastest growing categories
   - Stable categories
   - High-risk categories
   - Provide numbers (₹)

7) Subscription & EMI Forecast
   - Annual subscription estimate (₹)
   - EMI stress months
   - Recurring charge risks

8) Habit-Based Predictions
   - Weekend vs weekday patterns
   - End-of-month spikes
   - Late-night spending risks
   - Unusual patterns

9) Runway & Burn Rate
   - Daily burn rate (₹)
   - Days until balance may run out
   - Burn pattern: healthy/unhealthy

10) Risk Index (0–100)
    - Meaning of score
    - Overspending probability
    - High-risk categories
    - Cashflow pressure

11) Alerts & Warnings
    - Critical upcoming risks
    - Subscription renewals
    - Merchant patterns

12) Actionable Recommendations
    - Budget adjustments
    - Category caps
    - Behaviour improvements
    - 2 automation rules
    - Ideal savings target

Rules:
- Do NOT use hashtags.
- Use clean headings and bullet points.
- Must use ₹ currency.
"""

        reply = call_llm(prompt)

        return fix_json({
            "intent": "FORECAST",
            "forecast_raw": fore,
            "answer": reply
        })


    # -----------------------------------------------
    # 3️⃣ SPENDING ANALYSIS
    # -----------------------------------------------
    if intent == "ANALYZE_SPENDING":
        prompt = f"""
Spending Breakdown Report

Weekly breakdown:
{analyst['weekly']}

Highest categories:
{analyst['top_spends']}

Merchant summary:
{analyst['merchant_summary']}

Write:
- 5 insights
- 3 problem areas
- 3 improvement suggestions
"""
        return fix_json({
            "intent": "ANALYZE_SPENDING",
            "answer": call_llm(prompt)
        })


    # -----------------------------------------------
    # 4️⃣ SAVINGS ANALYSIS
    # -----------------------------------------------
    if intent == "ANALYZE_SAVINGS":
        savings = savings_analyzer_agent(user_id)
        prompt = f"""
Savings report:
{savings}

Write:
- Savings health score
- Whether savings rate is healthy
- What drains savings
- 4 practical improvement steps
"""
        return fix_json({
            "intent": "ANALYZE_SAVINGS",
            "answer": call_llm(prompt)
        })


    # -----------------------------------------------
    # 5️⃣ INVESTMENT ADVICE
    # -----------------------------------------------
    if intent == "INVESTMENT_ADVICE":
        inv = investment_agent(user_id)
        prompt = f"""
Investment report:
{inv}

Write:
- Suggested investment plan
- Portfolio reasoning
- SIP guidance
- Short-term vs long-term strategy
"""
        return fix_json({
            "intent": "INVESTMENT_ADVICE",
            "answer": call_llm(prompt)
        })


    # -----------------------------------------------
    # 6️⃣ RISK REPORT
    # -----------------------------------------------
    if intent == "RISK_CHECK":
        prompt = f"""
Risk data:
{risk}

Write:
- Overspending risks
- Burn-rate risk
- Category vulnerabilities
- 5 prevention steps
"""
        return fix_json({
            "intent": "RISK_CHECK",
            "answer": call_llm(prompt)
        })


    # -----------------------------------------------
    # 7️⃣ WEEKLY SUMMARY (DEFAULT)
    # -----------------------------------------------
    summary_prompt = f"""
Weekly Summary

Total spent: ₹{analyst['total_spent']}
Daily average: ₹{analyst['daily_avg']}
Top categories: {analyst['top_spends']}
Forecast summary: {forecast_data['summary']}
Risk alerts: {risk['issues']}

Write:
- Full weekly summary
- High & low spending days
- Category insights
- 3 recommendations
"""
    return fix_json({
        "intent": "WEEKLY_SUMMARY",
        "answer": call_llm(summary_prompt)
    })
