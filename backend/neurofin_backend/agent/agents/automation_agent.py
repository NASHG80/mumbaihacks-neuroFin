from pymongo import MongoClient
import os
from datetime import datetime
from collections import defaultdict
from api.src.memory import fix_mongo_ids

# -----------------------------------------------------------
# CONNECT TO NEW SANDBOX COLLECTION
# -----------------------------------------------------------
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB = MongoClient(MONGO_URI)["neurofin"]

transactions = DB["sandboxmonthlytransactions"]   # 👈 UPDATED


def automation_agent(user_id=None):
    """
    Updated Automation Agent:
    ✔ Uses sandboxmonthlytransactions (no user_id needed)
    ✔ Detects recurring transactions (subscriptions, rent, EMI)
    ✔ Detects salary credits
    ✔ Detects habitual overspending categories
    ✔ Suggests smart, personalized automation rules
    """

    txs = list(transactions.find({}))

    if not txs:
        return fix_mongo_ids({
            "summary": "No transactions available.",
            "rules": []
        })

    # -----------------------------------------------------------
    # 1️⃣ Detect recurring merchants (subscriptions/EMIs)
    # -----------------------------------------------------------
    merchant_freq = defaultdict(int)
    for t in txs:
        merchant = t.get("merchant", "Unknown")
        merchant_freq[merchant] += 1

    recurring_merchants = [
        m for m, count in merchant_freq.items()
        if count >= 3  # appears 3+ times = recurring
    ]

    recurring_rules = [
        {
            "name": f"Auto-renewal alert: {m}",
            "trigger": "2 days before renewal",
            "action": f"Notify about upcoming {m} subscription charge"
        }
        for m in recurring_merchants
    ]

    # -----------------------------------------------------------
    # 2️⃣ Detect salary deposits (type = CREDIT & high amount)
    # -----------------------------------------------------------
    salary_detected = False
    for t in txs:
        if t.get("type", "").lower() == "credit" and float(t.get("amount", 0)) > 15000:
            salary_detected = True
            break

    salary_rule = []
    if salary_detected:
        salary_rule.append({
            "name": "Salary Auto-Save Rule",
            "trigger": "When salary credit is detected",
            "action": "Move 10% of salary automatically to savings account"
        })

    # -----------------------------------------------------------
    # 3️⃣ Category-based overspending alerts
    # -----------------------------------------------------------
    category_totals = defaultdict(float)
    for t in txs:
        amt = float(t.get("amount", 0))
        if t.get("type", "").lower() == "credit":
            continue  # skip income

        desc = (t.get("description") or "").lower()
        merchant = t.get("merchant", "")

        if "food" in desc or "zomato" in merchant.lower():
            cat = "Food"
        elif "amazon" in merchant.lower():
            cat = "Shopping"
        elif "fuel" in desc:
            cat = "Transport"
        else:
            cat = "General"

        category_totals[cat] += abs(amt)

    # highest spending category
    top_category = max(category_totals, key=category_totals.get)

    overspend_rule = [{
        "name": f"Overspending Guard – {top_category}",
        "trigger": f"When {top_category} spending exceeds 70% of monthly avg",
        "action": f"Send alert + suggest budget correction for {top_category}"
    }]

    # -----------------------------------------------------------
    # 4️⃣ Weekly Summary Automation
    # -----------------------------------------------------------
    weekly_report_rule = {
        "name": "Weekly Spending Summary",
        "trigger": "Every Monday 8 AM",
        "action": "Send categorized spending breakdown + forecast"
    }

    # -----------------------------------------------------------
    # 🔥 FINAL RULE SET
    # -----------------------------------------------------------
    rules = (
        [weekly_report_rule] +
        salary_rule +
        overspend_rule +
        recurring_rules
    )

    return fix_mongo_ids({
        "summary": "AI-generated automation recommendations",
        "rules": rules
    })
