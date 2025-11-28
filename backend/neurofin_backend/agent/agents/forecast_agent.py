from pymongo import MongoClient
import numpy as np
from datetime import datetime, timedelta
import os

from api.src.memory import fix_mongo_ids

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB = MongoClient(MONGO_URI)["neurofin"]
transactions = DB["transactions"]

def safe_polyfit(x, y, deg):
    """Safe wrapper around np.polyfit to avoid SVD errors."""
    try:
        return np.polyfit(x, y, deg)
    except Exception:
        # fallback: zero slope
        return [0, float(np.mean(y))]  


def forecast_agent(user_id: str) -> dict:
    """
    Safe financial forecast that NEVER crashes due to SVD issues.
    """

    txs = list(transactions.find({"user_id": user_id}))

    if len(txs) < 5:
        return {
            "summary": "Insufficient data for forecast",
            "trend": "unknown",
            "burn_rate": 0,
            "predicted_next_30_days": [],
            "runout_date": None
        }

    # Aggregate daily balances
    daily_map = {}
    for t in txs:
        amt = float(t.get("amount", 0))
        if t.get("direction") == "credit":
            amt = -abs(amt)

        ts = str(t.get("timestamp", ""))[:10]

        # skip invalid dates
        try:
            datetime.fromisoformat(ts)
        except:
            continue

        daily_map[ts] = daily_map.get(ts, 0) + amt

    # Clean daily values
    dates = sorted(daily_map.keys())
    y = np.array([daily_map[d] for d in dates], dtype=float)

    # Remove NaNs and infs
    y = y[~np.isnan(y)]
    y = y[np.isfinite(y)]

    if len(y) < 3:
        return {
            "summary": "Not enough clean data for forecast",
            "trend": "unknown",
            "burn_rate": 0,
            "predicted_next_30_days": [],
            "runout_date": None
        }

    # Slope using safe polyfit
    x = np.arange(len(y))
    slope, intercept = safe_polyfit(x, y, 1)

    if slope > 0:
        trend = "UPWARD"
    elif slope < 0:
        trend = "DOWNWARD"
    else:
        trend = "STABLE"

    burn_rate = float(y[-1] - y[-2]) if len(y) > 1 else 0
    burn_rate = round(burn_rate, 2)

    current_balance = y[-1]

    # Predicted runout date
    runout_date = None
    if burn_rate < -50:
        days_left = int(current_balance / abs(burn_rate))
        runout_date = (datetime.utcnow() + timedelta(days=days_left)).isoformat()

    # Predictions
    next_30 = []
    for i in range(1, 31):
        next_30.append({
            "day": i,
            "predicted_balance": round(current_balance + burn_rate * i, 2)
        })

    result = {
        "summary": f"Trend: {trend}, Burn rate: {burn_rate}",
        "trend": trend,
        "burn_rate": burn_rate,
        "current_balance": round(float(current_balance), 2),
        "runout_date": runout_date,
        "predicted_next_30_days": next_30
    }

    return fix_mongo_ids(result)
