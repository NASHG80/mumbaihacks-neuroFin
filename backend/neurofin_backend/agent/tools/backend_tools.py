import os
import requests

API_BASE = os.getenv("NEUROFIN_API", "http://api:4000")
RISK_AGENT_URL = os.getenv("RISK_AGENT_URL", "http://risk:7000/agent/risk/check")


def tool_fetch_transactions(user_id, limit=50):
    try:
        url = f"{API_BASE}/api/v1/transactions/{user_id}?limit={limit}"
        r = requests.get(url, timeout=6)
        return r.json()
    except Exception as e:
        return {"error": str(e)}


def tool_fetch_smoothed(user_id, limit=20):
    try:
        url = f"{API_BASE}/api/v1/smoothed/{user_id}?limit={limit}"
        r = requests.get(url, timeout=6)
        return r.json()
    except Exception as e:
        return {"error": str(e)}


def tool_fetch_forecast(user_id):
    try:
        url = f"{API_BASE}/api/v1/forecast/{user_id}/latest"
        r = requests.get(url, timeout=6)
        return r.json()
    except Exception as e:
        return {"error": str(e)}


def tool_classify(description, amount, direction="debit"):
    try:
        payload = {"description": description, "amount": amount, "direction": direction}
        url = f"{API_BASE}/api/v1/classify"
        r = requests.post(url, json=payload, timeout=6)
        return r.json().get("result", {})
    except Exception as e:
        return {"error": str(e)}


def tool_risk_check(user_id, advice_obj):
    try:
        payload = {"user_id": user_id, "advice": advice_obj}
        r = requests.post(RISK_AGENT_URL, json=payload, timeout=6)
        return r.json()
    except Exception as e:
        return {"error": str(e)}
