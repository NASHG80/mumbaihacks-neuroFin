# api/src/routes/ask_route.py

from flask import Blueprint, request, jsonify
from agent.agents.router_agent import router_agent

bp_ask = Blueprint("bp_ask", __name__)

@bp_ask.route("/ask", methods=["POST"])
def ask():
    try:
        data = request.json or {}
        user_id = data.get("user_id", "sandbox")
        message = data.get("message", "")

        if not message:
            return jsonify({"error": "Message is required"}), 400

        print("🧠 Incoming Chat:", message)

        result = router_agent(user_id, message)

        # Router always returns dict
        # Example: { "answer": "your final reply" }
        reply_text = result.get("answer", "")

        # ENSURE reply_text is string
        if not isinstance(reply_text, str):
            reply_text = str(reply_text)

        return jsonify({"reply": reply_text}), 200

    except Exception as e:
        print("❌ ERROR in ask_route:", e)
        return jsonify({"error": str(e)}), 500
