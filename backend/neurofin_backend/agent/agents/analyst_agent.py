from pymongo import MongoClient
import numpy as np
from datetime import datetime
import os

# -------------------------------------------------------
# CONNECT TO SANDBOX COLLECTION
# -------------------------------------------------------
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
db = MongoClient(MONGO_URI)["neurofin"]
collection = db["sandboxmonthlytransactions"]


def analyst_agent(user_id=None):
    """
    Correct Analyst Agent:
    ✔ Reads nested monthly transaction schema:
        doc["months"]["January"] → [tx1, tx2, ...]
    ✔ Flattens ALL transactions
    ✔ Computes:
        - Total spent
        - Top categories
        - Weekly insights
        - Merchant spending
        - Daily averages
    """

    doc = collection.find_one()

    if not doc or "months" not in doc:
        return {
            "summary": "No data",
            "total_spent": 0,
            "daily_avg": 0,
            "categories": {},
            "top_spends": [],
            "merchant_summary": {},
            "weekly": {}
        }

    # Flatten all transactions
    txs = []
    for month, arr in doc["months"].items():
        for t in arr:
            txs.append(t)

    if not txs:
        return {
            "summary": "No transaction entries",
            "total_spent": 0,
            "daily_avg": 0,
            "categories": {},
            "top_spends": [],
            "merchant_summary": {},
            "weekly": {}
        }

    # Weekly tracking
    weekly = {
        "Mon": 0, "Tue": 0, "Wed": 0,
        "Thu": 0, "Fri": 0, "Sat": 0, "Sun": 0
    }

    category_totals = {}
    merchant_totals = {}
    daily_totals = {}

    for t in txs:
        amount = float(t.get("amount", 0))
        tx_type = str(t.get("type", "")).lower()

        # Debit = expense, Credit = income (ignored)
        if tx_type == "credit":
            continue

        amt = abs(amount)

        merchant = t.get("merchant", "Unknown")
        desc = (t.get("description") or "").lower()

        # Category inference
        if "food" in desc or "zomato" in merchant.lower() or "swiggy" in merchant.lower():
            category = "Food"
        elif "fuel" in desc or "petrol" in desc:
            category = "Transport"
        elif "amazon" in merchant.lower() or "flipkart" in merchant.lower():
            category = "Shopping"
        elif "rent" in desc:
            category = "Housing"
        else:
            category = "General"

        # Timestamp
        ts_raw = t.get("timestamp")
        try:
            ts = datetime.fromisoformat(ts_raw.replace("Z", "").split("+")[0])
        except:
            continue

        weekday = ts.strftime("%a")
        date_key = ts.strftime("%Y-%m-%d")

        # Accumulate totals
        category_totals[category] = category_totals.get(category, 0) + amt
        merchant_totals[merchant] = merchant_totals.get(merchant, 0) + amt
        daily_totals[date_key] = daily_totals.get(date_key, 0) + amt
        weekly[weekday] += amt

    total_spent = sum(category_totals.values())
    daily_avg = float(np.mean(list(daily_totals.values()))) if daily_totals else 0

    top_spends = sorted(category_totals.items(), key=lambda x: x[1], reverse=True)[:3]

    return {
        "summary": f"Analyzed {len(txs)} transactions.",
        "total_spent": round(total_spent, 2),
        "daily_avg": round(daily_avg, 2),
        "categories": {k: round(v, 2) for k, v in category_totals.items()},
        "top_spends": [
            {"category": c, "total": round(v, 2)} for c, v in top_spends
        ],
        "merchant_summary": {k: round(v, 2) for k, v in merchant_totals.items()},
        "weekly": {k: round(v, 2) for k, v in weekly.items()}
    }
