from fastapi import FastAPI, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, validator, ValidationError
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
collection = db["products"]

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
    
    @validator('password')
    def password_wrong_length(cls, v):
        if len(v) < 8: # password is shorter than 8 characters
            raise ValueError('password must be between 8-15 characters long!')
        elif len(v) > 15: # password is longer than 15 characters
            raise ValueError('password must be between 8-15 characters long!')

# GET request made to the index page
@app.get('/')
async def index():
    return "Welcome to Market+!"

# POST request sent by the login form
@app.post('/login/')
async def login(user: User):
    try:
        user = User(username=user.username, email=user.email, password=user.password)
    except:
        return {'error': '...'}
    return 'Logging in'

# POST request sent by the signup form
@app.post('/signup/')
async def signup(username: str = Form(...), email: str = Form(...), password: str = Form(...)):
    try:
        user = User(username=username, email=email, password=password)
        return 'Success!'
    except ValidationError as e:
        errors = [] # list to store raised ValueError's
        
        # add each ValueError to the list
        for error in e.errors():
            errors.append(error['msg'])

        # return a 400 status code and ValueErrors
        raise HTTPException(status_code=400, detail=errors)
