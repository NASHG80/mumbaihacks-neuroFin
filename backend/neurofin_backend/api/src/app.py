import os
import sys
from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv

# ------------------------------------
# Load environment variables
# ------------------------------------
load_dotenv()

# Ensure Python path includes backend root
ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
SRC = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

sys.path += [ROOT, SRC]

# ------------------------------------
# Import all API routes (Blueprints)
# ------------------------------------
from api.src.routes.advice_route import bp_advice
from api.src.routes.health_score_route import bp_health
from api.src.routes.voice_answer_route import bp_voice_answer
from api.src.routes.forecast_route import bp_forecast
from api.src.routes.investment_route import bp_investment
from api.src.routes.insights_route import bp_insights
from api.src.routes.ask_route import bp_ask

# ------------------------------------
# Initialize Flask
# ------------------------------------
app = Flask(__name__)

# ------------------------------------
# CORS Fix
# ------------------------------------
CORS(app, resources={r"/*": {"origins": "*"}})

# ------------------------------------
# Register ALL routes
# ------------------------------------

# Deprecated v1 routes
app.register_blueprint(bp_advice,       url_prefix="/api/v1")
app.register_blueprint(bp_health,       url_prefix="/api/v1")
app.register_blueprint(bp_voice_answer, url_prefix="/api/v1")

# Main API routes
app.register_blueprint(bp_forecast,     url_prefix="/api/forecast")
app.register_blueprint(bp_investment,   url_prefix="/api")
app.register_blueprint(bp_insights,     url_prefix="/api")
app.register_blueprint(bp_ask,          url_prefix="/api")

# ------------------------------------
# Health Check
# ------------------------------------
@app.route("/health")
def health():
    return jsonify({"status": "ok"}), 200

# ------------------------------------
# Route Viewer (for debugging)
# ------------------------------------
@app.route("/routes")
def routes():
    output = []
    for rule in sorted(app.url_map.iter_rules(), key=lambda r: r.rule):
        output.append({"rule": rule.rule, "methods": list(rule.methods)})
    return jsonify(output)

# ------------------------------------
# Run Server
# ------------------------------------
if __name__ == "__main__":
    print("🚀 NeuroFin API started → http://localhost:7001")
    app.run(host="0.0.0.0", port=7001, debug=True)
