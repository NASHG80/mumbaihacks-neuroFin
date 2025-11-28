from flask import Blueprint, jsonify
from neurofin_backend.api.src.services.health_score_service import calculate_health_score

bp_health = Blueprint("health_score", __name__)

@bp_health.route("/health-score/<user_id>", methods=["GET"])
def health_score(user_id):
    result = calculate_health_score(user_id)
    return jsonify(result)
