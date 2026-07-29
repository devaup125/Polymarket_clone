from flask import Flask, jsonify, request
from flask_cors import CORS
from db import users_collection, markets_collection
import uuid

app = Flask(__name__)
CORS(app)


# -----------------------------
# HOME
# -----------------------------
@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "success",
        "message": "Polymarket Clone Backend Running"
    }), 200


# -----------------------------
# REGISTER USER
# -----------------------------
@app.route("/api/users/register", methods=["POST"])
def register_user():
    try:
        data = request.get_json()

        username = data.get("username", "").strip()

        if username == "":
            return jsonify({
                "success": False,
                "error": "Username is required"
            }), 400

        existing = users_collection.find_one({"username": username})

        if existing:
            return jsonify({
                "success": False,
                "error": "Username already exists"
            }), 409

        user = {
            "user_id": str(uuid.uuid4()),
            "username": username,
            "balance": 1000.0,
            "portfolio": {
                "Yes_shares": {},
                "No_shares": {}
            }
        }

        users_collection.insert_one(user)

        user.pop("_id", None)

        return jsonify({
            "success": True,
            "message": "User registered successfully",
            "user": user
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# -----------------------------
# GET USER
# -----------------------------
@app.route("/api/users/<username>", methods=["GET"])
def get_user(username):

    user = users_collection.find_one({"username": username})

    if not user:
        return jsonify({
            "success": False,
            "error": "User not found"
        }), 404

    user.pop("_id", None)

    return jsonify({
        "success": True,
        "user": user
    })


# -----------------------------
# GET MARKETS
# -----------------------------
@app.route("/api/markets", methods=["GET"])
def get_markets():

    markets = list(markets_collection.find({"status": "open"}))

    for market in markets:
        market.pop("_id", None)

    return jsonify({
        "success": True,
        "markets": markets
    })


# -----------------------------
# CREATE MARKET
# -----------------------------
@app.route("/api/markets/create", methods=["POST"])
def create_market():

    try:

        data = request.get_json()

        title = data.get("title", "").strip()
        category = data.get("category", "").strip()

        if title == "" or category == "":
            return jsonify({
                "success": False,
                "error": "Title and category are required"
            }), 400

        duplicate = markets_collection.find_one({
            "title": title
        })

        if duplicate:
            return jsonify({
                "success": False,
                "error": "Market already exists"
            }), 409

        market = {
            "market_id": str(uuid.uuid4()),
            "title": title,
            "category": category,
            "status": "open",
            "yes_price": 0.50,
            "no_price": 0.50,
            "total_yes_shares": 0,
            "total_no_shares": 0
        }

        markets_collection.insert_one(market)

        market.pop("_id", None)

        return jsonify({
            "success": True,
            "message": "Market created successfully",
            "market": market
        }), 201

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# -----------------------------
# BUY SHARE
# -----------------------------
@app.route("/api/trades/buy", methods=["POST"])
def buy_share():

    try:

        data = request.get_json()

        username = data.get("username")
        market_id = data.get("market_id")
        outcome = data.get("outcome")

        if not username or not market_id or outcome not in ["YES", "NO"]:
            return jsonify({
                "success": False,
                "error": "Invalid request"
            }), 400

        user = users_collection.find_one({
            "username": username
        })

        if not user:
            return jsonify({
                "success": False,
                "error": "User not found"
            }), 404

        market = markets_collection.find_one({
            "market_id": market_id
        })

        if not market:
            return jsonify({
                "success": False,
                "error": "Market not found"
            }), 404

        if market["status"] != "open":
            return jsonify({
                "success": False,
                "error": "Market closed"
            }), 400

        price = market["yes_price"] if outcome == "YES" else market["no_price"]

        if user["balance"] < price:
            return jsonify({
                "success": False,
                "error": "Insufficient balance"
            }), 400

        balance = round(user["balance"] - price, 2)

        portfolio = user.get("portfolio", {
            "Yes_shares": {},
            "No_shares": {}
        })

        key = "Yes_shares" if outcome == "YES" else "No_shares"

        portfolio.setdefault(key, {})

        portfolio[key][market_id] = portfolio[key].get(market_id, 0) + 1

        market_key = "total_yes_shares" if outcome == "YES" else "total_no_shares"

        markets_collection.update_one(
            {"market_id": market_id},
            {
                "$inc": {
                    market_key: 1
                }
            }
        )

        users_collection.update_one(
            {"username": username},
            {
                "$set": {
                    "balance": balance,
                    "portfolio": portfolio
                }
            }
        )

        return jsonify({
            "success": True,
            "message": "Trade successful",
            "remaining_balance": balance,
            "portfolio": portfolio
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


# -----------------------------
# RUN SERVER
# -----------------------------
if __name__ == "__main__":
    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )