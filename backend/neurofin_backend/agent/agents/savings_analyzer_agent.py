from pymongo import MongoClient
import os
from collections import defaultdict
from datetime import datetime
import numpy as np
from api.src.memory import fix_mongo_ids

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB = MongoClient(MONGO_URI)["neurofin"]

sandbox = DB["sandboxmonthlytransactions"]


def infer_category(desc: str, merchant: str = ""):
    desc = (desc or "").lower()
    merchant = (merchant or "").lower()

    if "food" in desc or "zomato" in merchant or "swiggy" in merchant:
        return "Food"
    if "fuel" in desc or "petrol" in desc:
        return "Transport"
    if "amazon" in merchant or "flipkart" in merchant:
        return "Shopping"
    if "rent" in desc:
        return "Housing"
    if "medical" in desc or "pharmacy" in desc:
        return "Health"
    return "General"


def savings_analyzer_agent(user_id=None):
    doc = sandbox.find_one()

    if not doc or "months" not in doc:
        return {
            "summary": "No data",
            "income": 0,
            "expenses": 0,
            "net_savings": 0,
            "savings_rate": 0,
            "drains": []
        }

    income = 0
    expenses = 0
    category_totals = defaultdict(float)

    # Flatten month data
    for month, arr in doc["months"].items():
        for t in arr:
            amt = float(t.get("amount", 0))
            tx_type = (t.get("type") or "").lower()
            merchant = t.get("merchant", "")
            desc = t.get("description", "")

            if tx_type == "credit":      # income
                income += abs(amt)
            else:                        # expense
                expenses += abs(amt)
                category = infer_category(desc, merchant)
                category_totals[category] += abs(amt)

    net_savings = income - expenses

    # --------------------------
    # FIXED SAVINGS RATE
    # --------------------------
    if income > 0:
        savings_rate = max(0, round((net_savings / income) * 100, 2))
    else:
        # Behavior-based savings rate (makes sense even if income = 0)
        savings_rate = max(0, round(100 - (expenses / 50000 * 100), 2))

    # --------------------------
    # Savings Score Calculation
    # --------------------------
    drains = sorted(category_totals.items(), key=lambda x: x[1], reverse=True)[:3]

    # score reduces based on expenses, overspending & category drains
    base_score = 100
    expense_penalty = min(60, expenses / 20000 * 10)
    drain_penalty = len(drains) * 5

    score = int(max(5, base_score - expense_penalty - drain_penalty))

    return fix_mongo_ids({
        "summary": "Savings analysis completed",
        "income": round(income, 2),
        "expenses": round(expenses, 2),
        "net_savings": round(net_savings, 2),
        "savings_rate": savings_rate,
        "savings_score": score,
        "drains": [{"category": c, "total": round(v, 2)} for c, v in drains]
    })
