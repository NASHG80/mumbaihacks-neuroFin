from flask import Blueprint, request, jsonify
from pymongo import MongoClient
import os

from agent.agents.investment_agent import investment_agent

bp_investment = Blueprint("investment_api", __name__)

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB = MongoClient(MONGO_URI)["neurofin"]
sandbox = DB["sandboxmonthlytransactions"]


@bp_investment.route("/investment", methods=["POST"])
def run_investment():
    try:
        result = investment_agent(sandbox)
        return jsonify(result), 200
    except Exception as e:
        print("Investment Agent Error:", e)
        return jsonify({"error": str(e)}), 500
