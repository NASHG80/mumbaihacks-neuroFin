# api/src/memory.py
import datetime
import os
import pandas as pd
from pymongo import MongoClient
from bson import ObjectId

# ---- MongoDB Setup ----
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.getenv("MONGO_DB", "neurofin")

client = MongoClient(MONGO_URI)
db = client[MONGO_DB]

transactions = db["transactions"]
memory_profiles = db["memory_profiles"]
memory_goals = db["memory_goals"]
memory_patterns = db["memory_patterns"]

CSV_PATH = os.path.join(
    os.path.dirname(__file__),
    "data",
    "dashboard_style_transactions.csv"
)

def load_csv_once():
    """Load CSV into MongoDB if collection is empty."""
    try:
        count = transactions.count_documents({})
        if count > 0:
            print(f"📂 MongoDB already has {count} transactions. Skipping CSV import.")
            return

        print("📥 Importing CSV transactions...")

        df = pd.read_csv(CSV_PATH)

        # Clean column names
        df.columns = [c.strip().lower().replace(" ", "_") for c in df.columns]

        # Convert each row to document
        docs = []
        for _, row in df.iterrows():
            docs.append({
                "user_id": "111",
                "timestamp": row.get("date") or row.get("timestamp"),
                "amount": float(row.get("amount", 0)),
                "category": row.get("category", ""),
                "merchant": row.get("merchant", ""),
                "direction": "debit" if float(row.get("amount", 0)) < 0 else "credit"
            })

        if docs:
            transactions.insert_many(docs)
            print(f"✔ Inserted {len(docs)} transactions.")
        else:
            print("⚠ CSV parsed but no valid rows found.")

    except Exception as e:
        print("❌ CSV load failed:", str(e))


# ---------------------------------------------------------
# FIXING OBJECTID + DATETIME FOR JSON SERIALIZATION
# ---------------------------------------------------------

def fix_json(obj):
    """Convert ObjectId, datetime, and nested structures into JSON-safe types."""
    if isinstance(obj, list):
        return [fix_json(o) for o in obj]

    if isinstance(obj, dict):
        return {k: fix_json(v) for k, v in obj.items()}

    if isinstance(obj, ObjectId):
        return str(obj)

    if isinstance(obj, datetime.datetime):
        return obj.isoformat()

    return obj


def fix_mongo_ids(doc):
    """Compat helper (kept for older imports)."""
    return fix_json(doc)


# ------------------ USER PROFILE ------------------ #
def get_user_profile(user_id):
    prof = memory_profiles.find_one({"user_id": user_id})
    if not prof:
        prof = {"user_id": user_id, "created_at": datetime.datetime.utcnow()}
        memory_profiles.insert_one(prof)
    return fix_json(prof)

def update_user_profile(user_id, key, value):
    memory_profiles.update_one(
        {"user_id": user_id},
        {"$set": {key: value}},
        upsert=True
    )
    return True


# ------------------ GOALS ------------------ #
def add_goal(user_id, title, amount, deadline):
    goal = {
        "user_id": user_id,
        "title": title,
        "amount": amount,
        "deadline": deadline,
        "created_at": datetime.datetime.utcnow()
    }
    memory_goals.insert_one(goal)
    return fix_json(goal)

def get_goals(user_id):
    return fix_json(list(memory_goals.find({"user_id": user_id})))


# ------------------ SPENDING PATTERN MEMORY ------------------ #
def record_spending_pattern(user_id, pattern_dict):
    memory_patterns.update_one(
        {"user_id": user_id},
        {"$set": {**pattern_dict, "updated_at": datetime.datetime.utcnow()}},
        upsert=True
    )
    return True

def get_spending_pattern(user_id):
    return fix_json(memory_patterns.find_one({"user_id": user_id}) or {})
