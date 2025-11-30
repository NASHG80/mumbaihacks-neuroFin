from pymongo import MongoClient
import os
from api.src.memory import fix_mongo_ids


# -----------------------------------
# MongoDB Connection
# -----------------------------------
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB = MongoClient(MONGO_URI)["neurofin"]

goals_collection = DB["goals"]   # ✔ FIXED


def get_user_goal_summary(user_id=None):
    """
    Correct Goal Summary for new schema.
    Works for sandbox user or real users.
    """

    query = {} if user_id is None else {"user_id": user_id}

    goals = list(goals_collection.find(query))

    if not goals:
        return {
            "has_goals": False,
            "goal_count": 0,
            "goals": [],
            "summary": "No financial goals added yet."
        }

    formatted = []
    for g in goals:
        formatted.append({
            "id": str(g.get("_id")),
            "title": g.get("title") or g.get("goal") or "Untitled Goal",
            "amount": g.get("amount", 0),
            "deadline": g.get("deadline"),
            "progress": g.get("progress", 0),
            "status": g.get("status", "active")
        })

    return fix_mongo_ids({
        "has_goals": True,
        "goal_count": len(formatted),
        "goals": formatted,
        "summary": f"You have {len(formatted)} financial goal(s)."
    })
