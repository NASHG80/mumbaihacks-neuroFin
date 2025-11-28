from pymongo import MongoClient
import os
from api.src.memory import get_user_profile, fix_mongo_ids

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB = MongoClient(MONGO_URI)["neurofin"]

transactions = DB["transactions"]


def investment_agent(user_id: str):
    """
    Returns simple, safe investment suggestions:
    - SIP recommendations
    - emergency fund guidance
    - diversification tips
    """

    profile = get_user_profile(user_id)

    risk = profile.get("risk_level", "medium").lower()
    salary = profile.get("salary", 25000)  # fallback

    # Determine recommendation set
    if risk == "low":
        portfolio = [
            "40% → Liquid / Overnight Funds",
            "30% → Short-Term Debt Funds",
            "20% → Index Funds",
            "10% → Gold ETF"
        ]
    elif risk == "high":
        portfolio = [
            "60% → Equity Index Funds",
            "20% → Flexi-cap Mutual Funds",
            "10% → International ETFs",
            "10% → Gold ETF"
        ]
    else:
        portfolio = [
            "40% → Index Funds",
            "25% → Hybrid Funds",
            "20% → Debt Funds",
            "15% → Gold ETF"
        ]

    # Suggest basic SIP amounts from salary
    sip_amount = round(salary * 0.15, 2)

    result = {
        "summary": f"Suggested SIP: {sip_amount}",
        "recommended_sip_amount": sip_amount,
        "risk_profile": risk,
        "portfolio_mix": portfolio,
        "notes": [
            "Maintain a 3–6 month emergency fund",
            "Avoid investing in high-risk assets if short-term goals are pending",
            "Automate your SIPs to ensure discipline"
        ],
    }

    return fix_mongo_ids(result)
