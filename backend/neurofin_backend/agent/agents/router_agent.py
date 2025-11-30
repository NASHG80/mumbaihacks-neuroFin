from agent.agents.analyst_agent import analyst_agent
from agent.agents.forecast_agent import forecast_agent
from agent.agents.classifier_agent import classifier_agent
from agent.agents.risk_agent import risk_agent
from agent.agents.llm import call_llm
from agent.agents.savings_analyzer_agent import savings_analyzer_agent
from agent.agents.automation_agent import automation_agent
from agent.agents.investment_agent import investment_agent

from pymongo import MongoClient
import os


# ------- Investment needs collection passed manually -------
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB = MongoClient(MONGO_URI)["neurofin"]
SANDBOX = DB["sandboxmonthlytransactions"]


# ----------------------------------------------------
# INTENT DETECTION
# ----------------------------------------------------
def detect_intent(message):
    q = message.lower()

    if any(w in q for w in ["forecast", "next month", "projection", "future"]):
        return "FORECAST"

    if any(w in q for w in ["saving", "save more", "savings rate", "savings"]):
        return "ANALYZE_SAVINGS"

    if any(w in q for w in ["invest", "portfolio", "mutual fund", "stock"]):
        return "INVESTMENT_ADVICE"

    if "risk" in q:
        return "RISK_CHECK"

    if any(w in q for w in ["spending", "analysis", "expenses"]):
        return "ANALYZE_SPENDING"

    return "WEEKLY_SUMMARY"



# ----------------------------------------------------
# ROUTER AGENT (FINAL OUTPUT-OPTIMIZED VERSION)
# ----------------------------------------------------
def router_agent(user_id, message):

    intent = detect_intent(message)

    # ============================
    #         FORECAST
    # ============================
    if intent == "FORECAST":
        data = forecast_agent()

        prompt = f"""
You MUST respond in clean plain text.
No markdown, no hashtags, no stars (*), no hyphens (-).
Use only:
• for bullet points
1. 2. 3. for ordered lists
₹ for currency.

Format EXACTLY like this:

30 Day Forecast
• Trend: <trend>
• Projected Spending: ₹<next_month>

Risks
1. <risk1>
2. <risk2>

Recommendation
• <one action>

Here is the forecast data:
{data}
"""

        return {"answer": call_llm(prompt)}



    # ============================
    #     SPENDING ANALYSIS
    # ============================
    if intent == "ANALYZE_SPENDING":
        data = analyst_agent()

        prompt = f"""
You MUST output clean plain text.
No markdown, no hyphens, no hashtags, no stars.

Use the format:

Spending Insights
• <insight1>
• <insight2>
• <insight3>
• <insight4>

Improvements
1. <improve1>
2. <improve2>
3. <improve3>

Spending Risk Score
• <score>

Here is the spending data:
{data}
"""

        return {"answer": call_llm(prompt)}



    # ============================
    #     SAVINGS ANALYSIS
    # ============================
    if intent == "ANALYZE_SAVINGS":
        data = savings_analyzer_agent()

        prompt = f"""
Return a clean financial summary.
No markdown, no hashtags, no hyphens, no stars.
Use ₹ and clean formatting only.

Format EXACTLY like this:

Savings Health
• Score: <score>/100
• Net Savings: ₹<net_savings>
• Savings Rate: <rate>%

Ideal Savings
• Suggested Target: ₹<ideal>
• Gap From Target: ₹<gap>

Top Issues
1. <category1>: ₹<amount1>
2. <category2>: ₹<amount2>
3. <category3>: ₹<amount3>

Improvement Plan
• <tip1>
• <tip2>
• <tip3>

Here is the savings data:
{data}
"""

        return {"answer": call_llm(prompt)}



    # ============================
    #     INVESTMENT ADVICE
    # ============================
    if intent == "INVESTMENT_ADVICE":
        data = investment_agent(SANDBOX)

        prompt = f"""
Generate clean investment advice.
No markdown, no hashtags, no stars, no hyphens.
Use clean readable text and ₹.

Format:

Investment Overview
• Total Value: ₹<value>
• Risk Level: <risk>

Ideal Allocation
1. <alloc1>
2. <alloc2>
3. <alloc3>

Safe Options
• <safe1>
• <safe2>
• <safe3>

Growth Options
• <growth1>
• <growth2>
• <growth3>

Recommendation
• <one actionable tip>

Here is the data:
{data}
"""

        return {"answer": call_llm(prompt)}



    # ============================
    #         RISK CHECK
    # ============================
    if intent == "RISK_CHECK":
        data = risk_agent()

        prompt = f"""
Provide a clean risk summary.
No markdown, no hashtags, no hyphens, no stars.

Format:

Risk Level
• <level>

Major Risks
1. <risk1>
2. <risk2>
3. <risk3>

Stability Probability
• <percent>

Fixes
• <fix1>
• <fix2>
• <fix3>

Here is the risk data:
{data}
"""

        return {"answer": call_llm(prompt)}



    # ============================
    #     WEEKLY SUMMARY (DEFAULT)
    # ============================
    analyst_data = analyst_agent()
    risk_data = risk_agent()
    forecast_data = forecast_agent()

    summary_prompt = f"""
Generate a weekly summary.
No markdown, no hashtags, no stars, no hyphens.

Format:

Weekly Insights
• <insight1>
• <insight2>
• <insight3>

Financial Score
• <score>/100

Fixes For Next Week
1. <fix1>
2. <fix2>
3. <fix3>

Here is the data:

Spending:
{analyst_data}

Risk:
{risk_data}

Forecast:
{forecast_data}
"""

    return {"answer": call_llm(summary_prompt)}
