# agent/agents/insights_agent.py

from agent.agents.forecast_agent import forecast_agent
from agent.agents.savings_analyzer_agent import savings_analyzer_agent
from agent.agents.investment_agent import investment_agent
from agent.agents.analyst_agent import analyst_agent

from pymongo import MongoClient
import os

# Mongo for investment_agent input
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB = MongoClient(MONGO_URI)["neurofin"]
SANDBOX = DB["sandboxmonthlytransactions"]


# ---------------- FORECAST INSIGHT ----------------
def insights_from_forecast():
    fore = forecast_agent()

    trend = fore.get("trend", "STABLE")
    next_month = fore.get("next_month_total", 0)

    impact = (
        "High" if trend == "UPWARD"
        else "Medium" if trend == "STABLE"
        else "Low"
    )

    return {
        "id": 1,
        "icon": "TrendingUp",
        "color": "#10b981",
        "title": "Future Spending Forecast",
        "description": (
            f"Your spending trend is {trend.lower()}, "
            f"projected at ₹{int(next_month):,} next month."
        ),
        "impact": impact,
        "confidence": 92,
        "potential": f"₹{int(next_month/12):,}/month risk",
        "recommendation": "Review your monthly budgets and adjust spending caps.",
        "action": "View Forecast",
        "tags": ["Forecast", "Spending", "Trends"]
    }


# ---------------- SAVINGS INSIGHT ----------------
def insights_from_savings(user_id=None):
    sv = savings_analyzer_agent()  # updated, no user_id now
    score = int(sv.get("savings_score", 50))

    impact = "High" if score < 40 else "Medium" if score < 70 else "Low"

    drains = sv.get("drains", [])
    drain = drains[0] if drains else "general expenses"

    return {
        "id": 2,
        "icon": "Lightbulb",
        "color": "#f59e0b",
        "title": "Savings Health Insight",
        "description": f"Your savings score is {score}/100. Major drain: {drain}.",
        "impact": impact,
        "confidence": 88,
        "potential": f"+₹{int(score * 120):,}/year possible savings",
        "recommendation": "Reduce unnecessary recurring expenses and increase SIPs by 10%.",
        "action": "Improve Savings",
        "tags": ["Savings", "Habits", "Optimization"]
    }


# ---------------- INVESTMENT INSIGHT ----------------
def insights_from_investments():
    # investment_agent expects a COLLECTION input
    inv = investment_agent(SANDBOX)

    risk = inv.get("risk_level", "LOW")

    impact = "High" if risk == "HIGH" else "Medium" if risk == "MEDIUM" else "Low"

    return {
        "id": 3,
        "icon": "DollarSign",
        "color": "#3b82f6",
        "title": "Portfolio Risk Analysis",
        "description": f"Your portfolio risk level is {risk}.",
        "impact": impact,
        "confidence": 90,
        "potential": "Opportunity to rebalance asset allocation",
        "recommendation": "Shift 10–15% from equity to debt for stability.",
        "action": "Rebalance Portfolio",
        "tags": ["Investment", "Risk", "Portfolio"]
    }


# ---------------- SPENDING INSIGHT ----------------
def insights_from_spending():
    analysis = analyst_agent()
    top = analysis.get("top_spends", [])
    cat = top[0]["category"] if top else "miscellaneous"

    return {
        "id": 4,
        "icon": "AlertTriangle",
        "color": "#f43f5e",
        "title": "Overspending Detected",
        "description": f"You are overspending in {cat}.",
        "impact": "High",
        "confidence": 95,
        "potential": "₹5,000–₹12,000 monthly savings potential",
        "recommendation": f"Reduce {cat} spending by 10% this month.",
        "action": "Reduce Overspending",
        "tags": ["Spending", "Alert", "Risk"]
    }


# ---------------- MAIN ENTRY ----------------
def insights_agent(user_id=None):
    return [
        insights_from_forecast(),
        insights_from_savings(),
        insights_from_investments(),
        insights_from_spending()
    ]
