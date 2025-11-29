from pymongo import MongoClient
import os
import numpy as np

from agent.agents.forecast_agent import forecast_agent
from agent.agents.analyst_agent import analyst_agent
from api.src.memory import fix_mongo_ids


# -------------------------------------------------------
# CONNECT TO NEW SANDBOX COLLECTION (if needed)
# -------------------------------------------------------
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB = MongoClient(MONGO_URI)["neurofin"]


def risk_agent(user_id=None):
    """
    Updated Risk Agent:
    ✔ Uses updated analyst_agent()
    ✔ Uses updated forecast_agent()
    ✔ Uses sandboxmonthlytransactions (indirectly)
    ✔ No user_id required
    ✔ Risk logic based on new forecast fields
    """

    # Pull analysis + forecast from upgraded agents
    analyst = analyst_agent()        # NEW – no user_id
    forecast = forecast_agent()      # NEW – no user_id

    risk_score = 0
    issues = []

    # ------------------------------------------------------------
    # 1️⃣ Daily spending risk
    # ------------------------------------------------------------
    daily_avg = analyst.get("daily_avg", 0)

    if daily_avg > 2500:
        risk_score += 35
        issues.append("Your daily spending is very high compared to typical Indian households.")
    elif daily_avg > 1500:
        risk_score += 20
        issues.append("Your daily expenses are above average.")

    # ------------------------------------------------------------
    # 2️⃣ Category imbalance risk
    # ------------------------------------------------------------
    cats = analyst.get("categories", {})
    total = sum(cats.values()) if cats else 0

    for cat, amt in cats.items():
        if total > 0 and (amt / total) > 0.35:
            risk_score += 15
            issues.append(f"Your spending on '{cat}' is disproportionately high.")
            break

    # ------------------------------------------------------------
    # 3️⃣ Forecast-based risk (downward trend = overspending risk)
    # ------------------------------------------------------------
    trend = forecast.get("trend", "STABLE")

    if trend == "DOWNWARD":
        risk_score += 25
        issues.append("Your spending trend is increasing faster than your income pattern.")

    # ------------------------------------------------------------
    # 4️⃣ Large future expense projection risk
    # ------------------------------------------------------------
    next_month = forecast.get("next_month_total", 0)
    if next_month > 60000:
        risk_score += 20
        issues.append("Your next month projected spending is very high.")

    # ------------------------------------------------------------
    # 5️⃣ Runway risk (if runway_days predicted)
    # ------------------------------------------------------------
    runway = forecast.get("runway_days")
    if runway is not None and runway < 20:
        risk_score += 30
        issues.append("You may run out of money in under 20 days based on spending patterns.")

    # ------------------------------------------------------------
    # Assign final risk category
    # ------------------------------------------------------------
    if risk_score >= 70:
        risk_level = "HIGH"
    elif risk_score >= 40:
        risk_level = "MODERATE"
    else:
        risk_level = "LOW"

    return fix_mongo_ids({
        "risk_level": risk_level,
        "risk_score": int(risk_score),
        "issues": issues,
        "trend": trend,
        "next_month_projection": next_month,
        "runway_days": runway,
        "summary": f"Risk Level: {risk_level} ({risk_score} points)"
    })
