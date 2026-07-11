

from flask import Blueprint, request, jsonify
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import hashes, serialization
import base64

signature_bp = Blueprint("signature", __name__)

@signature_bp.route("/test", methods=["GET"])
def signature_test():
    return jsonify({"message": "Digital Signature route working"})

@signature_bp.route("/generate-keys", methods=["GET"])
def generate_keys():
    private_key = rsa.generate_private_key(public_exponent=65537, key_size=2048)
    public_key = private_key.public_key()
    
    private_pem = private_key.private_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PrivateFormat.PKCS8,
        encryption_algorithm=serialization.NoEncryption()
    ).decode("utf-8")
    
    public_pem = public_key.public_bytes(
        encoding=serialization.Encoding.PEM,
        format=serialization.PublicFormat.SubjectPublicKeyInfo
    ).decode("utf-8")
    
    return jsonify({"private_key": private_pem, "public_key": public_pem})

@signature_bp.route("/sign", methods=["POST"])
def sign_message():
    data = request.json
    message = data.get("message")
    private_key_pem = data.get("private_key")
    
    if not message or not private_key_pem:
        return jsonify({"error": "Message and private_key are required"}), 400
        
    private_key = serialization.load_pem_private_key(private_key_pem.encode("utf-8"), password=None)
    
    signature = private_key.sign(
        message.encode("utf-8"),
        padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),
        hashes.SHA256()
    )
    
    return jsonify({"message": message, "signature": base64.b64encode(signature).decode("utf-8")})

@signature_bp.route("/verify", methods=["POST"])
def verify_signature():
    data = request.json
    message = data.get("message")
    signature_base64 = data.get("signature")
    public_key_pem = data.get("public_key")
    
    if not message or not signature_base64 or not public_key_pem:
        return jsonify({"error": "Message, signature and public_key are required"}), 400
        
    try:
        public_key = serialization.load_pem_public_key(public_key_pem.encode("utf-8"))
        signature = base64.b64decode(signature_base64.encode("utf-8"))
        
        public_key.verify(
            signature,
            message.encode("utf-8"),
            padding.PSS(mgf=padding.MGF1(hashes.SHA256()), salt_length=padding.PSS.MAX_LENGTH),
            hashes.SHA256()
        )
        return jsonify({"valid": True, "message": "Signature is valid."})
    except Exception:
        return jsonify({"valid": False, "message": "Signature is invalid."}), 400