from flask import Blueprint, request, jsonify
from datetime import datetime
from pymongo import MongoClient
import numpy as np
import os
from collections import defaultdict
from dateutil.parser import parse

bp_forecast = Blueprint("bp_forecast", __name__)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB = MongoClient(MONGO_URI)["neurofin"]
COL = DB["sandboxtransactions"]


def parse_ts(ts):
    try:
        if isinstance(ts, dict) and "$date" in ts:
            ts = ts["$date"]
        return parse(str(ts).replace("Z", ""))
    except:
        return None


def safe_polyfit(x, y):
    try:
        return np.polyfit(x, y, 1)
    except:
        return (0, y[-1])


def compute():
    docs = list(COL.find())
    if not docs:
        return {"summary": "no data"}

    daily = defaultdict(float)

    for doc in docs:
        months = doc.get("months", {})
        for m, txs in months.items():
            for tx in txs:
                ts = parse_ts(tx.get("timestamp"))
                if not ts:
                    continue
                daily[ts.strftime("%Y-%m-%d")] += abs(float(tx.get("amount", 0)))

    dates = sorted(daily.keys())
    y = np.array([daily[d] for d in dates])
    x = np.arange(len(y))

    slope, intercept = safe_polyfit(x, y)
    last = y[-1]

    next_month = sum(last + slope * i for i in range(30))

    return {
        "summary": "ok",
        "next_month_total": float(next_month),
        "three_month_projection": float(next_month * 3),
        "year_projection": float(next_month * 12),
        "five_year_projection": float(next_month * 60),
        "ten_year_projection": float(next_month * 120)
    }


@bp_forecast.route("/run", methods=["POST"])
def run():
    return jsonify(compute()), 200
