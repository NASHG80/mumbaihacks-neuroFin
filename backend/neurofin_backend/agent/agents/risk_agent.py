from pymongo import MongoClient
import os
import numpy as np

from api.src.memory import get_spending_pattern, fix_mongo_ids
from agents.forecast_agent import forecast_agent
from agents.analyst_agent import analyst_agent

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB = MongoClient(MONGO_URI)["neurofin"]

def risk_agent(user_id: str):
    """
    Calculates financial risk using spending patterns + forecast.
    """

    analyst = analyst_agent(user_id)
    forecast = forecast_agent(user_id)
    patterns = get_spending_pattern(user_id)

    risk_score = 0
    issues = []

    # 1) Daily spending
    daily_avg = analyst.get("daily_avg", 0)
    if daily_avg > 2000:
        risk_score += 30
        issues.append("Your daily spending is unusually high.")
    elif daily_avg > 1200:
        risk_score += 15

    # 2) Category risk (Food & Drink too high)
    cats = analyst.get("categories", {})
    total = sum(abs(v) for v in cats.values())
    fnd = abs(cats.get("Food & Drink", 0))
    if total > 0 and fnd / total > 0.30:
        risk_score += 20
        issues.append("Too much spending on Food & Drink category.")

    # 3) Forecast risk (runout)
    if forecast.get("runout_date"):
        risk_score += 40
        issues.append("Your balance may run out based on current burn rate.")

    # 4) Basic classification
    if risk_score >= 60:
        level = "HIGH"
    elif risk_score >= 30:
        level = "MODERATE"
    else:
        level = "LOW"

    result = {
        "risk_level": level,
        "risk_score": risk_score,
        "issues": issues,
        "forecast_based_risk": forecast.get("runout_date"),
        "summary": f"Risk Level: {level} ({risk_score} points)"
    }

    return fix_mongo_ids(result)
