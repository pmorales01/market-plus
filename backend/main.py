from fastapi import FastAPI, Form
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os 

app = FastAPI()

origins = [
    "http://localhost:3000"
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
    password: str = Form(...)

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