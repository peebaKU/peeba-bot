import os
from pymongo import MongoClient
from dotenv import load_dotenv
import pprint
from schemas import User,UserUpdateBody,UserCreate

load_dotenv()

path_db = os.getenv("DB")

client = MongoClient(path_db)

db = client["peebaDB"]

# print(db.list_collection_names())

his_col = db["history"]

# print(his_col.count_documents({}))

def read_history():
    list_history = []
    for i in his_col.find():
        i.pop("_id")
        list_history.append(i)
    return list_history


def check_users(item:User):
    user = his_col.find_one({"user_id":item.user_id})
    return user == None


def insert_user(user:UserCreate):
    his_col.insert_one(user)
    return {
        "id": user["user_id"],
        "name":user["name"],
        "vulgar_words_count":user["vulgar_words_count"]
    }


def update_user(user_id: str, update_body: UserUpdateBody):
    for user in his_col.find():
        if user["user_id"] == user_id:
            if update_body.operation == "increment":
                user["vulgar_words_count"] += update_body.value
            elif update_body.operation == "decrement":
                user["vulgar_words_count"] -= update_body.value
            result = his_col.update_one({"user_id": user_id}, {"$inc": {"vulgar_words_count": update_body.value}})
            return {"user_id": user["user_id"],
                    "name":user["name"],
                    "vulgar_words_count":user["vulgar_words_count"]
            }
    return {"error": "User not found"}