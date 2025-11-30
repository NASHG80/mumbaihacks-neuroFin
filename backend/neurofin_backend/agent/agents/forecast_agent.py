from pymongo import MongoClient
from datetime import datetime
import numpy as np
from collections import defaultdict
from dateutil.parser import parse as smart_parse
import os

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB = MongoClient(MONGO_URI)["neurofin"]
COL = DB["sandboxmonthlytransactions"]

def parse_ts(ts):
    try:
        if isinstance(ts, dict) and "$date" in ts:
            ts = ts["$date"]
        return smart_parse(str(ts))
    except:
        return None

def safe_polyfit(x, y):
    try:
        return np.polyfit(x, y, 1)
    except:
        slope = (y[-1] - y[0]) / max(len(y), 1)
        return slope, y[0]

def forecast_agent():
    doc = COL.find_one()
    if not doc or "months" not in doc:
        return {"summary": "no data"}

    daily = defaultdict(float)

    for month, txs in doc["months"].items():
        for tx in txs:
            ts = parse_ts(tx.get("timestamp"))
            if not ts:
                continue
            amt = abs(float(tx.get("amount") or 0))
            key = ts.strftime("%Y-%m-%d")
            daily[key] += amt

    if not daily:
        return {"summary": "no valid timestamps"}

    # sort by date
    dates = sorted(daily.keys())
    y = np.array([daily[d] for d in dates])
    x = np.arange(len(y))

    slope, intercept = safe_polyfit(x, y)
    last = y[-1]

    next_month = sum(last + slope * i for i in range(30))

    return {
        "summary": "ok",
        "next_month_total": round(float(next_month), 2),
        "three_month_projection": round(float(next_month * 3), 2),
        "year_projection": round(float(next_month * 12), 2),
        "five_year_projection": round(float(next_month * 60), 2),
        "ten_year_projection": round(float(next_month * 120), 2),
        "trend": "UPWARD" if slope > 0 else "DOWNWARD" if slope < 0 else "STABLE",
        "daily_points": [{"date": d, "value": float(daily[d])} for d in dates]
    }
