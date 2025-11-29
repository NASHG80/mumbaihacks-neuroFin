from collections import defaultdict
import numpy as np

def parse_ts(ts):
    if isinstance(ts, dict) and "$date" in ts:
        ts = ts["$date"]
    try:
        return ts
    except:
        return None


def investment_agent(collection):
    try:
        doc = collection.find_one()
        if not doc or "months" not in doc:
            return {
                "summary": "No data",
                "allocations": [],
                "performance": [],
                "risk_score": 0,
                "risk_level": "LOW",
                "total_value": 0
            }

        months = doc["months"]

        category_totals = defaultdict(float)
        monthly_totals = {}

        # -------------------------------------------
        # READ DATA SAFELY
        # -------------------------------------------
        for month, arr in months.items():
            monthly_sum = 0
            for t in arr:
                amt = float(t.get("amount", 0))
                merchant = t.get("merchant", "Other")

                category_totals[merchant] += amt
                monthly_sum += amt

            monthly_totals[month] = monthly_sum

        total_value = sum(category_totals.values())

        # -------------------------------------------
        # ALLOCATIONS
        # -------------------------------------------
        allocations = []
        for merchant, amt in category_totals.items():
            alloc = (amt / total_value * 100) if total_value else 0
            allocations.append({
                "name": merchant,
                "value": amt,
                "allocation": round(alloc, 2),
                "returns": round((amt % 8000) / 120, 2)  # safe mock
            })

        # -------------------------------------------
        # PERFORMANCE
        # -------------------------------------------
        performance = [
            {"month": m, "value": v}
            for m, v in monthly_totals.items()
        ]

        # -------------------------------------------
        # RISK SCORE
        # -------------------------------------------
        risk_score = min(100, int(total_value / 8000))
        if risk_score < 33:
            risk_level = "LOW"
        elif risk_score < 66:
            risk_level = "MEDIUM"
        else:
            risk_level = "HIGH"

        return {
            "summary": "ok",
            "total_value": total_value,
            "allocations": allocations,
            "performance": performance,
            "risk_score": risk_score,
            "risk_level": risk_level
        }

    except Exception as e:
        return {"error": str(e)}
