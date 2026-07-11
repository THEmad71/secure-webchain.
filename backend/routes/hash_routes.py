from flask import Blueprint, request, jsonify
import hashlib

hash_bp = Blueprint("hash", __name__)

@hash_bp.route("/generate", methods=["POST"])
def generate_hash():
    data = request.json
    if not data or "text" not in data:
        return jsonify({"error": "Missing 'text' in request body"}), 400
        
    text = data.get("text")
    algorithm = data.get("algorithm", "sha256").lower()

    # Dictionary mapping for algorithms
    algorithms = {
        "sha256": hashlib.sha256,
        "sha3_256": hashlib.sha3_256,
        "sha512": hashlib.sha512,
        "md5": hashlib.md5
    }

    if algorithm not in algorithms:
        return jsonify({"error": f"Algorithm '{algorithm}' is not supported"}), 400

    # Generate the hash
    hash_func = algorithms[algorithm]
    hash_value = hash_func(text.encode("utf-8")).hexdigest()

    return jsonify({
        "algorithm": algorithm,
        "input": text,
        "hash": hash_value
    })