from fastapi import FastAPI, Form, HTTPException, Depends, Cookie, Request, Response
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.responses import HTMLResponse, JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta, datetime
from pydantic import BaseModel, Field, validator, ValidationError
from pymongo.errors import DuplicateKeyError, OperationFailure
from typing import Annotated
from dotenv import load_dotenv
from pymongo import MongoClient
import os, jwt, sys, re

app = FastAPI()

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

load_dotenv()  # Load env variables from .env

app.secret_key = os.getenv('SECRET_KEY')

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000", 
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
    fname: str = Form(...)
    lname: str = Form(...)
    username: str = Form(...)
    email: str = Form(...)
    password: str = Form(...) #remove min_length, max_length override @validator's

    @validator('username')
    def username_length(cls, v):
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

class Seller(BaseModel):
    username: str = (...),
    name: str = Form(...), 
    email: str = Form(...), 
    address: str = Form(...), 
    city: str = Form(...), 
    state: str = Form(...),
    zipcode: str = Form(...)

    @validator('name')
    def validate_name(cls, v):
        # check if organization name is the correct length
        if len(v) < 3:
            raise ValueError('Organization name must be between 5-15 characters long!')
        elif len(v) > 15:
            raise ValueError('Organization name must be between 5-15 characters long!')

        # check if org name doesn't contain any spaces
        if bool(re.search(r"\s", v)):
            raise ValueError('Organization name cannot contain any spaces!')
        
        # check if name contains digits or symbols
        if len(re.findall('[^a-zA-Z]+', v)):
            raise ValueError('Organization name can only contain letters a-z or A-Z')

        return v
    
    @validator('zipcode')
    def validate_zipcode(cls, v):
        # check if zipcode is not 5 digits
        if len(v) != 5:
            raise ValueError('Zipcode must be 5 digits!')
        
        # check if zipcode contains any characters other than 0-9 
        if bool(re.search(r"\D", v)):
            raise ValueError('Zipcode must only contain digits!')

        return v

# GET request made to the index page
@app.get('/')
async def index():
    return "Welcome to Market+!"

# POST request sent by the login form
@app.post('/login', response_model=None)
async def login(response: Response, form_data: Annotated[OAuth2PasswordRequestForm, Depends()]):
    try:
        user = UserLogin(email=form_data.username,password=form_data.password)

        collection = db['users']

        # find a user with the same email and password combo
        result = await collection.find_one({"email": user.email, "password": user.password})

        # user not found, raise operation failure error
        if result is None:
            raise OperationFailure('This combination of email and password does not exist!')
          
        # Create a JWT token
        access_token = jwt.encode({
            'username': result['username'],
            'expiration': str(datetime.now() + timedelta(minutes=10))
        }, app.secret_key, algorithm='HS256')

        # set the cookie
        response.set_cookie(key="access_token", value=access_token, httponly=True, path='/', secure=True, samesite="lax", expires=600)

        return {"access_token": access_token, "token_type": "bearer"}
    except OperationFailure:
        raise HTTPException(status_code=404, detail=["This combination of email and password does not exist!"])


# POST request sent by the signup form
@app.post('/signup', response_model=None)
async def signup(
    response: Response, 
    fname: str = Form(...), 
    lname: str = Form(...), 
    username: str = Form(...), 
    email: str = Form(...), 
    password: str = Form(...)):
    try:
        user = User(fname=fname, lname=lname, username=username, email=email, password=password)

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
        
        if result.acknowledged:
            # Create a JWT token
            access_token = jwt.encode({
                'username': user.username,
                'expiration': str(datetime.now() + timedelta(minutes=10))
            }, app.secret_key, algorithm='HS256')

            # set the cookie
            response.set_cookie(key="access_token", value=access_token, httponly=True, path='/', secure=True, samesite="lax", expires=600)

            return {"access_token": access_token, "token_type": "bearer"}
    except ValidationError as e:
        errors = [] # list to store raised ValueError's
        
        # add each ValueError to the list
        for error in e.errors():
            errors.append(error['msg'])

        # return a 400 status code and ValueErrors
        raise HTTPException(status_code=400, detail=errors)
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail=error_msgs)

