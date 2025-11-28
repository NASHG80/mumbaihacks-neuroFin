from flask import Blueprint, request, jsonify
from agent.agents.advisor_agent import advisor_agent


bp_advice = Blueprint("bp_advice", __name__)


@bp_advice.route("/api/v1/advice", methods=["POST"])
def get_advice():
    """
    Unified Financial Advisor endpoint.
    Combines outputs from:
      - Analyst Agent
      - Forecast Agent
      - Risk Agent
      - Goal Agent
      - Classifier Agent
    Then mixes everything using LLM reasoning.
    """

    body = request.get_json(silent=True) or {}
    user_id = body.get("user_id")
    message = body.get("message") or body.get("input")

    if not user_id or not message:
        return jsonify({
            "error": "missing user_id or message"
        }), 400

    try:
        result = advisor_agent(user_id, message)

        return jsonify({
            "status": "ok",
            "advisor_response": result["advisor_response"],
            "analyst": result["analyst"],
            "forecast": result["forecast"],
            "risk": result["risk"],
            "goal": result["goal"],
            "classifier": result["classifier_stats"]
        }), 200

    except Exception as e:
        return jsonify({
            "error": "advisor_failed",
            "detail": str(e)
        }), 500
