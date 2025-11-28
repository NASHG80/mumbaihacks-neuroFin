#!/usr/bin/env python3
import os
import time
import json
import numpy as np
import redis
from pymongo import MongoClient
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.getenv("MONGO_DB", "neurofin")

r = redis.Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
mongo = MongoClient(MONGO_URI)
db = mongo[MONGO_DB]
smoothed_coll = db["smoothed_balances"]

def kalman_update(x_prev, P_prev, z, dt=1.0, Q_scale=1.0, R_scale=1.0):
    A = np.array([[1.0, dt],[0.0, 1.0]])
    H = np.array([[1.0, 0.0]])
    Q = np.eye(2) * Q_scale
    R = np.array([[R_scale]])
    x_pred = A.dot(x_prev)
    P_pred = A.dot(P_prev).dot(A.T) + Q
    S = H.dot(P_pred).dot(H.T) + R
    K = P_pred.dot(H.T).dot(np.linalg.inv(S))
    y = np.array([[z]]) - H.dot(x_pred)
    x_new = x_pred + K.dot(y)
    P_new = (np.eye(2) - K.dot(H)).dot(P_pred)
    return x_new, P_new

def get_kalman_state(user_id):
    key = f"kalman:{user_id}"
    raw = r.get(key)
    if raw:
        obj = json.loads(raw)
        x = np.array(obj["x"])
        P = np.array(obj["P"])
        ts = obj.get("ts")
        return x, P, ts
    else:
        x = np.array([[0.0],[0.0]])
        P = np.eye(2) * 1e6
        return x, P, None

def set_kalman_state(user_id, x, P):
    key = f"kalman:{user_id}"
    obj = {
        "x": x.tolist(),
        "P": P.tolist(),
        "ts": datetime.utcnow().isoformat()
    }
    r.set(key, json.dumps(obj))

def write_smoothed_balance(user_id, as_of, smoothed_balance, var):
    doc = {
        "user_id": user_id,
        "as_of": datetime.fromisoformat(as_of) if isinstance(as_of, str) else as_of,
        "smoothed_balance": smoothed_balance,
        "var": var,
        "created_at": datetime.utcnow()
    }
    smoothed_coll.insert_one(doc)

print("Kalman service starting... connecting to Redis and MongoDB")
while True:
    try:
        item = r.brpop("transactions_queue", timeout=5)
        if item is None:
            continue
        _, payload_json = item
        payload = json.loads(payload_json)
        user_id = payload["user_id"]
        ts = payload["ts"]
        amount = float(payload["amount"])
        dir = payload["direction"]
        signed_amt = -amount if dir == "debit" else amount

        x_prev, P_prev, prev_ts = get_kalman_state(user_id)
        dt = 1.0
        if prev_ts:
            try:
                prev_dt = datetime.fromisoformat(prev_ts)
                cur_dt = datetime.utcnow()
                dt = max(1.0, (cur_dt - prev_dt).total_seconds() / 86400.0)
            except Exception:
                dt = 1.0

        z = signed_amt
        Q_scale = max(1.0, abs(signed_amt) * 0.1 + 1.0)
        R_scale = max(1.0, abs(signed_amt) * 0.5 + 1.0)

        x_new, P_new = kalman_update(x_prev, P_prev, z, dt=dt, Q_scale=Q_scale, R_scale=R_scale)
        set_kalman_state(user_id, x_new, P_new)
        smoothed_balance = float(x_new[0][0])
        var = float(P_new[0][0])
        write_smoothed_balance(user_id, ts, smoothed_balance, var)
        print(f"Processed tx for user {user_id} ts={ts} amt={signed_amt} smoothed={smoothed_balance:.2f}")

    except Exception as e:
        print("Kalman service error:", e)
        time.sleep(1)
