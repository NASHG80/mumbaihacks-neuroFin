# api/src/app.py
import sys, os
from flask_cors import CORS
from dotenv import load_dotenv
load_dotenv()


ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "../.."))
sys.path.append(ROOT)


import os
from flask import Flask, jsonify
from routes.advice_route import bp_advice
from routes.health_score_route import bp_health
from routes.voice_answer_route import bp_voice_answer




# ensure src is importable when running from repo root or container
# (if running with Docker and WORKDIR=/app, this is usually unnecessary)
import sys
root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if root not in sys.path:
    sys.path.insert(0, root)

# create app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
app.register_blueprint(bp_advice, url_prefix="/api/v1")
app.register_blueprint(bp_health, url_prefix="/api/v1")
app.register_blueprint(bp_voice_answer, url_prefix="/api/v1")



# register classifier blueprint
try:
    # route file uses: from src.classifier import ...
    from src.routes.classify_route import bp as classify_bp
    app.register_blueprint(classify_bp)
except Exception as e:
    # Safe fallback: show helpful message in logs, app will still start
    app.logger.exception("Failed to import/register classifier blueprint: %s", e)

# lightweight health route
@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "routes_count": len(app.url_map._rules)})

# debug endpoint: list routes (only in dev)
@app.route("/routes", methods=["GET"])
def routes():
    routes = []
    for rule in sorted(app.url_map.iter_rules(), key=lambda r: str(r)):
        methods = sorted(rule.methods - {"HEAD", "OPTIONS"})
        routes.append({"rule": rule.rule, "methods": methods})
    return jsonify(routes)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 4000))
    host = os.getenv("HOST", "0.0.0.0")
    print("Starting Flask app on", host, port)
    # When run directly, print url map for debugging
    try:
        for r in sorted(app.url_map.iter_rules(), key=lambda r: str(r)):
            print(f"{r.rule:40} -> {','.join(sorted(r.methods - {'HEAD','OPTIONS'}))}")
    except Exception:
        pass
    app.run(host=host, port=port)
