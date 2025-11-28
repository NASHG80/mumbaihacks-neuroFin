# forecast_service.py
import os
import json
from datetime import datetime, timedelta
from typing import List, Dict

import numpy as np
import pandas as pd
from flask import Flask, jsonify, request
from pymongo import MongoClient
from dateutil import parser as dateparser

# tensorflow imports
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense
from tensorflow.keras.callbacks import EarlyStopping

MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongodb:27017")
MONGO_DB = os.getenv("MONGO_DB", "neurofin")

client = MongoClient(MONGO_URI)
db = client[MONGO_DB]

app = Flask(__name__)

def load_transactions(user_id: str, days: int = 365) -> pd.DataFrame:
    """
    Loads transactions for user and returns a daily net-flow series (pandas DataFrame with index date).
    """
    coll = db["transactions"]
    end = datetime.utcnow()
    start = end - timedelta(days=days)
    cursor = coll.find({"user_id": user_id, "ts": {"$gte": start, "$lte": end}})
    tx = list(cursor)
    if not tx:
        return pd.DataFrame({"amount": []})

    df = pd.DataFrame(tx)
    # Ensure ts field is a datetime
    if "ts" in df.columns:
        df["ts"] = pd.to_datetime(df["ts"])
    else:
        # try timestamp fields like timestamp
        df["ts"] = pd.to_datetime(df.get("timestamp", pd.Series([])))
    # Convert debit/credit into signed amount if direction field is present
    if "direction" in df.columns:
        df["signed_amount"] = df.apply(lambda r: r["amount"] if r.get("direction","credit") == "credit" else -abs(r["amount"]), axis=1)
    else:
        df["signed_amount"] = df["amount"]
    # aggregate daily net flow
    df["date"] = df["ts"].dt.floor("D")
    daily = df.groupby("date")["signed_amount"].sum().rename("net").to_frame()
    # reindex to continuous daily index
    idx = pd.date_range(start=daily.index.min(), end=daily.index.max(), freq="D")
    daily = daily.reindex(idx, fill_value=0.0)
    daily.index.name = "date"
    daily = daily.reset_index()
    daily["date"] = pd.to_datetime(daily["date"])
    daily.set_index("date", inplace=True)
    return daily

def create_sequences(series: np.ndarray, seq_len: int):
    X, y = [], []
    for i in range(len(series) - seq_len):
        X.append(series[i:i+seq_len])
        y.append(series[i+seq_len])
    X = np.array(X)
    y = np.array(y)
    return X, y

def build_model(seq_len: int, n_units: int = 32):
    model = Sequential()
    model.add(LSTM(n_units, input_shape=(seq_len, 1)))
    model.add(Dense(1))
    model.compile(optimizer="adam", loss="mse")
    return model

def forecast_from_series(series: pd.Series, horizon: int = 14, seq_len: int = 14, epochs: int = 10):
    if len(series) < seq_len + 1:
        # not enough history — pad with zeros
        padded = np.pad(series.values, (seq_len+1 - len(series), 0), "constant", constant_values=0.0)
        series = pd.Series(padded, index=pd.date_range(end=datetime.utcnow(), periods=len(padded), freq="D"))

    # normalize
    mean = series.mean()
    std = series.std() if series.std() > 0 else 1.0
    arr = (series.values - mean) / std

    X, y = create_sequences(arr, seq_len)
    # reshape for LSTM
    X = X.reshape((X.shape[0], X.shape[1], 1))
    y = y.reshape((-1, 1))

    model = build_model(seq_len, n_units=32)

    # tiny training loop (early stop)
    es = EarlyStopping(monitor="loss", patience=3, restore_best_weights=True, verbose=0)
    model.fit(X, y, epochs=epochs, batch_size=16, verbose=0, callbacks=[es])

    preds = []
    last_window = arr[-seq_len:].tolist()
    for _ in range(horizon):
        x = np.array(last_window).reshape((1, seq_len, 1))
        p = model.predict(x, verbose=0)[0,0]
        preds.append(p)
        last_window = last_window[1:] + [p]

    # denormalize
    preds = np.array(preds) * std + mean
    return preds, {"mean": float(mean), "std": float(std), "trained_samples": len(X)}

@app.route("/predict/<user_id>", methods=["POST", "GET"])
def predict(user_id):
    """
    Trigger a prediction for user_id.
    Optional query param: horizon (days)
    """
    try:
        horizon = int(request.args.get("horizon", "14"))
        seq_len = int(request.args.get("seq_len", "14"))
        epochs = int(request.args.get("epochs", "10"))
    except Exception:
        horizon, seq_len, epochs = 14, 14, 10

    # load last 365 days
    daily = load_transactions(user_id, days=365)
    if daily.empty:
        return jsonify({"error": "no_transactions"}), 404

    series = daily["net"]
    preds, meta = forecast_from_series(series, horizon=horizon, seq_len=seq_len, epochs=epochs)

       # build forecast docs
    # NOTE: keep real datetimes for DB insert, but return ISO strings to the HTTP client
    today = pd.to_datetime(series.index[-1])
    mongo_predictions = []
    response_predictions = []
    for i, val in enumerate(preds, 1):
        as_of_dt = (today + pd.Timedelta(days=i)).to_pydatetime()
        mongo_predictions.append({"as_of": as_of_dt, "pred": float(val)})
        response_predictions.append({"as_of": as_of_dt.isoformat(), "pred": float(val)})

    mongo_doc = {
        "user_id": user_id,
        "created_at": datetime.utcnow(),
        "horizon": horizon,
        "frequency": "daily",
        "predictions": mongo_predictions,
        "meta": {"model": "lstm-v1", **meta}
    }

    # store into forecasts (keep datetimes for Mongo)
    db.forecasts.insert_one(mongo_doc)

    # prepare a response-safe version (datetimes → ISO strings)
    response_doc = {
        "user_id": user_id,
        "created_at": mongo_doc["created_at"].isoformat(),
        "horizon": horizon,
        "frequency": "daily",
        "predictions": response_predictions,
        "meta": mongo_doc["meta"]
    }

    return jsonify({"status": "ok", "forecast": response_doc})


   
@app.route("/health")
def health():
    return jsonify({"status": "ok", "mongodb": bool(db.list_collection_names())})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.getenv("PORT", 5000)))
