from pymongo import MongoClient
import os
from datetime import datetime
from collections import defaultdict

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB = MongoClient(MONGO_URI)["neurofin"]
collection = DB["sandboxmonthlytransactions"]


def automation_agent(user_id=None):
    """
    Updated Automation Agent:
    ✔ Correctly flattens sandboxmonthlytransactions
    ✔ Detects recurring merchants
    ✔ Detects salary credits
    ✔ Detects overspending categories
    ✔ Generates smart automation rules
    """

    # Load single sandbox doc
    doc = collection.find_one()
    if not doc or "months" not in doc:
        return {
            "summary": "No transactions available.",
            "rules": []
        }

    # Flatten all transactions
    txs = []
    for month, arr in doc["months"].items():
        for t in arr:
            txs.append(t)

    if not txs:
        return {"summary": "No transactions available.", "rules": []}

    # -----------------------------------------------------------
    # 1️⃣ Recurring merchants
    # -----------------------------------------------------------
    merchant_freq = defaultdict(int)
    for t in txs:
        merchant = t.get("merchant", "Unknown")
        merchant_freq[merchant] += 1

    recurring_merchants = [
        m for m, count in merchant_freq.items() if count >= 3
    ]

    recurring_rules = [
        {
            "name": f"Subscription Renewal Alert – {m}",
            "trigger": "2 days before expected charge",
            "action": f"Notify about upcoming {m} debit"
        }
        for m in recurring_merchants
    ]

    # -----------------------------------------------------------
    # 2️⃣ Salary detection
    # -----------------------------------------------------------
    salary_detected = any(
        t.get("type", "").lower() == "credit" and abs(float(t.get("amount", 0))) > 15000
        for t in txs
    )

    salary_rule = []
    if salary_detected:
        salary_rule.append({
            "name": "Salary Auto-Save Rule",
            "trigger": "On salary credit",
            "action": "Move 10% of salary to savings automatically"
        })

    # -----------------------------------------------------------
    # 3️⃣ Category overspending
    # -----------------------------------------------------------
    category_totals = defaultdict(float)
    for t in txs:
        if t.get("type", "").lower() == "credit":
            continue

        amt = abs(float(t.get("amount", 0)))
        merchant = (t.get("merchant") or "").lower()
        desc = (t.get("description") or "").lower()

        if "food" in desc or "zomato" in merchant or "swiggy" in merchant:
            cat = "Food"
        elif "fuel" in desc or "petrol" in desc:
            cat = "Transport"
        elif "amazon" in merchant or "flipkart" in merchant:
            cat = "Shopping"
        else:
            cat = "General"

        category_totals[cat] += amt

    top_category = max(category_totals, key=category_totals.get)

    overspend_rule = [{
        "name": f"Overspending Guard – {top_category}",
        "trigger": f"When {top_category} spending exceeds usual average",
        "action": f"Send alert + suggest budget reduction for {top_category}"
    }]

    # -----------------------------------------------------------
    # 4️⃣ Weekly Summary
    # -----------------------------------------------------------
    weekly_rule = {
        "name": "Weekly Spending Summary",
        "trigger": "Every Monday 8 AM",
        "action": "Send categorized spending breakdown + forecast"
    }

    # -----------------------------------------------------------
    # Final rule list
    # -----------------------------------------------------------
    rules = [
        weekly_rule,
        *salary_rule,
        *overspend_rule,
        *recurring_rules
    ]

    return {
        "summary": "Automation rules generated",
        "rules": rules
    }
