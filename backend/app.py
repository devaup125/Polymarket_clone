from flask import Flask, jsonify, request
from flask_cors import CORS
from db import users_collection, markets_collection
import uuid

app = Flask(__name__)
CORS(app)

# 1. USER REGISTRATION
@app.route('/api/users/register', methods=['POST'])
def register_user():
    data = request.json or {}
    username = data.get("username")
    if not username:
        return jsonify({"error": "Username is required"}), 400
    if users_collection.find_one({"username": username}):
        return jsonify({"error": "Username is already taken"}), 409

    new_user = {
        "user_id": str(uuid.uuid4()),
        "username": username,
        "balance": 1000.00,
        "portfolio": {"Yes_shares": {}, "No_shares": {}}
    }
    users_collection.insert_one(new_user)
    new_user.pop("_id", None)
    return jsonify({"message": "User registered successfully!", "user": new_user}), 201

# 2. FETCH ALL MARKETS
@app.route('/api/markets', methods=['GET'])
def get_all_markets():
    markets = list(markets_collection.find({"status": "open"}))
    for m in markets:
        m.pop("_id", None)
    return jsonify({"markets": markets}), 200

# 3. CREATE A MARKET
@app.route('/api/markets/create', methods=['POST'])
def create_market():
    data = request.json or {}
    title = data.get("title")
    category = data.get("category")
    if not title or not category:
        return jsonify({"error": "Title and Category are required"}), 400

    new_market = {
        "market_id": str(uuid.uuid4()),
        "title": title,
        "category": category,
        "status": "open",
        "yes_price": 0.50,
        "no_price": 0.50,
        "total_yes_shares": 0,
        "total_no_shares": 0
    }
    markets_collection.insert_one(new_market)
    new_market.pop("_id", None)
    return jsonify({"message": "Market created!", "market": new_market}), 201

# 4. BUY A SHARE (THE TRADING ENGINE)
@app.route('/api/trades/buy', methods=['POST'])
def buy_share():
    data = request.json or {}
    username = data.get("username")
    market_id = data.get("market_id")
    outcome = data.get("outcome")
    
    if not username or not market_id or outcome not in ["YES", "NO"]:
        return jsonify({"error": "Missing fields"}), 400

    user = users_collection.find_one({"username": username})
    market = markets_collection.find_one({"market_id": market_id})
    
    if not user:
        return jsonify({"error": "User profile not found"}), 404
    if not market:
        return jsonify({"error": "Market not found"}), 404
    if market.get("status") != "open":
        return jsonify({"error": "This market has already closed"}), 400

    share_price = market["yes_price"] if outcome == "YES" else market["no_price"]

    if user["balance"] < share_price:
        return jsonify({"error": "Insufficient wallet balance"}), 400

    new_user_balance = round(user["balance"] - share_price, 2)
    
    portfolio = user.get("portfolio", {"Yes_shares": {}, "No_shares": {}})
    share_key = "Yes_shares" if outcome == "YES" else "No_shares"
    current_shares = portfolio.get(share_key, {}).get(market_id, 0)
    
    if share_key not in portfolio:
        portfolio[share_key] = {}
    portfolio[share_key][market_id] = current_shares + 1

    market_update_key = "total_yes_shares" if outcome == "YES" else "total_no_shares"
    new_market_share_total = market.get(market_update_key, 0) + 1

    users_collection.update_one(
        {"username": username},
        {"$set": {"balance": new_user_balance, "portfolio": portfolio}}
    )
    markets_collection.update_one(
        {"market_id": market_id},
        {"$set": {market_update_key: new_market_share_total}}
    )

    return jsonify({
        "message": "Trade executed successfully!",
        "outcome_purchased": outcome,
        "price_paid": share_price,
        "remaining_balance": new_user_balance,
        "updated_portfolio": portfolio
    }), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)