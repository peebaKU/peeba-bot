import os
from pymongo import MongoClient
from dotenv import load_dotenv
import pprint
from schemas import User,UserUpdateBody

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

def update_vulgar_words(item:User):
    user = his_col.find_one({"user_id":item.user_id})
    if(user != None):
        filter = { "_id": user["_id"] }

    else:
        his_col.insert_one(item.dict())
