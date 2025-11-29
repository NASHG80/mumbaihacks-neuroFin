import re

def planner_agent(user_query: str):
    """
    NeuroFin Planner Agent:
    Maps user query → which agents should run.
    Output format:
        { "steps": [ {"agent": "some_agent"} ] }
    """

    q = user_query.lower().strip()
    plan = {"steps": []}

    # ----------------------------------------------------
    # 1) SAVINGS ANALYSIS
    # ----------------------------------------------------
    if any(w in q for w in [
        "savings", "saving rate", "save more",
        "increase savings", "optimize savings",
        "improve savings"
    ]):
        plan["steps"].append({"agent": "savings_analyzer"})
        plan["steps"].append({"agent": "advisor"})
        return plan

    # ----------------------------------------------------
    # 2) INVESTMENT ADVICE
    # ----------------------------------------------------
    if any(w in q for w in [
        "invest", "investment", "portfolio",
        "returns", "sip", "mutual fund",
        "stock market", "where to invest"
    ]):
        plan["steps"].append({"agent": "investment_agent"})
        plan["steps"].append({"agent": "advisor"})
        return plan

    # ----------------------------------------------------
    # 3) AUTOMATION RULES
    # ----------------------------------------------------
    if any(w in q for w in [
        "automation", "automate", "auto-pay",
        "auto pay", "auto debit", "rules",
        "setup automation", "payment reminder"
    ]):
        plan["steps"].append({"agent": "automation_agent"})
        plan["steps"].append({"agent": "advisor"})
        return plan

    # ----------------------------------------------------
    # 4) FORECASTING (IMPORTANT → NO ADVISOR HERE)
    # ----------------------------------------------------
    if any(w in q for w in [
        "forecast", "predict", "projection", "estimate",
        "future", "next month", "next week",
        "expected spending", "cashflow", "trend",
        "spending next month", "expense forecast",
        "forecast my spendings", "prediction"
    ]):
        plan["steps"].append({"agent": "forecaster"})
        return plan     # DO NOT append advisor here

    # ----------------------------------------------------
    # 5) RISK CHECK
    # ----------------------------------------------------
    if any(w in q for w in [
        "risk", "overspending", "danger", "alert",
        "risk analysis", "risk check", "critical",
        "running out of money", "burn rate"
    ]):
        plan["steps"].append({"agent": "risk_checker"})
        plan["steps"].append({"agent": "advisor"})
        return plan

    # ----------------------------------------------------
    # 6) SPENDING ANALYSIS
    # ----------------------------------------------------
    if any(w in q for w in [
        "spent", "spending", "analysis", "breakdown",
        "expense breakdown", "where did my money go",
        "spend analysis", "spending review"
    ]):
        plan["steps"].append({"agent": "analyst"})
        plan["steps"].append({"agent": "advisor"})
        return plan

    # ----------------------------------------------------
    # 7) DEFAULT → WEEKLY SUMMARY
    # ----------------------------------------------------
    plan["steps"].append({"agent": "analyst"})
    plan["steps"].append({"agent": "advisor"})
    return plan
