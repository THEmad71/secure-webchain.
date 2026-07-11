from flask import Flask
from flask_cors import CORS
from routes.auth_routes import auth_bp
from routes.hash_routes import hash_bp
from routes.signature_routes import signature_bp
from routes.message_routes import message_bp
from routes.blockchain_routes import blockchain_bp

app = Flask(__name__)

# Using flask-cors is sufficient; it automatically handles 
# necessary headers for CORS preflight requests.
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    allow_headers=["Content-Type", "Authorization"],
    methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(hash_bp, url_prefix="/api/hash")
app.register_blueprint(signature_bp, url_prefix="/api/signature")
app.register_blueprint(message_bp, url_prefix="/api/message")
app.register_blueprint(blockchain_bp, url_prefix="/api/blockchain")

@app.route("/")
def home():
    return {"message": "SecureWebChain Backend is running"}

@app.route("/routes")
def show_routes():
    routes = []
    for rule in app.url_map.iter_rules():
        routes.append({
            "endpoint": rule.endpoint,
            "methods": list(rule.methods),
            "url": str(rule)
        })
    return {"routes": routes}

# Corrected: Added double underscores for the name == main check
if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)