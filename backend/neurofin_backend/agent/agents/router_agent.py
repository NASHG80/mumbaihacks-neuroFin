import re
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
from agents.advisor_agent import advisor_agent
from agents.risk_agent import risk_agent
from agents.classifier_agent import classifier_agent
from agents.llm import call_llm

# NEW AGENTS
from agents.investment_agent import investment_agent
from agents.savings_analyzer_agent import savings_analyzer_agent
from agents.automation_agent import automation_agent



# --------------------------------------------------
# INTENT DETECTION (FINAL)
# --------------------------------------------------
def detect_intent(message: str):
    q = message.lower()

    # HARD RULES
    if any(w in q for w in ["risk", "danger", "alert", "overspend", "financial danger"]):
        return "RISK_CHECK"

    if any(w in q for w in ["save", "savings rate", "saving rate", "improve savings"]):
        return "ANALYZE_SAVINGS"

    if any(w in q for w in ["invest", "investment", "returns", "portfolio"]):
        return "INVESTMENT_ADVICE"

    if any(w in q for w in ["automation", "automate", "auto pay", "rules"]):
        return "AUTOMATION_HELP"

    # FALLBACK LLM
    prompt = f"""
Classify the intent into ONE label:
ANALYZE_SPENDING, FORECAST, ADD_GOAL, GET_GOALS, PROFILE_UPDATE,
ADVICE, RISK_CHECK, CLASSIFY,
ANALYZE_SAVINGS, INVESTMENT_ADVICE, AUTOMATION_HELP, UNKNOWN

Message: "{message}"

Respond ONLY with the label.
"""
    label = call_llm(prompt).strip().upper()

    allowed = {
        "ANALYZE_SPENDING", "FORECAST", "ADD_GOAL", "GET_GOALS",
        "PROFILE_UPDATE", "ADVICE", "RISK_CHECK", "CLASSIFY",
        "ANALYZE_SAVINGS", "INVESTMENT_ADVICE", "AUTOMATION_HELP", "UNKNOWN"
    }

    return label if label in allowed else "UNKNOWN"



# --------------------------------------------------
# GOAL EXTRACTION
# --------------------------------------------------
def extract_goal(msg: str):
    amount, title, deadline = None, None, None

    match = re.search(r"(\d{3,7})", msg)
    if match:
        amount = int(match.group(1))

    low = msg.lower()
    if "buy" in low:
        title = msg[low.index("buy") + 4:].strip()

    if "month" in low:
        deadline = msg

    return title, amount, deadline



# --------------------------------------------------
# PROFILE UPDATE DETECTION
# --------------------------------------------------
def detect_profile_update(msg: str):
    low = msg.lower()
    match = re.search(r"(\d{4,7})", msg)

    if "salary" in low and match:
        return "salary", int(match.group(1))

    if "rent" in low and match:
        return "rent", int(match.group(1))

    return None, None



