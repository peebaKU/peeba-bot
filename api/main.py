from fastapi import FastAPI
from databases import read_history,update_vulgar_words
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
    return update_vulgar_words(item)
