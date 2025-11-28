# services/risk/risk_service.py
import os, json
from flask import Flask, request, jsonify
from pymongo import MongoClient
from sklearn.ensemble import IsolationForest
import numpy as np
from dotenv import load_dotenv
load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongodb:27017")
MONGO_DB = os.getenv("MONGO_DB", "neurofin")
client = MongoClient(MONGO_URI)
db = client[MONGO_DB]

app = Flask(__name__)

def compute_anomaly_score(user_id):
    # quick heuristic: use last N smoothed balances
    docs = list(db.smoothed_balances.find({"user_id": user_id}).sort("as_of", -1).limit(60))
    if not docs or len(docs) < 10:
        return {"anomaly_score": 0.0, "severity": "low", "explanation":"insufficient_history"}
    arr = np.array([d.get("smoothed_balance", 0.0) for d in docs]).reshape(-1,1)
    model = IsolationForest(contamination=0.05, random_state=42)
    model.fit(arr)
    scores = model.decision_function(arr)
    # anomaly_score between 0..1 (invert)
    latest_score = float(scores[-1])
    normalized = float(( -latest_score + abs(scores).max()) / (abs(scores).max() + 1e-6))
    severity = "low"
    if normalized > 0.6: severity = "high"
    elif normalized > 0.3: severity = "medium"
    return {"anomaly_score": normalized, "severity": severity, "explanation": "isolationforest_score"}

@app.route("/agent/risk/check", methods=["POST"])
def risk_check():
    payload = request.json
    user_id = payload.get("user_id")
    if not user_id:
        return jsonify({"error":"missing user_id"}), 400
    result = compute_anomaly_score(user_id)
    # Save anomaly if severity medium+ for audit
    if result["severity"] in ("medium","high"):
        db.anomalies.insert_one({"user_id": user_id, "result": result, "payload": payload, "created_at": __import__("datetime").datetime.utcnow()})
    return jsonify(result)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT",7000)))
