from flask import Flask, jsonify, request
from flask_cors import CORS
from db import users_collection
import uuid

app = Flask(__name__)
CORS(app) # Allows your React frontend to talk to this API later

@app.route('/api/users/register', methods=['POST'])
def register_user():
    data = request.json or {}
    username = data.get("username")
    
    if not username:
        return jsonify({"error": "Username is required"}), 400
        
    if users_collection.find_one({"username": username}):
        return jsonify({"error": "Username is already taken"}), 409

    # Setup the new user profile with 1,000 starting fictional bucks
    new_user = {
        "user_id": str(uuid.uuid4()),
        "username": username,
        "balance": 1000.00,
        "portfolio": {
            "Yes_shares": {}, # market_id -> quantity
            "No_shares": {}   # market_id -> quantity
        }
    }
    
    users_collection.insert_one(new_user)
    new_user.pop("_id", None) # Remove MongoDB's internal ID object before responding
    
    return jsonify({"message": "User registered successfully!", "user": new_user}), 201

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)