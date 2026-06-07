import os
import time
import sys
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError

MONGO_URI = os.getenv("MONGO_URI", "mongodb://db:27017/polymarket")

print("Connecting to MongoDB...")
client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=2000)
db = client.get_database()

for attempt in range(1, 6):
    try:
        client.admin.command('ping')
        print("Successfully connected to MongoDB!")
        break
    except ServerSelectionTimeoutError:
        print(f"Database not ready yet (Attempt {attempt}/5). Waiting...")
        time.sleep(3)
else:
    print("Could not connect to MongoDB. Exiting.")
    sys.exit(1)

users_collection = db["users"]
markets_collection = db["markets"]
trades_collection = db["trades"]
