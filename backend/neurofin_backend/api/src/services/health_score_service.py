import pandas as pd
import statistics
import os

# ---------- FIXED: Portable CSV path ----------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
CSV_PATH = os.path.join(BASE_DIR, "..", "data", "dashboard_style_transactions.csv")
CSV_PATH = os.path.normpath(CSV_PATH)

def load_user_transactions(user_id: str):
    """Load CSV as fake bank transaction feed"""

    if not os.path.exists(CSV_PATH):
        print("❌ CSV not found at:", CSV_PATH)
        return []

    print("✔ Loading CSV from:", CSV_PATH)

    df = pd.read_csv(CSV_PATH)
    df.columns = [c.lower() for c in df.columns]

    tx_list = []
    for _, row in df.iterrows():
        tx_list.append({
            "user_id": user_id,
            "amount": float(row.get("amount", 0)),
            "type": row.get("type", "").lower(),
            "category": row.get("category", "other"),
            "date": row.get("date", "2025-01-01")
        })

    return tx_list


# ---------------------------------------------------------
#   SPENDING SCORE (0–200)
# ---------------------------------------------------------
def compute_spending_score(tx):
    if not tx:
        return 120

    expenses = [t["amount"] for t in tx if t["type"] == "debit"]

    if not expenses:
        return 130

    avg = statistics.mean(expenses)
    std = statistics.stdev(expenses) if len(expenses) > 1 else 0

    stability = max(0, 1 - (std / (avg + 1)))
    total_spend = sum(expenses)

    spend_score = 200 - min(total_spend / 50, 200)
    final = (stability * 80) + spend_score

    return int(max(20, min(final, 200)))


# ---------------------------------------------------------
#   INCOME SCORE (0–200)
# ---------------------------------------------------------
def compute_income_score(tx):
    income_tx = [t["amount"] for t in tx if t["type"] == "credit"]

    if not income_tx:
        return 80

    avg_income = statistics.mean(income_tx)
    regularity = min(len(income_tx) * 20, 100)

    score = (avg_income / 1000) * 100 + regularity
    return int(max(50, min(score, 200)))


# ---------------------------------------------------------
#   BUDGET SCORE (0–200)
# ---------------------------------------------------------
def compute_budget_score(tx):
    if not tx:
        return 100

    categories = {}
    for t in tx:
        categories.setdefault(t["category"], 0)
        if t["type"] == "debit":
            categories[t["category"]] += t["amount"]

    over_budget_categories = sum(1 for v in categories.values() if v > 5000)

    score = 200 - (over_budget_categories * 30)
    return int(max(30, min(score, 200)))


# ---------------------------------------------------------
#   GOALS SCORE (0–200)
# ---------------------------------------------------------
def compute_goals_score(user_id):
    return 150  # simple placeholder


# ---------------------------------------------------------
#   INVESTMENTS SCORE (0–200)
# ---------------------------------------------------------
def compute_investment_score(user_id):
    return 160  # simple placeholder


# ---------------------------------------------------------
#   FINAL SCORE OUT OF 1000
# ---------------------------------------------------------
def calculate_health_score(user_id):
    tx = load_user_transactions(user_id)

    spending = compute_spending_score(tx)
    income = compute_income_score(tx)
    budget = compute_budget_score(tx)
    goals = compute_goals_score(user_id)
    investments = compute_investment_score(user_id)

    final_score = round(
        spending +
        income +
        budget +
        investments +
        goals
    )

    return {
        "score": final_score,
        "metrics": [
            {"label": "Spending", "value": spending},
            {"label": "Income", "value": income},
            {"label": "Budget", "value": budget},
            {"label": "Investments", "value": investments},
            {"label": "Goals", "value": goals}
        ]
    }
