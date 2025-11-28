import re

def planner_agent(user_query: str):
    q = user_query.lower()
    plan = {"steps": []}

    # ----------------------------------------------------
    # 1) SAVINGS ANALYSIS
    # ----------------------------------------------------
    if any(w in q for w in ["savings", "saving rate", "save more", "improve savings"]):
        plan["steps"].append({"agent": "savings_analyzer"})
        plan["steps"].append({"agent": "advisor"})
        return plan

    # ----------------------------------------------------
    # 2) INVESTMENT ADVICE
    # ----------------------------------------------------
    if any(w in q for w in ["invest", "investment", "portfolio", "returns", "opportunities"]):
        plan["steps"].append({"agent": "investment_agent"})
        plan["steps"].append({"agent": "advisor"})
        return plan

    # ----------------------------------------------------
    # 3) AUTOMATION RULES
    # ----------------------------------------------------
    if any(w in q for w in ["automation", "automate", "auto-pay", "rules", "setup automation"]):
        plan["steps"].append({"agent": "automation_agent"})
        plan["steps"].append({"agent": "advisor"})
        return plan

    # ----------------------------------------------------
    # 4) FORECASTING (MUST COME BEFORE SPENDING RULE!)
    # ----------------------------------------------------
    if any(w in q for w in [
        "forecast", "predict", "projection", "estimate",
        "future", "next month", "next week", "spending next month",
        "expected spending", "cashflow", 
        "forecast my spending", "forecast my spendings",
        "spending forecast", "expense forecast"
    ]):
        plan["steps"].append({"agent": "forecaster"})
        plan["steps"].append({"agent": "advisor"})
        return plan

    # ----------------------------------------------------
    # 5) RISK CHECK
    # ----------------------------------------------------
    if any(w in q for w in ["risk", "danger", "critical", "alert", "overspending"]):
        plan["steps"].append({"agent": "risk_checker"})
        plan["steps"].append({"agent": "advisor"})
        return plan

    # ----------------------------------------------------
    # 6) SPENDING ANALYSIS (Placed *after* forecast)
    # ----------------------------------------------------
    if any(w in q for w in ["spend ", "spent", "analysis", "where did my money go"]):
        plan["steps"].append({"agent": "analyst"})
        plan["steps"].append({"agent": "advisor"})
        return plan

    # ----------------------------------------------------
    # FALLBACK
    # ----------------------------------------------------
    plan["steps"].append({"agent": "analyst"})
    plan["steps"].append({"agent": "advisor"})
    return plan