@app.get('/validate-token')
async def validate_token(request: Request):
    try: 
        try:
            # get the cookie from the request
            cookie = request.headers.get('Cookie')

            # cookie does not exist, so user is not authenticated
            if cookie == None:
                raise HTTPException(status_code=401, detail="No Authentication Token Provided")

            # remove '{cookie_name}=' from cookie
            cookie = cookie.split('=')[1]

            payload = jwt.decode(cookie, app.secret_key, algorithms='HS256')

            # get the decoded token's expiration time
            expiration_time = datetime.fromisoformat(payload['expiration'])

            # check if token is expired
            if datetime.now() > expiration_time:
                raise HTTPException(status_code=401, detail="Expired Token")
            return payload
        except jwt.exceptions.InvalidSignatureError:
            raise HTTPException(status_code=401, detail="Invalid token signature")
    except jwt.exceptions.DecodeError:
        raise HTTPException(status_code=400, detail="Invalid token format")
    except HTTPException as e:
            raise HTTPException(status_code=e.status_code, detail=e.detail)
            
@app.get('/account')
async def account(request: Request, token: str = Depends(validate_token)):
    try:
        collection = db['users']

        # lookup the user's first name
        result = await collection.find_one({'username' : token['username']}, {'fname' : 1, 'username' : 1})

        return {'name' : result['fname'], 'username' : result['username']}
    except:
        return {"msg" : 'error occured'}


@app.get('/signout', response_model=None)
async def signout():
    try:        
        # create a new response
        response = Response()

        # delete the 'access_token' cookie
        response.delete_cookie(key="access_token")

        return response
    except HTTPException as e:
        return e

@app.post('/seller/signup', response_model=None)
async def seller_signup(response: Response,
    name: str = Form(...), 
    email: str = Form(...), 
    address: str = Form(...), 
    city: str = Form(...), 
    state: str = Form(...),
    zipcode: str = Form(...),
    token: str = Depends(validate_token)):
    try:
        seller = Seller(username=token['username'], name=name, email=email, address=address, city=city, state=state, zipcode=zipcode)

        collection = db["sellers"]

        error_msgs = []

        # check if current user already has a seller account
        user_result = await collection.find_one({'username' : seller.username})

        if user_result:
            error_msgs.append('You already are a registered seller!')
            raise DuplicateKeyError('You already are a registered seller!')

        # check if the user's store name is already in use
        name_result = await collection.find({'name' : {'$regex' : seller.name, '$options': 'i'}}).to_list(length=100)
    
        if len(name_result) > 0:
            error_msgs.append('Organization name already exists!')
            raise DuplicateKeyError('Organization name already exists!')

        # check if the user's email is already in use
        email_result = await collection.find_one({'email' : seller.email})

        if email_result:
            error_msgs.append('Email already exists!')
            raise DuplicateKeyError('Email already exists!')

        # insert record
        result = await collection.insert_one(dict(seller))

        return {"message" : "Seller account successfuly created!"}
    except ValidationError as e:
        errors = [] # store ValueErrors
        
        # add each ValueError to the list
        for error in e.errors():
            errors.append(error['msg'])

        # return a 400 status code and errors
        raise HTTPException(status_code=400, detail=errors)
    
    except DuplicateKeyError:
        raise HTTPException(status_code=409, detail=error_msgs)
        
    return {'message' : 'success'}

@app.get('/account/seller-status')
async def is_seller(token: str = Depends(validate_token)):
    try:
        collection = db["sellers"]

        # check if current user already has a seller account
        result = await collection.find_one({'username' : token['username']})
        
        if result is None:
            raise OperationFailure('User is not a seller!')
        
        return {'username' : result['username'], 'store-name': result['name']}
    except OperationFailure:
        raise HTTPException(status_code=404, detail=["User is not a seller!"])

@app.get('/seller/stores/{store}')
async def get_store(store: str):
    return "Visiting store"

@app.put('/seller/{store}/edit')
async def store_edit(store: str, token: str = Depends(validate_token)):
    return 'editing store'

@app.post('/products/create')
async def create_item(token: str = Depends(validate_token)):
    return "created product"