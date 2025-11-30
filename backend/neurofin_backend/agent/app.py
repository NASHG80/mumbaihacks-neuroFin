from flask import Flask, request, jsonify
from pymongo import MongoClient
import os

# import blueprints
from api.src.routes.forecast_route import bp_forecast
from api.src.routes.investment_route import bp_investment
from api.src.routes.insights_route import bp_insights
from api.src.routes.ask_route import bp_ask    # ← ADD THIS

app = Flask(__name__)

# REGISTER BLUEPRINTS WITH /api PREFIX
app.register_blueprint(bp_forecast, url_prefix="/api/forecast")
app.register_blueprint(bp_investment, url_prefix="/api")
app.register_blueprint(bp_insights, url_prefix="/api")
app.register_blueprint(bp_ask, url_prefix="/api")   # ← AND THIS

# MONGO CONNECTION
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB = MongoClient(MONGO_URI)["neurofin"]

# CORS
@app.before_request
def allow_cors():
    if request.method == "OPTIONS":
        response = jsonify({"status": "ok"})
        response.headers["Access-Control-Allow-Origin"] = "*"
        response.headers["Access-Control-Allow-Headers"] = "Content-Type"
        response.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
        return response
    return None

@app.after_request
def add_headers(resp):
    resp.headers["Access-Control-Allow-Origin"] = "*"
    resp.headers["Access-Control-Allow-Headers"] = "Content-Type"
    resp.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS"
    return resp

if __name__ == "__main__":
    print("🚀 Running API backend at http://localhost:7001")
    app.run(host="0.0.0.0", port=7001, debug=True)
