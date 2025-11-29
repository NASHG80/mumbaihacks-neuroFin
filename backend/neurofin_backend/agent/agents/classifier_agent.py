from pymongo import MongoClient
import os
from collections import defaultdict

# ----------------------------------------------------
# CONNECT TO NEW SANDBOX COLLECTION
# ----------------------------------------------------
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
db = MongoClient(MONGO_URI)["neurofin"]

transactions = db["sandboxmonthlytransactions"]


def classify(description: str, merchant: str = ""):
    """
    Pure rule-based classification.
    Categorizes based on description + merchant.
    """

    desc = (description or "").lower()
    m = (merchant or "").lower()

    # ---------------- Food ----------------
    if any(w in desc for w in ["food", "restaurant", "cafe", "pizza", "burger", "swiggy", "zomato"]) \
       or any(w in m for w in ["zomato", "swiggy", "dominos"]):
        return "Food"

    # ---------------- Transport ----------------
    if any(w in desc for w in ["uber", "ola", "auto", "train", "bus", "fuel", "petrol", "diesel"]) \
       or any(w in m for w in ["uber", "ola"]):
        return "Transport"

    # ---------------- Shopping ----------------
    if any(w in desc for w in ["shopping", "store", "clothes", "shoes"]) \
       or any(w in m for w in ["amazon", "flipkart", "myntra"]):
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
    Full classifier agent (UPDATED):
    ✔ Classifies ALL sandboxmonthlytransactions
    ✔ Summaries:
        - Total category spending
        - Merchant → category mapping
        - Classified list of transactions
    """

    txs = list(transactions.find({}))  # no user_id filter

    if not txs:
        return {
            "summary": "No transactions found.",
            "categories": {},
            "merchant_categories": {},
            "classified_transactions": []
        }

    category_totals = defaultdict(float)
    merchant_categories = {}
    classified_txs = []

    for t in txs:
        amount = float(t.get("amount", 0))
        if t.get("type", "").lower() == "credit":
            continue  # skip income

        desc = t.get("description", "")
        merchant = t.get("merchant", "")

        cat = classify(desc, merchant)

        category_totals[cat] += abs(amount)
        merchant_categories[merchant] = cat

        classified_txs.append({
            "merchant": merchant,
            "description": desc,
            "amount": abs(amount),
            "category": cat
        })

    return {
        "summary": "Transactions classified successfully.",
        "categories": {k: round(v, 2) for k, v in category_totals.items()},
        "merchant_categories": merchant_categories,
        "classified_transactions": classified_txs
    }
