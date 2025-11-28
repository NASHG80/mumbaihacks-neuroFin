#!/usr/bin/env python3
"""
Generate a synthetic, realistic transaction CSV for classifier training.

Saves to: api/models/transactions_training_large.csv by default.
Usage:
    python tools/generate_synthetic_txs.py --rows 1000 --out api/models/transactions_training_large.csv
"""

import csv
import argparse
import random
from pathlib import Path
from datetime import datetime, timedelta

random.seed(42)

CATEGORIES = [
    "Groceries","Food & Drink","Transport","Fuel","Shopping","Entertainment",
    "Utilities","Income","Medical","Travel","Fitness","Gifts","Housing","Loans","Insurance","Other"
]

# simple merchant templates mapped to categories
MERCHANTS = {
    "Groceries": ["Walmart", "Aldi", "Whole Foods", "Trader Joe's", "Kroger", "Big Mart"],
    "Food & Drink": ["Starbucks", "McDonald's", "Subway", "Domino's", "Olive Garden", "Cafe Nero"],
    "Transport": ["Uber", "Lyft", "City Taxi", "Metro Recharge", "Transit Card"],
    "Fuel": ["Shell", "ExxonMobil", "BP", "Texaco", "Mobil"],
    "Shopping": ["Amazon", "Apple Store", "BestBuy", "Flipkart", "Target"],
    "Entertainment": ["Netflix", "Spotify", "Movie Theater", "AMC", "Bookstore"],
    "Utilities": ["Comcast", "AT&T", "Con Edison", "Water Works", "Electric Co"],
    "Income": ["ACME Corp Payroll", "Freelance Upwork", "Stripe Payout"],
    "Medical": ["CVS Pharmacy", "Walgreens", "City Hospital", "Doctor Clinic"],
    "Travel": ["Delta Airlines", "Airbnb", "Marriott", "Expedia"],
    "Fitness": ["Planet Fitness", "YMCA", "Gym Membership"],
    "Gifts": ["Amazon Gifts", "Gift Shop", "Card Store"],
    "Housing": ["Rent Payment", "Landlord Inc", "Housing Society"],
    "Loans": ["Loan EMI Bank", "Auto Loan Payment"],
    "Insurance": ["Insurance Co", "Life Insurance Payment"],
    "Other": ["Misc Vendor", "Service Charge", "Bank Fee"]
}

# amount ranges per category (min, max)
AMT_RANGES = {
    "Groceries": (10, 200),
    "Food & Drink": (3, 120),
    "Transport": (2, 80),
    "Fuel": (20, 100),
    "Shopping": (5, 1200),
    "Entertainment": (5, 200),
    "Utilities": (20, 300),
    "Income": (500, 60000),
    "Medical": (5, 800),
    "Travel": (50, 2000),
    "Fitness": (10, 120),
    "Gifts": (5, 300),
    "Housing": (300, 2000),
    "Loans": (50, 800),
    "Insurance": (20, 400),
    "Other": (1, 150)
}

DIRECTION_BY_CATEGORY = {
    "Income": "credit"
}
# rest default to debit

def random_description(cat):
    merchant = random.choice(MERCHANTS.get(cat, ["Vendor"]))
    # add subtext / merchant id sometimes, and occasional card suffix
    extras = [
        f"{merchant} #{random.randint(10,9999)}",
        f"{merchant} - Order {random.randint(10000,99999)}",
        f"{merchant} {random.choice(['Online','In-Store','Outlet','Branch'])}",
        f"{merchant} POS {random.randint(1000,9999)}",
    ]
    return random.choice(extras)

def random_amount(cat):
    a,b = AMT_RANGES.get(cat, (1,100))
    # skew incomes upward, other categories use round to 2 decimals
    if cat == "Income":
        amt = round(random.uniform(a, b), 2)
    else:
        # add occasional large purchases
        if random.random() < 0.02:
            amt = round(random.uniform(b*0.6, b*5), 2)
        else:
            amt = round(random.uniform(a, b), 2)
    return amt

def generate_rows(n):
    rows = []
    # aim for balanced per-category counts
    per_cat = max(1, n // len(CATEGORIES))
    extras = n - (per_cat * len(CATEGORIES))
    counts = {c: per_cat for c in CATEGORIES}
    # distribute extras
    cats = list(CATEGORIES)
    for i in range(extras):
        counts[random.choice(cats)] += 1

    for cat, cnt in counts.items():
        for _ in range(cnt):
            desc = random_description(cat)
            amt = random_amount(cat)
            direction = DIRECTION_BY_CATEGORY.get(cat, "debit")
            # add some noise: small chance to flip direction or tweak description
            if random.random() < 0.03 and cat != "Income":
                # refund or reversal
                direction = "credit"
                desc = desc + " REFUND"
            if random.random() < 0.05:
                desc = desc + f" ({random.choice(['online','recurring','promo','vip'])})"
            rows.append((desc, amt, direction, cat))
    # shuffle rows
    random.shuffle(rows)
    return rows

def save_csv(rows, out_path):
    out_path = Path(out_path)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    with out_path.open("w", newline="", encoding="utf8") as f:
        writer = csv.writer(f)
        writer.writerow(["description","amount","direction","category"])
        for r in rows:
            writer.writerow(r)
    print(f"[generate] Wrote {len(rows)} rows to {out_path.resolve()}")

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--rows", type=int, default=1000, help="Number of rows to generate")
    p.add_argument("--out", type=str, default="api/models/transactions_training_large.csv", help="Output CSV path")
    args = p.parse_args()
    rows = generate_rows(args.rows)
    save_csv(rows, args.out)

if __name__ == "__main__":
    main()
