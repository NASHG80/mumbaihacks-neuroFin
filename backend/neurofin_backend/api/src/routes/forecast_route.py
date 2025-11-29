# api/src/routes/forecast_route.py
from flask import Blueprint, request, jsonify
from datetime import datetime
from pymongo import MongoClient
import numpy as np
import os
from collections import defaultdict
from dateutil.parser import parse   # ⭐ SUPER IMPORTANT

bp_forecast = Blueprint("bp_forecast", __name__)

# ---- MongoDB ----
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB = MongoClient(MONGO_URI)["neurofin"]
sandbox_collection = DB["sandboxmonthlytransactions"]


# ----------------------------------------------------
# ⭐ UNIVERSAL TIMESTAMP PARSER (FINAL & WORKING)
# ----------------------------------------------------
def parse_ts(ts):
    """Parses ANY MongoDB timestamp safely."""
    try:
        # Format: { "$date": "......" }
        if isinstance(ts, dict) and "$date" in ts:
            ts = ts["$date"]

        ts = str(ts).replace("Z", "").replace("z", "")
        return parse(ts)  # AUTO-DETECTS ALL FORMATS
    except:
        return None


# ----------------------------------------------------
# SAFE POLYFIT
# ----------------------------------------------------
def safe_polyfit(x, y):
    try:
        return np.polyfit(x, y, 1)
    except:
        if len(y) > 1:
            return (y[-1] - y[0]) / len(y), y[0]
        return 0, y[0]


# ----------------------------------------------------
# MAIN FORECAST COMPUTATION
# ----------------------------------------------------
def compute_forecast():
    docs = list(sandbox_collection.find())

    if not docs:
        return {"summary": "No sandbox data", "trend": "unknown"}

    daily = defaultdict(float)

    # READ NESTED MONTHLY STRUCTURE
    for doc in docs:
        months = doc.get("months", {})

        for month, tx_list in months.items():
            for tx in tx_list:

                ts = parse_ts(tx.get("timestamp"))
                if not ts:
                    continue

                amount = float(tx.get("amount", 0))
                date_key = ts.strftime("%Y-%m-%d")
                daily[date_key] += abs(amount)

    if not daily:
        return {"summary": "No valid timestamps", "trend": "unknown"}

    # SORT BY DATE
    dates = sorted(daily.keys())
    y = np.array([daily[d] for d in dates], dtype=float)
    x = np.arange(len(y))

    slope, intercept = safe_polyfit(x, y)

    trend = (
        "UPWARD" if slope > 0 else
        "DOWNWARD" if slope < 0 else
        "STABLE"
    )

    last = y[-1]

    # BASIC FORECAST VALUES
    next_month = sum(last + slope * i for i in range(1, 31))
    three_month = next_month * 3
    year = next_month * 12
    five_year = year * 5
    ten_year = year * 10

    # FRONTEND EXPECTS THESE KEYS
    return {
        "summary": "ok",
        "trend": trend,
        "next_month_total": round(float(next_month), 2),
        "three_month_projection": round(float(three_month), 2),
        "year_projection": round(float(year), 2),
        "five_year_projection": round(float(five_year), 2),
        "ten_year_projection": round(float(ten_year), 2),
    }


# ----------------------------------------------------
# API ENDPOINT
# ----------------------------------------------------
@bp_forecast.route("/run", methods=["POST"])
def forecast_run():
    forecast = compute_forecast()
    return jsonify(forecast), 200
