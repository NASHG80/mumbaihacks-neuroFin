from pymongo import MongoClient
import numpy as np
import os
from datetime import datetime

# -------------------------------------------------------
# CONNECT TO SANDBOX COLLECTION
# -------------------------------------------------------
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
db = MongoClient(MONGO_URI)["neurofin"]

# IMPORTANT: use your NEW collection
transactions = db["sandboxmonthlytransactions"]


def analyst_agent(user_id=None) -> dict:
    """
    Updated Analyst Agent:
    ✔ Works with sandboxmonthlytransactions
    ✔ Uses faker schema
    ✔ Auto-detects categories from merchant + description
    ✔ Computes weekly, category, and merchant analytics
    """

    txs = list(transactions.find({}))  # No user_id filter

    if not txs:
        return {
            "summary": "No transaction data found.",
            "total_spent": 0,
            "daily_avg": 0,
            "categories": {},
            "top_spends": [],
            "merchant_summary": {},
            "weekly": {
                "Mon": 0, "Tue": 0, "Wed": 0,
                "Thu": 0, "Fri": 0, "Sat": 0, "Sun": 0
            }
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

        # Convert DEBIT/CREDIT to spending amount
        if tx_type == "credit":
            amt = 0  # credit = money in → not an expense
            continue
        else:
            amt = abs(amount)  # debit = spend

        # Merchant
        merchant = t.get("merchant", "Unknown")

        # Description-based category inference
        desc = (t.get("description") or "").lower()

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
        ts = t.get("timestamp")
        try:
            ts = datetime.fromisoformat(str(ts))
        except:
            continue

        weekday = ts.strftime("%a")  # Mon, Tue...

        # -------------------------------
        # UPDATE METRICS
        # -------------------------------
        category_totals[category] = category_totals.get(category, 0) + amt
        merchant_totals[merchant] = merchant_totals.get(merchant, 0) + amt

        date_key = ts.strftime("%Y-%m-%d")
        daily_totals[date_key] = daily_totals.get(date_key, 0) + amt

        weekly[weekday] += amt

    total_spent = sum(category_totals.values())

    daily_avg = float(np.mean(list(daily_totals.values()))) if daily_totals else 0

    # Top 3 categories
    top_spends = sorted(category_totals.items(), key=lambda x: x[1], reverse=True)[:3]

    return {
        "summary": f"Analyzed {len(txs)} sandbox transactions.",
        "total_spent": round(total_spent, 2),
        "daily_avg": round(daily_avg, 2),
        "categories": {k: round(v, 2) for k, v in category_totals.items()},
        "top_spends": [
            {"category": c, "total": round(v, 2)} for c, v in top_spends
        ],
        "merchant_summary": {k: round(v, 2) for k, v in merchant_totals.items()},
        "weekly": {k: round(v, 2) for k, v in weekly.items()}
    }
