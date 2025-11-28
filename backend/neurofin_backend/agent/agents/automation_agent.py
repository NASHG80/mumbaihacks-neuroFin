from pymongo import MongoClient
import os
from api.src.memory import fix_mongo_ids

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB = MongoClient(MONGO_URI)["neurofin"]

transactions = DB["transactions"]


def automation_agent(user_id: str):
    """
    Suggests automation rules:
    - bill reminders
    - savings automation
    - category alerts
    """

    # Basic recurring automations
    rules = [
        {
            "name": "Weekly Spending Summary",
            "trigger": "Every Monday 8 AM",
            "action": "Send categorized spending report"
        },
        {
            "name": "Overspend Alert",
            "trigger": "Category exceeds 75% of weekly limit",
            "action": "Notify user instantly"
        },
        {
            "name": "Auto-Save Rule",
            "trigger": "Salary credit detected",
            "action": "Move 10% to savings bucket"
        }
    ]

    result = {
        "summary": "Automation suggestions ready.",
        "rules": rules
    }

    return fix_mongo_ids(result)
