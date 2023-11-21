from pydantic import BaseModel


class UserUpdateBody(BaseModel):
  operation: str #increment, decrement
  value: int


class User(BaseModel):
    user_id:str
    name:str
    vulgar_words_count:UserUpdateBody