# --------------------------------------------------
# MAIN ROUTER AGENT (FINAL VERSION)
# --------------------------------------------------
def router_agent(user_id: str, message: str):
    intent = detect_intent(message)

    profile = get_user_profile(user_id)
    goals = get_goals(user_id)
    pattern = get_spending_pattern(user_id)

    results = {}

    # --------------------------------------------------
    # GOALS + PROFILE UPDATE
    # --------------------------------------------------
    if intent == "ADD_GOAL":
        title, amount, deadline = extract_goal(message)
        goal = add_goal(user_id, title, amount, deadline)
        return fix_json({
            "intent": "ADD_GOAL",
            "goal_saved": goal,
            "answer": f"Goal saved: {title} ({amount})"
        })

    if intent == "GET_GOALS":
        return fix_json({
            "intent": "GET_GOALS",
            "goals": goals,
            "answer": f"You have {len(goals)} active goals."
        })

    if intent == "PROFILE_UPDATE":
        key, value = detect_profile_update(message)
        if key:
            update_user_profile(user_id, key, value)
            return fix_json({
                "intent": "PROFILE_UPDATE",
                "updated_field": key,
                "value": value,
                "answer": f"Updated your {key} to {value}"
            })



    # --------------------------------------------------
    # 🔥 DIRECT RISK ROUTE (BYPASS PLANNER)
    # --------------------------------------------------
    if intent == "RISK_CHECK":
        analyst = analyst_agent(user_id)
        fore = forecast_agent(user_id)
        risk = risk_agent(user_id)

        risk_prompt = f"""
You are a financial risk analyst.

User weekly spend: ₹{analyst.get('total_spent')}
Daily average: ₹{analyst.get('daily_avg')}
Categories: {analyst.get('categories')}
Top categories: {analyst.get('top_spends')}

Risk Score: {risk.get('risk_score')}
Risk Level: {risk.get('risk_level')}
Issues: {risk.get('issues')}
Runout risk: {risk.get('forecast_based_risk')}

Write a clear financial RISK REPORT including:
- Spending vulnerabilities
- Category risk assessment
- Merchant-based risks
- Burn-rate risk
- Overspending risks
- 5 detailed mitigation recommendations

STRICT RULE: No weekly summary. ONLY risk report.
"""
        answer = call_llm(risk_prompt)

        return fix_json({
            "intent": "RISK_CHECK",
            "risk": risk,
            "analyst": analyst,
            "forecast": fore,
            "answer": answer
        })



    # --------------------------------------------------
    # 🔥 NEW AGENTS — SAVINGS / INVESTMENTS / AUTOMATION
    # --------------------------------------------------

    if intent == "ANALYZE_SAVINGS":
        savings = savings_analyzer_agent(user_id)

        prompt = f"""
You are a financial savings expert.

Income: ₹{savings['income']}
Expenses: ₹{savings['expenses']}
Net savings: ₹{savings['net_savings']}
Savings rate: {savings['savings_rate']}%
Categories draining savings: {savings['high_spend_categories']}

Write a savings report including:
- Whether savings rate is good
- What drains savings
- 3–5 personalised savings suggestions
- A final savings improvement plan
No weekly summary.
"""

        answer = call_llm(prompt)

        return fix_json({
            "intent": "ANALYZE_SAVINGS",
            "savings": savings,
            "answer": answer
        })



    if intent == "INVESTMENT_ADVICE":
        inv = investment_agent(user_id)

        prompt = f"""
You are a friendly investment advisor.

Risk profile: {inv['risk_profile']}
Recommended SIP: ₹{inv['recommended_sip_amount']}
Portfolio mix: {inv['portfolio_mix']}
Notes: {inv['notes']}

Write investment advice including:
- Suitable investment strategy
- Why this portfolio mix
- SIP guidance
- 3 actionable investment steps
No weekly summary.
"""

        answer = call_llm(prompt)

        return fix_json({
            "intent": "INVESTMENT_ADVICE",
            "investment": inv,
            "answer": answer
        })



    if intent == "AUTOMATION_HELP":
        automation = automation_agent(user_id)

        prompt = f"""
You are a financial automation expert.

Existing rules:
{automation['rules']}

Write automation help including:
- Explanation of each rule
- Why it's useful
- 2 new automation suggestions
No weekly summary.
"""
        answer = call_llm(prompt)

        return fix_json({
            "intent": "AUTOMATION_HELP",
            "automation": automation,
            "answer": answer
        })



    # --------------------------------------------------
    # DEFAULT PATH: PLANNER (ANALYST → ADVISOR)
    # --------------------------------------------------
    plan = planner_agent(message)

    for step in plan["steps"]:
        agent_name = step["agent"]

        if agent_name == "analyst":
            results["analyst"] = analyst_agent(user_id)

        elif agent_name == "forecaster":
            results["forecaster"] = forecast_agent(user_id)

        elif agent_name == "risk_checker":
            results["risk"] = risk_agent(user_id)

        elif agent_name == "advisor":
            results["advisor"] = advisor_agent(user_id, message)

        elif agent_name == "classifier":
            match = re.search(r"category of (.*)", message.lower())
            if match:
                results["classifier"] = classifier_agent(match.group(1))



    # --------------------------------------------------
    # SAFE NORMALIZATION
    # --------------------------------------------------
    a = results.get("analyst") or {}
    f = results.get("forecaster") or {}
    r = results.get("risk") or {}

    analyst = {
        "total_spent": a.get("total_spent", 0),
        "daily_avg": a.get("daily_avg", 0),
        "weekly": a.get("weekly", {"Mon": 0, "Tue": 0, "Wed": 0, "Thu": 0, "Fri": 0, "Sat": 0, "Sun": 0}),
        "top_spends": a.get("top_spends", []),
        "merchant_summary": a.get("merchant_summary", {}),
        "categories": a.get("categories", {})
    }


    # --------------------------------------------------
    # WEEKLY SUMMARY (PRIMARY DEFAULT OUTPUT)
    # --------------------------------------------------
    summary_prompt = f"""
You are NeuroFin Smart Financial Analyst.

Generate a detailed weekly financial summary.

DATA:
Weekly totals: {analyst['weekly']}
Total spent: ₹{analyst['total_spent']}
Daily avg: ₹{analyst['daily_avg']}
Top categories: {analyst['top_spends']}
Top merchants: {list(analyst['merchant_summary'].keys())[:3]}
Forecast: {f.get('summary', 'No forecast available')}
Risk flags: {r if r else 'No major risks'}

WRITE:
- Weekly spending total
- High vs low spending days
- Category insights
- Merchant trends
- Risks detected (if any)
- 2–3 personalised recommendations

RULES:
- Must output several paragraphs.
- Never output only a heading.
"""

    final_answer = call_llm(summary_prompt)

    return fix_json({
        "intent": intent,
        "results": results,
        "answer": final_answer
    })
