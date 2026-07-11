from flask import Blueprint, request, jsonify
import bcrypt
import jwt
import datetime
from services.supabase_client import supabase
from config import JWT_SECRET

# Corrected: Changed 'name' to '__name__'
auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/test", methods=["GET"])
def auth_test():
    return jsonify({"message": "Auth route working"})

@auth_bp.route("/register", methods=["POST", "OPTIONS"])
def register():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data received"}), 400
        
        name, email, password = data.get("name"), data.get("email"), data.get("password")
        
        if not name or not email or not password:
            return jsonify({"error": "Name, email and password are required"}), 400
        
        if supabase is None:
            return jsonify({"error": "Supabase client is not configured"}), 500
        
        existing_user = supabase.table("users").select("*").eq("email", email).execute()
        if existing_user.data:
            return jsonify({"error": "User already exists"}), 409
        
        password_hash = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")
        
        result = supabase.table("users").insert({
            "name": name, 
            "email": email, 
            "password_hash": password_hash
        }).execute()
        
        return jsonify({"message": "Registration successful", "user": result.data[0]}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@auth_bp.route("/login", methods=["POST", "OPTIONS"])
def login():
    try:
        data = request.get_json()
        if not data:
            return jsonify({"error": "No JSON data received"}), 400
            
        email, password = data.get("email"), data.get("password")
        
        if not email or not password:
            return jsonify({"error": "Email and password are required"}), 400
            
        result = supabase.table("users").select("*").eq("email", email).execute()
        if not result.data:
            return jsonify({"error": "Invalid email or password"}), 401
            
        user = result.data[0]
        if not bcrypt.checkpw(password.encode("utf-8"), user["password_hash"].encode("utf-8")):
            return jsonify({"error": "Invalid email or password"}), 401
            
        # Use timezone-aware UTC
        payload = {
            "user_id": user["id"],
            "email": user["email"],
            "exp": datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(hours=3)
        }
        
        token = jwt.encode(payload, JWT_SECRET, algorithm="HS256")
        
        return jsonify({
            "message": "Login successful",
            "token": token,
            "user": {"id": user["id"], "name": user["name"], "email": user["email"]}
        }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500