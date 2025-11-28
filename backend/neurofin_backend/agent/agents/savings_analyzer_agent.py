from pymongo import MongoClient
import os
import numpy as np
from api.src.memory import fix_mongo_ids

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB = MongoClient(MONGO_URI)["neurofin"]

transactions = DB["transactions"]
user_profiles = DB["profiles"]


def savings_analyzer_agent(user_id: str):
    """
    Analyzes:
    - income (credits)
    - expenses (debits)
    - net savings
    - savings rate
    - excess spending categories
    """

    txs = list(transactions.find({"user_id": user_id}))
    if not txs:
        return {
            "summary": "No transaction data available.",
            "income": 0,
            "expenses": 0,
            "net_savings": 0,
            "savings_rate": 0,
            "high_spend_categories": [],
        }

    income = 0
    expenses = 0
    categories = {}

    for t in txs:
        amt = float(t.get("amount", 0))
        cat = t.get("category", "Other")

        if t.get("direction") == "credit":
            income += abs(amt)
        else:
            expenses += abs(amt)
            categories[cat] = categories.get(cat, 0) + abs(amt)

    net_savings = income - expenses
    savings_rate = (net_savings / income * 100) if income > 0 else 0

    # Top 3 categories draining savings
    top_spenders = sorted(categories.items(), key=lambda x: x[1], reverse=True)[:3]

    result = {
        "summary": f"Income: {income}, Expenses: {expenses}, Net Savings: {net_savings}",
        "income": round(income, 2),
        "expenses": round(expenses, 2),
        "net_savings": round(net_savings, 2),
        "savings_rate": round(savings_rate, 2),
        "high_spend_categories": [
            {"category": c, "total": round(v, 2)} for c, v in top_spenders
        ],
    }

    return fix_mongo_ids(result)
