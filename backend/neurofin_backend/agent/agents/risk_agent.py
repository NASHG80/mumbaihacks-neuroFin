from pymongo import MongoClient
import os
import numpy as np

from agent.agents.forecast_agent import forecast_agent
from agent.agents.analyst_agent import analyst_agent
from api.src.memory import fix_mongo_ids

# -------------------------------------------------------
# CONNECT TO NEW SANDBOX COLLECTION
# -------------------------------------------------------
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB = MongoClient(MONGO_URI)["neurofin"]


def risk_agent(user_id=None):
    """
    Updated Risk Agent:
    ✔ Uses analyst_agent() and forecast_agent()
    ✔ Works on sandboxmonthlytransactions
    ✔ Correct trend logic (UPWARD = risk)
    ✔ Removes invalid runway_days reference
    """

    analyst = analyst_agent()
    forecast = forecast_agent()

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
        if total > 0 and (amt / total) > 0.40:
            risk_score += 15
            issues.append(f"Your spending on '{cat}' is disproportionately high.")
            break

    # ------------------------------------------------------------
    # 3️⃣ Forecast-based risk
    # ------------------------------------------------------------
    trend = forecast.get("trend", "STABLE")

    if trend == "UPWARD":  # FIXED (previously wrong)
        risk_score += 25
        issues.append("Your spending trend is rising month over month.")

    # ------------------------------------------------------------
    # 4️⃣ Future spending projection risk
    # ------------------------------------------------------------
    next_month = forecast.get("next_month_total", 0)

    if next_month > 60000:
        risk_score += 25
        issues.append("Your projected spending for next month is unusually high.")

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
        "summary": f"Risk Level: {risk_level} ({risk_score} points)"
    })
