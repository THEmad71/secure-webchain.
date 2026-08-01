import os
import json
import joblib
import pandas as pd
from flask import Blueprint, request, jsonify

ids_bp = Blueprint("ids", __name__)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_DIR = os.path.join(BASE_DIR, "models")

MODEL_PATH = os.path.join(MODEL_DIR, "ids_pipeline.pkl")
METADATA_PATH = os.path.join(MODEL_DIR, "model_metadata.json")
SAMPLE_PATH = os.path.join(MODEL_DIR, "sample_traffic.csv")

ids_pipeline = None
model_metadata = {}

def load_model():
    global ids_pipeline, model_metadata
    if ids_pipeline is None:
        if not os.path.exists(MODEL_PATH):
            raise FileNotFoundError(f"Model file not found: {MODEL_PATH}")
        ids_pipeline = joblib.load(MODEL_PATH)
    if not model_metadata:
        if os.path.exists(METADATA_PATH):
            with open(METADATA_PATH, "r") as f:
                model_metadata = json.load(f)
    return ids_pipeline

@ids_bp.route("/test", methods=["GET"])
def ids_test():
    try:
        load_model()
        return jsonify({
            "status": "success",
            "message": "IDS model loaded successfully"
        })
    except Exception as e:
        return jsonify({
            "status": "error",
            "message": str(e)
        }), 500

@ids_bp.route("/metadata", methods=["GET"])
def get_metadata():
    try:
        load_model()
        safe_metadata = {
            "model_name": model_metadata.get("model_name", "Random Forest IDS"),
            "dataset": model_metadata.get("dataset", "UNSW-NB15"),
            "target_mapping": model_metadata.get(
                "target_mapping",
                {"0": "Normal", "1": "Attack"}
            ),
            "metrics": model_metadata.get("metrics", {}),
            "feature_columns": model_metadata.get("feature_columns", []),
            "top_features": model_metadata.get("top_features", []),
            "example_input": model_metadata.get("example_input", {})
        }
        return jsonify(safe_metadata)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@ids_bp.route("/sample", methods=["GET"])
def get_sample():
    try:
        if not os.path.exists(SAMPLE_PATH):
            return jsonify({"error": "sample_traffic.csv not found"}), 404
        sample_df = pd.read_csv(SAMPLE_PATH)
        records = sample_df.head(10).to_dict(orient="records")
        return jsonify({
            "count": len(records),
            "samples": records
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@ids_bp.route("/predict", methods=["POST", "OPTIONS"])
def predict_intrusion():
    try:
        # Browser preflight request handle
        if request.method == "OPTIONS":
            return jsonify({"status": "ok"}), 200
            
        model = load_model()
        data = request.get_json(silent=True)
        if not data:
            return jsonify({"error": "No JSON data received"}), 400
            
        feature_columns = model_metadata.get("feature_columns", [])
        if feature_columns:
            input_data = {}
            missing_features = []
            for col in feature_columns:
                if col in data:
                    input_data[col] = data[col]
                else:
                    missing_features.append(col)
                    input_data[col] = None
            input_df = pd.DataFrame([input_data])
        else:
            missing_features = []
            input_df = pd.DataFrame([data])
            
        prediction = int(model.predict(input_df)[0])
        
        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(input_df)[0]
            normal_probability = float(probabilities[0])
            attack_probability = float(probabilities[1])
            confidence = float(max(probabilities))
        else:
            normal_probability = None
            attack_probability = None
            confidence = None
            
        result = "Attack" if prediction == 1 else "Normal"
        if result == "Attack":
            if confidence is not None and confidence >= 0.85:
                risk_level = "High"
            elif confidence is not None and confidence >= 0.65:
                risk_level = "Medium"
            else:
                risk_level = "Low"
        else:
            risk_level = "Low"
            
        return jsonify({
            "prediction": result,
            "label": prediction,
            "confidence": confidence,
            "normal_probability": normal_probability,
            "attack_probability": attack_probability,
            "risk_level": risk_level,
            "missing_features_count": len(missing_features),
            "missing_features": missing_features[:10]
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@ids_bp.route("/predict-batch", methods=["POST", "OPTIONS"])
def predict_batch():
    try:
        # Browser preflight request handle
        if request.method == "OPTIONS":
            return jsonify({"status": "ok"}), 200
            
        model = load_model()
        data = request.get_json(silent=True)
        if not data or "records" not in data:
            return jsonify({"error": "records array is required"}), 400
            
        records = data["records"]
        if not isinstance(records, list) or len(records) == 0:
            return jsonify({"error": "records must be a non-empty list"}), 400
            
        feature_columns = model_metadata.get("feature_columns", [])
        processed_records = []
        for record in records:
            if feature_columns:
                processed_records.append({
                    col: record.get(col, None) for col in feature_columns
                })
            else:
                processed_records.append(record)
                
        input_df = pd.DataFrame(processed_records)
        predictions = model.predict(input_df)
        
        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(input_df)
        else:
            probabilities = None
            
        results = []
        attack_count = 0
        normal_count = 0
        
        for i, pred in enumerate(predictions):
            pred_int = int(pred)
            result = "Attack" if pred_int == 1 else "Normal"
            if result == "Attack":
                attack_count += 1
            else:
                normal_count += 1
                
            if probabilities is not None:
                normal_prob = float(probabilities[i][0])
                attack_prob = float(probabilities[i][1])
                confidence = float(max(probabilities[i]))
            else:
                normal_prob = None
                attack_prob = None
                confidence = None
                
            results.append({
                "index": i,
                "prediction": result,
                "label": pred_int,
                "confidence": confidence,
                "normal_probability": normal_prob,
                "attack_probability": attack_prob
            })
            
        return jsonify({
            "total": len(results),
            "normal_count": normal_count,
            "attack_count": attack_count,
            "attack_percentage": round((attack_count / len(results)) * 100, 2),
            "results": results
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500