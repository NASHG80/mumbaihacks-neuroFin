import pandas as pd
import numpy as np
import os

# Use your uploaded CSV file directly
CSV_PATH = "/mnt/data/dashboard_style_transactions.csv"

# ------------------------------------------------------------
# Load Transactions from your CSV
# ------------------------------------------------------------
def load_transactions():
    if not os.path.exists(CSV_PATH):
        print("CSV NOT FOUND:", CSV_PATH)
        return pd.DataFrame()

    df = pd.read_csv(CSV_PATH)

    # Normalize column names
    df.columns = [c.strip().lower() for c in df.columns]

    # Ensure required fields exist
    required = ["amount", "type", "category"]
    for col in required:
        if col not in df.columns:
            raise Exception(f"CSV missing required column: {col}")

    return df


# ------------------------------------------------------------
# Spending Score (0–100)
# ------------------------------------------------------------
def compute_spending_score(df):
    debits = df[df["type"] == "debit"]["amount"].sum()
    credits = df[df["type"] == "credit"]["amount"].sum()

    if credits <= 0:
        return 40

    spending_ratio = debits / credits  # lower = better

    # 0.3 = excellent → near 100
    # 1.0 = bad → near 40
    score = max(20, 100 - (spending_ratio * 50))
    return round(min(score, 100))


# ------------------------------------------------------------
# Income Score
# ------------------------------------------------------------
def compute_income_score(df):
    income = df[df["type"] == "credit"]["amount"]

    if income.empty:
        return 50

    std = income.std()
    mean = income.mean()

    if mean == 0:
        return 50

    stability = 1 - (std / mean)
    stability = max(0, min(stability, 1))

    return round(60 + stability * 40)


# ------------------------------------------------------------
# Budget Score (Category balance)
# ------------------------------------------------------------
def compute_budget_score(df):
    cat_spend = df[df["type"] == "debit"].groupby("category")["amount"].sum()

    if cat_spend.empty:
        return 60

    avg = cat_spend.mean()
    max_cat = cat_spend.max()

    if max_cat == 0:
        return 60

    ratio = avg / max_cat  # more balanced = higher score
    return round(50 + (ratio * 50))


# ------------------------------------------------------------
# Investment Score (CSV-based proxy)
# ------------------------------------------------------------
def compute_investment_score(df):
    invest = df[df["category"].str.contains("invest", case=False, na=False)]

    if invest.empty:
        return 50

    amount = invest["amount"].sum()

    # More investment = better score
    score = min(100, 60 + (amount / 10000) * 40)
    return round(score)


# ------------------------------------------------------------
# Goals Score (CSV-based proxy)
# ------------------------------------------------------------
def compute_goals_score(df):
    income = df[df["type"] == "credit"]["amount"].sum()
    expense = df[df["type"] == "debit"]["amount"].sum()

    savings = income - expense

    if savings <= 0:
        return 50

    score = min(100, 60 + (savings / 20000) * 40)
    return round(score)


# ------------------------------------------------------------
# FINAL: Calculate 0–1000 Health Score
# ------------------------------------------------------------
def calculate_financial_health():
    df = load_transactions()

    if df.empty:
        return {"score": 500, "metrics": []}

    spending = compute_spending_score(df)
    income = compute_income_score(df)
    budget = compute_budget_score(df)
    investments = compute_investment_score(df)
    goals = compute_goals_score(df)

    # Weighted final score
    final_score = round(
        (spending * 0.20 +
         income * 0.20 +
         budget * 0.20 +
         investments * 0.20 +
         goals * 0.20) * 10  # → convert to 0–1000
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
