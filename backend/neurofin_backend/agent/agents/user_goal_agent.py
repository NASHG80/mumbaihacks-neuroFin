from pymongo import MongoClient
import os
from api.src.memory import fix_mongo_ids
from datetime import datetime


# -----------------------------------
# MongoDB Connection
# -----------------------------------
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB = MongoClient(MONGO_URI)["neurofin"]

memory_goals = DB["memory_goals"]


def get_user_goal_summary(user_id=None):
    """
    Unified Goal Summary:
    - Works with or without user_id
    - Fixes ObjectId to string
    - Used by advisor_agent
    """

    # If sandbox DB has no user-specific data → return all goals
    query = {} if user_id is None else {"user_id": user_id}

    goals = list(memory_goals.find(query))

    if not goals:
        return {
            "has_goals": False,
            "goal_count": 0,
            "goals": [],
            "summary": "No financial goals added yet."
        }

    # Format clean goal objects
    formatted = []
    for g in goals:
        formatted.append({
            "id": str(g.get("_id")),
            "title": g.get("title", "Untitled Goal"),
            "amount": g.get("amount", 0),
            "deadline": g.get("deadline"),
            "created_at": g.get("created_at"),
            "status": g.get("status", "active")
        })

    return fix_mongo_ids({
        "has_goals": True,
        "goal_count": len(formatted),
        "goals": formatted,
        "summary": f"You have {len(formatted)} financial goal(s)."
    })
