# api/src/routes/classify_route.py
from flask import Blueprint, request, jsonify
from src.classifier import predict_single, predict_batch

bp = Blueprint("classifier_bp", __name__)

@bp.route("/api/v1/classify", methods=["POST"])
def classify():
    """
    Accepts either:
      - a single JSON object: { description, amount, direction }
      - or a JSON array of such objects
    Returns predicted category and confidence.
    """
    body = request.get_json(silent=True) or {}

    # Batch mode
    if isinstance(body, list):
        try:
            results = predict_batch(body)
            return jsonify({"status": "ok", "results": results}), 200
        except Exception as e:
            return jsonify({"status": "error", "error": str(e)}), 500

    # Single object
    try:
        description = body.get("description") or body.get("text") or ""
        amount = float(body.get("amount", 0.0))
        direction = body.get("direction", "debit")
    except Exception as e:
        return jsonify({"status":"error","error": f"invalid input: {e}"}), 400

    try:
        res = predict_single(description, amount, direction)
        return jsonify({"status":"ok","result": res}), 200
    except Exception as e:
        return jsonify({"status":"error","error": str(e)}), 500
