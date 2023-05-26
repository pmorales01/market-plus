from fastapi import FastAPI, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator, ValidationError
from pymongo.errors import DuplicateKeyError, OperationFailure
from pymongo import MongoClient

import os 

app = FastAPI()

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

#Initialize MongoDB client
mongo_client = AsyncIOMotorClient("mongodb://localhost:27017")
db = mongo_client["market"]

# User model
class User(BaseModel):
    username: str = Form(...)
    email: str = Form(...)
    password: str = Form(...) #remove min_length, max_length override @validator's

    @validator('username')
    def username_lengh(cls, v):
        if len(v) < 5: # username is shorter than 5 characters
            raise ValueError('username must be between 5-10 characters long!')
        elif len(v) > 10: # username is longer than 10 characters
            raise ValueError('username must be between 5-10 characters long!')
        return v

    @validator('password')
    def password_wrong_length(cls, v):
        if len(v) < 8: # password is shorter than 8 characters
            raise ValueError('password must be between 8-15 characters long!')
        elif len(v) > 15: # password is longer than 15 characters
            raise ValueError('password must be between 8-15 characters long!')
        return v

# UserLogin model
class UserLogin(BaseModel):
    email: str = Form(...)
    password: str = Form(...)

# GET request made to the index page
@app.get('/')
async def index():
    return "Welcome to Market+!"

# POST request sent by the login form
@app.post('/login/')
async def login(email: str = Form(...), password: str = Form(...)):
    try:
        user = UserLogin(email=email,password=password)

        collection = db['users']

        # find a user with the same email and password combo
        result = await collection.find_one({"email": user.email, "password": user.password})

        # user not found, raise operation failure error
        if result is None:
            raise OperationFailure('This combination of email and password does not exist!')
        
        return "Access granted!"
    except:
        raise HTTPException(status_code=404, detail=["This combination of email and password does not exist!"])


# POST request sent by the signup form
@app.post('/signup/')
async def signup(username: str = Form(...), email: str = Form(...), password: str = Form(...)):
    try:
        user = User(username=username, email=email, password=password)

        collection = db["users"]

        # check if username already exists
        username_result = await collection.find_one({"username": user.username})
        
        error_msgs = []
        if username_result:
            error_msgs.append('Username already exists!')
            raise DuplicateKeyError("Username already exists!")
        
        # check if email is already in use
        email_result = await collection.find_one({"email": user.email})
        
        if email_result:
            error_msgs.append("Email already in use!")
            raise DuplicateKeyError("Email already in use!")
        
        result = await collection.insert_one(dict(user))

        return 'Success!'
    except ValidationError as e:
        errors = [] # list to store raised ValueError's
        
        # add each ValueError to the list
        for error in e.errors():
            errors.append(error['msg'])

        # return a 400 status code and ValueErrors
        raise HTTPException(status_code=400, detail=errors)
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail=error_msgs)

@app.get('/users/{username}')
async def user_index():
    raise HTTPException(status_code=401, detail="Unauthorized")
