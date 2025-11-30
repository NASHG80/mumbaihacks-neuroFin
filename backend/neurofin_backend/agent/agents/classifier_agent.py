from pymongo import MongoClient
import os
from collections import defaultdict

# ----------------------------------------------------
# CONNECT TO SANDBOX COLLECTION
# ----------------------------------------------------
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
db = MongoClient(MONGO_URI)["neurofin"]
collection = db["sandboxmonthlytransactions"]


def classify(description: str, merchant: str = ""):
    """
    Pure rule-based classification.
    Based on description and merchant.
    """

    desc = (description or "").lower()
    m = (merchant or "").lower()

    # ---------------- Food ----------------
    if any(w in desc for w in ["food", "restaurant", "cafe", "pizza", "burger", "meal"]) \
       or any(w in m for w in ["zomato", "swiggy", "dominos", "kfc", "mcd"]):
        return "Food"

    # ---------------- Transport ----------------
    if any(w in desc for w in ["uber", "ola", "auto", "train", "bus", "fuel", "petrol", "diesel"]) \
       or any(w in m for w in ["uber", "ola", "rapido"]):
        return "Transport"

    # ---------------- Shopping ----------------
    if any(w in desc for w in ["shopping", "store", "clothes", "shoes"]) \
       or any(w in m for w in ["amazon", "flipkart", "myntra", "ajio"]):
        return "Shopping"

    # ---------------- Housing ----------------
    if any(w in desc for w in ["rent", "flat", "apartment", "house", "maintenance"]):
        return "Housing"

    # ---------------- Health ----------------
    if any(w in desc for w in ["pharmacy", "doctor", "hospital", "clinic", "medical"]):
        return "Health"

    return "General"



def classifier_agent(user_id=None):
    """
    Correct Classifier Agent:
    ✔ Flattens ALL monthly transactions
    ✔ Detects categories
    ✔ Builds merchant → category mapping
    ✔ Returns clean “classified_transactions”
    """

    doc = collection.find_one()

    if not doc or "months" not in doc:
        return {
            "summary": "No data found.",
            "categories": {},
            "merchant_categories": {},
            "classified_transactions": []
        }

    # ---- Flatten monthly transactions ----
    all_tx = []
    for month, arr in doc["months"].items():
        for t in arr:
            all_tx.append(t)

    if not all_tx:
        return {
            "summary": "No transactions available.",
            "categories": {},
            "merchant_categories": {},
            "classified_transactions": []
        }

    category_totals = defaultdict(float)
    merchant_categories = {}
    classified = []

    for tx in all_tx:
        amount = float(tx.get("amount", 0))
        if tx.get("type", "").lower() == "credit":
            continue  # skip income

        merchant = tx.get("merchant", "")
        desc = tx.get("description", "")

        cat = classify(desc, merchant)

        category_totals[cat] += abs(amount)
        merchant_categories[merchant] = cat

        classified.append({
            "merchant": merchant,
            "description": desc,
            "amount": abs(amount),
            "category": cat
        })

    return {
        "summary": "Classified all transactions successfully.",
        "categories": {k: round(v, 2) for k, v in category_totals.items()},
        "merchant_categories": merchant_categories,
        "classified_transactions": classified
    }
