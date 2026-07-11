from flask import Blueprint, request, jsonify
from cryptography.fernet import Fernet
import hashlib

message_bp = Blueprint("message", __name__)

@message_bp.route("/test", methods=["GET"])
def message_test():
    return jsonify({"message": "Secure Message route working"})

@message_bp.route("/encrypt", methods=["POST"])
def encrypt_message():
    data = request.json
    message = data.get("message")
    
    if not message:
        return jsonify({"error": "Message is required"}), 400
    
    # Generate a key and encrypt
    key = Fernet.generate_key()
    cipher = Fernet(key)
    encrypted_message = cipher.encrypt(message.encode("utf-8"))
    
    # Create a hash for integrity verification
    message_hash = hashlib.sha256(message.encode("utf-8")).hexdigest()
    
    return jsonify({
        "encrypted_message": encrypted_message.decode("utf-8"),
        "secret_key": key.decode("utf-8"),
        "message_hash": message_hash
    })

@message_bp.route("/decrypt", methods=["POST"])
def decrypt_message():
    data = request.json
    encrypted_message = data.get("encrypted_message")
    secret_key = data.get("secret_key")
    original_hash = data.get("message_hash")
    
    if not encrypted_message or not secret_key:
        return jsonify({"error": "encrypted_message and secret_key are required"}), 400
    
    try:
        cipher = Fernet(secret_key.encode("utf-8"))
        decrypted_message = cipher.decrypt(encrypted_message.encode("utf-8")).decode("utf-8")
        
        # Verify integrity
        new_hash = hashlib.sha256(decrypted_message.encode("utf-8")).hexdigest()
        integrity_valid = (original_hash == new_hash) if original_hash else True
        
        return jsonify({
            "decrypted_message": decrypted_message,
            "new_hash": new_hash,
            "integrity_valid": integrity_valid
        })
    except Exception:
        return jsonify({"error": "Decryption failed. Invalid key or message format."}), 400