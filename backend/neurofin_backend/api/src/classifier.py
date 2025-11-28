# api/src/classifier.py
import os
from pathlib import Path
import joblib
import numpy as np
from scipy.sparse import hstack

MODEL_DIR = Path(os.getenv("MODEL_DIR", Path(__file__).resolve().parents[1] / "models"))

_text_pipe = None
_clf = None
_le = None

def _load():
    global _text_pipe, _clf, _le
    if _text_pipe is None:
        _text_pipe = joblib.load(MODEL_DIR / "tx_text_pipe.joblib")
    if _clf is None:
        _clf = joblib.load(MODEL_DIR / "tx_clf.joblib")
    if _le is None:
        _le = joblib.load(MODEL_DIR / "tx_label_encoder.joblib")
    return _text_pipe, _clf, _le

def predict_single(description, amount=0.0, direction="debit"):
    tp, clf, le = _load()
    dir_num = 1 if str(direction).lower() == "credit" else -1
    text_vec = tp.transform([description])
    X = hstack([text_vec, np.array([[float(amount), dir_num]])])
    probs = clf.predict_proba(X)[0]
    pred_idx = int(clf.predict(X)[0])
    pred_label = le.inverse_transform([pred_idx])[0]
    confidence = float(max(probs))
    # return per-class probabilities keyed by label
    probs_dict = {lbl: float(p) for lbl, p in zip(le.classes_, probs)}
    return {"category": pred_label, "confidence": confidence, "probs": probs_dict}

def predict_batch(transactions):
    tp, clf, le = _load()
    descs = [t.get("description","") for t in transactions]
    amounts = [float(t.get("amount",0.0)) for t in transactions]
    dirs = [1 if str(t.get("direction","debit")).lower()=="credit" else -1 for t in transactions]
    text_vec = tp.transform(descs)
    num_arr = np.array([[a,d] for a,d in zip(amounts, dirs)])
    X = hstack([text_vec, num_arr])
    preds = clf.predict(X)
    probs = clf.predict_proba(X)
    results = []
    for idx, p in enumerate(preds):
        label = le.inverse_transform([int(p)])[0]
        conf = float(max(probs[idx]))
        probs_dict = {lbl: float(prob) for lbl, prob in zip(le.classes_, probs[idx])}
        results.append({"category": label, "confidence": conf, "probs": probs_dict})
    return results
