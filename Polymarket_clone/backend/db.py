import os
from pymongo import MongoClient

# Connects to the database container over the Docker network
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/polymarket")

client = MongoClient(MONGO_URI)
db = client.get_database()

# Database collections for tracking our platform state
users_collection = db["users"]
markets_collection = db["markets"]
trades_collection = db["trades"]