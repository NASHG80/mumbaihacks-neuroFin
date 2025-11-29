# api/src/routes/insights_route.py
from flask import Blueprint, request, jsonify
from agent.agents.insights_agent import insights_agent

bp_insights = Blueprint("bp_insights", __name__)

@bp_insights.route("/insights", methods=["POST"])
def run_insights():
    user_id = request.json.get("user_id", "sandbox")

    insights = insights_agent(user_id)

    return jsonify({"insights": insights}), 200
