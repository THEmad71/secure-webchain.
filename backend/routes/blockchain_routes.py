from flask import Blueprint, jsonify

# Corrected: Added the missing underscores to __name__
blockchain_bp = Blueprint("blockchain", __name__)

@blockchain_bp.route("/test", methods=["GET"])
def blockchain_test():
    return jsonify({
        "status": "success",
        "message": "Blockchain route working"
    })