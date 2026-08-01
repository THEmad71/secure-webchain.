from flask import Blueprint, request, jsonify
import hashlib
import json
import time

blockchain_bp = Blueprint("blockchain", __name__)

# In-memory blockchain logs
# Server restart দিলে logs reset হয়ে যাবে
blockchain = []


def calculate_hash(block):
    block_string = json.dumps(
        {
            "index": block["index"],
            "timestamp": block["timestamp"],
            "activity": block["activity"],
            "data": block["data"],
            "previous_hash": block["previous_hash"],
        },
        sort_keys=True
    ).encode("utf-8")
    return hashlib.sha256(block_string).hexdigest()


def create_genesis_block():
    genesis_block = {
        "index": 0,
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "activity": "Genesis Block",
        "data": "SecureWebChain blockchain log started",
        "previous_hash": "0",
    }
    genesis_block["hash"] = calculate_hash(genesis_block)
    return genesis_block


def initialize_chain():
    if len(blockchain) == 0:
        blockchain.append(create_genesis_block())


@blockchain_bp.route("/test", methods=["GET"])
def blockchain_test():
    return jsonify({
        "status": "success",
        "message": "Blockchain route working"
    })


@blockchain_bp.route("/logs", methods=["GET"])
def get_logs():
    initialize_chain()
    return jsonify({
        "chain": blockchain,
        "length": len(blockchain)
    })


@blockchain_bp.route("/add-log", methods=["POST"])
def add_log():
    initialize_chain()
    data = request.json
    if not data:
        return jsonify({"error": "No JSON data received"}), 400

    activity = data.get("activity")
    log_data = data.get("data")

    if not activity or not log_data:
        return jsonify({"error": "activity and data are required"}), 400

    previous_block = blockchain[-1]
    new_block = {
        "index": len(blockchain),
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
        "activity": activity,
        "data": log_data,
        "previous_hash": previous_block["hash"],
    }
    new_block["hash"] = calculate_hash(new_block)
    blockchain.append(new_block)

    return jsonify({
        "message": "Log added successfully",
        "block": new_block
    }), 201


@blockchain_bp.route("/validate", methods=["GET"])
def validate_chain():
    initialize_chain()
    for i in range(1, len(blockchain)):
        current_block = blockchain[i]
        previous_block = blockchain[i - 1]

        # Check current block hash
        recalculated_hash = calculate_hash(current_block)
        if current_block["hash"] != recalculated_hash:
            return jsonify({
                "valid": False,
                "message": f"Block {i} hash is invalid"
            })

        # Check previous hash link
        if current_block["previous_hash"] != previous_block["hash"]:
            return jsonify({
                "valid": False,
                "message": f"Block {i} previous hash does not match"
            })

    return jsonify({
        "valid": True,
        "message": "Blockchain log is valid"
    })