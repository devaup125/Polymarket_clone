import os
import sys
import time
from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError

# Load .env file
load_dotenv()

# Read MongoDB URI
MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    print("ERROR: MONGO_URI environment variable is not set.")
    sys.exit(1)

print("Connecting to MongoDB...")

try:
    client = MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=5000
    )

    # Verify connection
    for attempt in range(1, 6):
        try:
            client.admin.command("ping")
            print("Successfully connected to MongoDB!")
            break
        except ServerSelectionTimeoutError:
            print(f"Database not ready (Attempt {attempt}/5). Retrying...")
            time.sleep(3)
    else:
        print("Could not connect to MongoDB.")
        sys.exit(1)

except Exception as e:
    print("MongoDB Connection Error:")
    print(e)
    sys.exit(1)

# Get database
db = client.get_default_database()

# Collections
users_collection = db["users"]
markets_collection = db["markets"]
trades_collection = db["trades"]

print("Collections initialized successfully.")