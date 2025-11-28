from flask import Flask, request, jsonify
from flask_cors import CORS
from agents.router_agent import router_agent
import os
from api.src.memory import load_csv_once

app = Flask(__name__)
CORS(app)


PORT = int(os.getenv("PORT", 7001))


@app.route("/agent/ask", methods=["POST"])
def ask():
    data = request.json or {}
    user_id = data.get("user_id")
    message = data.get("message") or data.get("input")

    if not user_id or not message:
        return jsonify({"error": "user_id and message required"}), 400

    try:
        result = router_agent(user_id, message)
        return jsonify(result), 200

    except Exception as e:
        return jsonify({
            "error": "internal_error",
            "detail": str(e)
        }), 500


@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status": "ok",
        "agent_router_loaded": True
    })


if __name__ == "__main__":
    print("⚡ Loading CSV into MongoDB...")
    load_csv_once()

    print(f"🚀 Agent running on 0.0.0.0:{PORT}")
    app.run(host="0.0.0.0", port=PORT)

