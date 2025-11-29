def investment_agent(collection):
    try:
        doc = collection.find_one()
        if not doc or "months" not in doc:
            return {"summary": "no data", "allocations": [], "performance": []}

        months = doc["months"]

        category_totals = {}
        total = 0

        for m, arr in months.items():
            for t in arr:
                merchant = t.get("merchant", "Other")
                amt = t.get("amount", 0)
                total += amt
                category_totals[merchant] = category_totals.get(merchant, 0) + amt

        # Build allocation % chart
        allocations = [
            {"category": k, "value": round(v / total * 100, 2)}
            for k, v in category_totals.items()
        ]

        # Fake performance line chart (based on months)
        performance = [
            {"month": m, "value": sum(t.get("amount", 0) for t in arr)}
            for m, arr in months.items()
        ]

        risk_score = min(100, int(total / 50000))
        risk_level = "LOW" if risk_score < 33 else "MEDIUM" if risk_score < 66 else "HIGH"

        return {
            "summary": "ok",
            "total_value": total,
            "allocations": allocations,
            "performance": performance,
            "risk_score": risk_score,
            "risk_level": risk_level
        }

    except Exception as e:
        return {"error": str(e)}
