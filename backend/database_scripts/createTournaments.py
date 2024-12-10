import pymongo
from pymongo import MongoClient
from datetime import datetime
from bson.objectid import ObjectId
import bcrypt

# MongoDB connection
MONGO_URI = "mongodb+srv://final-project-group:E9CgQgieXtwJ7is3@mp3-cluster.bymfo.mongodb.net/final-project?retryWrites=true&w=majority&appName=mp3-cluster"
client = MongoClient(MONGO_URI)
db = client['final-project']  # Database name extracted from the connection string
tournaments_collection = db['tournaments']

# Function to create sample tournaments
def create_tournaments():
    try:
        # Tournament details
        tournaments = [
            {
                "title": "Spring Soccer Championship",
                "City": "Los Angeles",
                "State": "CA",
                "Country": "USA",
                "Sport": ObjectId("67553f570073492b5b0ed126"),  # Replace with a valid Sport ID from your database
                "startDate": datetime(2024, 3, 1),
                "endDate": datetime(2024, 3, 10),
                "password": bcrypt.hashpw("soccer123".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            },
            {
                "title": "Summer Tennis Open",
                "City": "New York",
                "State": "NY",
                "Country": "USA",
                "Sport": ObjectId("67554dfc011416dbd70be9c3"),  # Replace with a valid Sport ID from your database
                "startDate": datetime(2024, 6, 15),
                "endDate": datetime(2024, 6, 20),
                "password": bcrypt.hashpw("tennis2024".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            },
            {
                "title": "Winter Basketball League",
                "City": "Chicago",
                "State": "IL",
                "Country": "USA",
                "Sport": ObjectId("67554d8b011416dbd70be9bf"),  # Replace with a valid Sport ID from your database
                "startDate": datetime(2024, 12, 1),
                "endDate": datetime(2024, 12, 15),
                "password": bcrypt.hashpw("basketball2024".encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            }
        ]

        # Insert tournaments into the database
        tournaments_collection.insert_many(tournaments)
        print("All tournaments created successfully!")

    except Exception as e:
        print(f"Error creating tournaments: {e}")

    finally:
        client.close()

# Run the script
if __name__ == "__main__":
    create_tournaments()
