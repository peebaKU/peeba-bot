from fastapi import FastAPI
from databases import read_history,update_user,check_users,insert_user
from schemas import User

app = FastAPI()


@app.get("/")
def home():
    return {"Hello World"}


@app.get("/items")
def read_items():
    return read_history()

@app.patch("/update")
def update_vulgar(item:User):
    check_user = check_users(item)
    if(check_user):
        print("66666")
        return  insert_user({"user_id":item.user_id,"name":item.name,"vulgar_words_count":1})
    return update_user(item.user_id,item.vulgar_words_count)
