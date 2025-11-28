from pymongo import MongoClient
import os
import datetime

# ---- MongoDB Setup ----
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.getenv("MONGO_DB", "neurofin")

client = MongoClient(MONGO_URI)
db = client[MONGO_DB]

memory_goals = db["memory_goals"]


def get_user_goal_summary(user_id: str):
    """
    Summarizes user's financial goals stored in MongoDB.
    Used by the advisor agent.
    """

    goals = list(memory_goals.find({"user_id": user_id}))

    if not goals:
        return {
            "has_goals": False,
            "goal_count": 0,
            "summary": "No financial goals added yet."
        }

    # Format goals
    formatted = []
    for g in goals:
        formatted.append({
            "title": g.get("title"),
            "amount": g.get("amount"),
            "deadline": g.get("deadline"),
            "created_at": g.get("created_at")
        })

    return {
        "has_goals": True,
        "goal_count": len(goals),
        "goals": formatted,
        "summary": f"You have {len(goals)} financial goal(s) saved."
    }
