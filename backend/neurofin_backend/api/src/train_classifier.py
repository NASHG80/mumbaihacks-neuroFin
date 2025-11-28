# api/src/train_classifier.py
"""
Train a simple transaction classifier using the CSV:
  api/models/transactions_training.csv

Outputs artifacts to: api/models/
  - tx_text_pipe.joblib
  - tx_clf.joblib
  - tx_label_encoder.joblib
  - metadata.json
"""

import os
import joblib
import json
import argparse
from pathlib import Path

import pandas as pd
from sklearn.pipeline import Pipeline
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.preprocessing import StandardScaler, LabelEncoder
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
from scipy.sparse import hstack
import numpy as np

DEFAULT_CSV = Path(__file__).resolve().parents[1] / "models" / "transactions_training.csv"

def load_data_from_csv(path):
    df = pd.read_csv(path)
    # normalize columns
    df['description'] = df.get('description', '').fillna('').astype(str)
    df['amount'] = pd.to_numeric(df.get('amount', 0), errors='coerce').fillna(0.0)
    df['direction'] = df.get('direction', 'debit').fillna('debit')
    df['category'] = df.get('category', 'OTHER').fillna('OTHER').astype(str)
    return df

def make_text_pipeline():
    return Pipeline([
        ("tfidf", TfidfVectorizer(ngram_range=(1,2), max_features=4000))
    ])

def prepare_Xy(df):
    X_text = df['description'].astype(str).values
    # numeric features: amount, direction-> +/-1
    dir_num = df['direction'].apply(lambda x: 1 if str(x).lower()=='credit' else -1).values
    amounts = df['amount'].astype(float).values
    X_num = np.vstack([amounts, dir_num]).T  # shape (n,2)
    y = df['category'].astype(str).values
    return X_text, X_num, y

def train(args):
    csv_path = Path(args.csv) if args.csv else DEFAULT_CSV
    if not csv_path.exists():
        raise FileNotFoundError(f"CSV not found: {csv_path}")

    df = load_data_from_csv(csv_path)
    print(f"[train] Loaded {len(df)} rows. Categories distribution:")
    print(df['category'].value_counts().to_dict())

    X_text, X_num, y = prepare_Xy(df)

    # label encode targets
    le = LabelEncoder()
    y_enc = le.fit_transform(y)

    # stratify split if possible
    stratify = y_enc if len(set(y_enc)) > 1 and len(y_enc) >= 4 else None
    X_text_train, X_text_val, X_num_train, X_num_val, y_train, y_val = train_test_split(
        X_text, X_num, y_enc, test_size=0.2, random_state=42, stratify=stratify
    )

    text_pipe = make_text_pipeline()
    clf = RandomForestClassifier(n_estimators=200, n_jobs=-1, random_state=42)

    # Fit text pipeline
    print("[train] Fitting TF-IDF...")
    text_pipe.fit(X_text_train)
    Xt_train = text_pipe.transform(X_text_train)
    Xt_val = text_pipe.transform(X_text_val)

    # Combine text sparse matrix with numeric array
    X_train_full = hstack([Xt_train, np.array(X_num_train)])
    X_val_full = hstack([Xt_val, np.array(X_num_val)])

    print("[train] Training classifier...")
    clf.fit(X_train_full, y_train)

    # Evaluate
    preds = clf.predict(X_val_full)
    acc = accuracy_score(y_val, preds)
    print(f"[train] Validation accuracy: {acc:.4f}")
    print("[train] Classification report:")
    print(classification_report(y_val, preds, target_names=le.classes_))

    # Save artifacts
    out_dir = Path(args.out_dir or Path(__file__).resolve().parents[1] / "models")
    out_dir.mkdir(parents=True, exist_ok=True)

    model_text_path = out_dir / "tx_text_pipe.joblib"
    clf_path = out_dir / "tx_clf.joblib"
    le_path = out_dir / "tx_label_encoder.joblib"

    joblib.dump(text_pipe, model_text_path)
    joblib.dump(clf, clf_path)
    joblib.dump(le, le_path)

    metadata = {
        "model": str(clf_path.name),
        "text_pipe": str(model_text_path.name),
        "label_encoder": str(le_path.name),
        "categories": list(le.classes_),
        "trained_on": len(df)
    }
    (out_dir / "metadata.json").write_text(json.dumps(metadata, indent=2))
    print(f"[train] Saved model artifacts to {out_dir}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--csv", help="Path to labeled CSV (default: api/models/transactions_training.csv)")
    parser.add_argument("--out-dir", default=None, help="Where to save trained models (default: api/models/)")
    args = parser.parse_args()
    train(args)
