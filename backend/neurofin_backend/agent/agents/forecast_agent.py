# agent/agents/forecast_agent.py

from pymongo import MongoClient
from datetime import datetime
import numpy as np
from collections import defaultdict
import os

# -------- Mongo Connection --------
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB = MongoClient(MONGO_URI)["neurofin"]
sandbox_collection = DB["sandboxmonthlytransactions"]


# -------- SAFE TIMESTAMP PARSER --------
def parse_ts(ts):
    try:
        if isinstance(ts, dict) and "$date" in ts:
            ts = ts["$date"]
        if isinstance(ts, str):
            ts = ts.replace("Z", "").split("+")[0]
            return datetime.fromisoformat(ts)
        return None
    except:
        return None


# -------- SAFE POLYFIT --------
def safe_polyfit(x, y):
    try:
        return np.polyfit(x, y, 1)
    except:
        slope = (y[-1] - y[0]) / max(len(y), 1)
        return slope, y[0]


# -------- MAIN FORECAST AGENT --------
def forecast_agent(user_id="sandbox"):
    try:
        doc = sandbox_collection.find_one({"user_id": "sandbox"}) \
              or sandbox_collection.find_one()

        if not doc or "months" not in doc:
            return {
                "summary": "no data",
                "trend": "unknown",
                "next_month_total": 0
            }

        daily = defaultdict(float)

        # Extract monthly → daily data
        for month_name, tx_array in doc["months"].items():
            for t in tx_array:
                ts = parse_ts(t.get("timestamp"))
                if not ts:
                    continue

                amount = float(t.get("amount", 0))
                key = ts.strftime("%Y-%m-%d")
                daily[key] += abs(amount)

        if not daily:
            return {
                "summary": "no valid timestamps",
                "trend": "unknown",
                "next_month_total": 0
            }

        # Sort & Prepare arrays
        dates = sorted(daily.keys())
        y = np.array([daily[d] for d in dates])
        x = np.arange(len(y))

        slope, intercept = safe_polyfit(x, y)

        trend = (
            "UPWARD" if slope > 0 else
            "DOWNWARD" if slope < 0 else
            "STABLE"
        )

        last_day = y[-1]
        next_30 = sum(last_day + slope * i for i in range(1, 31))

        return {
            "summary": "ok",
            "trend": trend,
            "next_month_total": float(round(next_30, 2)),
            "daily_points": [
                {"date": d, "value": float(daily[d])}
                for d in dates
            ],
            "slope": float(round(slope, 4)),
            "last_value": float(last_day),
        }

    except Exception as e:
        return {"error": str(e)}
