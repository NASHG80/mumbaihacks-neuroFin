from pymongo import MongoClient
import numpy as np
import os
from datetime import datetime

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
db = MongoClient(MONGO_URI)["neurofin"]

transactions = db["transactions"]

def analyst_agent(user_id: str) -> dict:
    """
    Corrected Analyst Agent:
    - Converts negative expenses to positive spend
    - Ignores income (Salary, Refund)
    - Groups spending Mon–Sun (REAL weekly analysis)
    """

    txs = list(transactions.find({"user_id": user_id}))

    if not txs:
        return {
            "summary": "No transaction data.",
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

    # Weekly slots
    weekly = {
        "Mon": 0, "Tue": 0, "Wed": 0,
        "Thu": 0, "Fri": 0, "Sat": 0, "Sun": 0
    }

    category_totals = {}
    merchant_totals = {}
    daily_totals = {}

    for t in txs:
        raw_amt = float(t.get("amount", 0))
        ts = t.get("timestamp")
        
        # Parse date from both CSV + Mongo
        if isinstance(ts, str):
            try:
                ts = datetime.fromisoformat(ts)
            except:
                continue

        weekday = ts.strftime("%a")  # Mon/Tue/...

        # Normalize values:
        # If amount < 0 = Expense → convert to positive spend
        # If amount > 0 = Income → skip from "spending" metrics
        if raw_amt < 0:
            amt = abs(raw_amt)
        else:
            continue  # income, salary, refunds → ignore in spending

        # category total
        cat = t.get("category", "Other")
        category_totals[cat] = category_totals.get(cat, 0) + amt

        # merchant total
        merchant = t.get("merchant", "Unknown")
        merchant_totals[merchant] = merchant_totals.get(merchant, 0) + amt

        # daily
        date_key = ts.strftime("%Y-%m-%d")
        daily_totals[date_key] = daily_totals.get(date_key, 0) + amt

        # weekly
        weekly[weekday] += amt

    total_spent = sum(category_totals.values())

    daily_avg = float(np.mean(list(daily_totals.values()))) if daily_totals else 0

    # Top 3 spend categories
    top_spends = sorted(
        category_totals.items(),
        key=lambda x: x[1],
        reverse=True
    )[:3]

    return {
        "summary": f"Analyzed {len(txs)} transactions.",
        "total_spent": round(total_spent, 2),
        "daily_avg": round(daily_avg, 2),
        "categories": category_totals,
        "top_spends": [{"category": c, "total": round(v, 2)} for c, v in top_spends],
        "merchant_summary": {k: round(v, 2) for k, v in merchant_totals.items()},
        "weekly": {k: round(v, 2) for k, v in weekly.items()}
    }
