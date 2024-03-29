from fastapi import FastAPI, Form, Body, HTTPException, Depends, Cookie, Request, Response, File, UploadFile
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.encoders import jsonable_encoder
from fastapi.responses import HTMLResponse, JSONResponse
from motor.motor_asyncio import AsyncIOMotorClient
from fastapi.middleware.cors import CORSMiddleware
from datetime import timedelta, datetime
from pydantic import BaseModel, Field, validator, ValidationError
from pymongo.errors import DuplicateKeyError, OperationFailure
from typing import Annotated, Optional, List, Dict
from dotenv import load_dotenv
from pymongo import MongoClient
from bson import Binary
from uuid import UUID, uuid4
from models import Product, GetProduct
import os, jwt, sys, re, uuid, base64, json

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
mongo_client = AsyncIOMotorClient("mongodb://localhost:27017", uuidRepresentation='standard')
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

@app.get('/account/is-seller')
async def is_seller(token: str = Depends(validate_token)):
    try:
        collection = db["sellers"]

        # check if current user already has a seller account
        result = await collection.find_one({'username' : token['username']})
        
        if result is None:
            raise OperationFailure('User is not a seller!') 

        return {'username' : result['username'], 'name': result['name']}
    except OperationFailure:
        raise HTTPException(status_code=404, detail=["User is not a seller!"])

@app.get('/account/authenticate-seller')
async def authenticate_seller(store: str, seller: str = Depends(is_seller)):
    try:
        if (store != seller['name']):
            raise HTTPException(status_code=403, detail="Access Denied")
        return seller
    except OperationFailure:
        raise HTTPException(status_code=404, detail=["User is not a seller!"])

@app.get('/stores/{store}')
async def get_store(store: str):
    return "Visiting store"

@app.get('/{store}/products/edit')
async def store_edit(store: str, seller: str = Depends(authenticate_seller)):
    """Returns a list of a seller's products that are available to edit, 
    delete, duplicate"""
    try:
        collection = db["products"]
        
        # seller is authenticated, find products with seller's name
        result = await collection.find({'seller': seller['name']}, {'alias' : 1, 'id': 1, 'name': 1, 'images': 1}).to_list(length=100)
        
        # no products retrieved
        if not result:
            raise HTTPException(status_code=404, detail="Products not found")
        
        # for each product found, only return the alias, id, name
        products = []
        for product in result:
            # get the first image of each product
            image = product['images'][0]

            products.append({'seller': seller['name'], 'name': product['name'], 'alias' : product['alias'], 'id' : product['id'], 
                'image': {'bytes' : base64.b64encode(image['bytes']).decode("utf-8"), 'type' : image['type']}
            })
        
        return products
    except OperationFailure as e:
        return {"Operation Error": e}

@app.post('/{store}/products/{name}/{id}/clone')
async def clone_product(store: str, name: str, id: UUID, seller: str=Depends(authenticate_seller)):
    """Create a copy of the product that matches the store, name, and id."""
    try:
        collection = db['products']

        # find record matching seller, name, and id
        result = await collection.find_one({'seller': seller['name'], 'name': name, 'id': str(id)})

        # record not found, cannot duplicate
        if not result:
            raise HTTPException(status_code=404, detail="Original Product Not Found")
        
        # create a dictionary from record
        clone = dict(result)
        
        # set the new copy's id 
        clone['id'] = str(uuid.uuid4())

        # remove the ObjectId Field
        clone.pop('_id')

        # create the copy
        clone_result = await collection.insert_one(clone)

        return {"message": "Successfully created copy of product!"}
    except OperationFailure as e:
        return {"Operation Error": e}

@app.post('/{store}/products/{name}/{id}/delete')
async def delete_product(store: str, name: str, id: UUID, seller: str=Depends(authenticate_seller)):
    try:
        collection = db['products']

        # delete the record with the matching seller, name, and id
        result = await collection.delete_one({'seller': seller['name'], 'name': name, 'id': str(id)})

        # if the delete count isn't one, somethign went wrong
        if result.deleted_count != 1:
            raise HTTPException(status_code=404, detail="Product not found or could not be deleted")

        return "Product deleted successfully"

    except OperationFailure as e:
        return {"Operation Error": e}

@app.put('/{store}/products/item/edit/{name}/{id}')
async def edit_product(store: str, name: str, id: UUID, seller: str = Depends(authenticate_seller)):
    return {'store': store, 'name' : name, 'id': id}

async def getAliasPath(name: str):
    # split name by '-'
    parts = name.split('-')

    path = ''

    # max length of name (path)
    MAX_LENGTH = 30

    # for each part, concatenate to path if total is <= 30 characters
    for part in parts:
        if part != '': # if part is not empty
            # len(total path) + 1 char for '-' + len(new part)
            if len(path) + 1 + len(part) <= MAX_LENGTH: # add if <= 30 characters
                if path != '':
                    path = path + '-' + part
                else: # base case: '' + first part
                    path = part
            else: # stop adding parts, maximum length reached (or would exceed)
                break

    # return lowercase path name
    return path.lower()

@app.post('/{store}/products/create')
async def create_item(
    name: str = Form(...),
    publisher: str = Form(...),
    price: float = Form(...),
    short_desc: str = Form(...),
    genre: List[str] = Form(...),
    condition: str = Form(...),
    condition_desc: str = Form(...),
    images: List[UploadFile] = File(...),
    seller: str = Depends(authenticate_seller)):
    try:
        product = Product(
            name=name,
            publisher=publisher,
            price=price,
            short_desc=short_desc,
            genre=genre,
            condition=condition, 
            condition_desc=condition_desc,
        )

        # create a dict from Product
        data = dict(product)
        
        # array to store uploaded images
        imgs = []
        
        # for each image, read its content, and add its binary data and data type to imgs
        for image in images:
            bytes_read = await image.read()
            file_type = image.content_type
            imgs.append({'bytes': Binary(bytes_read), 'type': file_type})
        
        # add the images (binary), seller name, and id to 'data'
        data['images'] = imgs
        data['seller'] = seller['name']
        data['id'] = str(uuid.uuid4())
        data['alias'] = await getAliasPath(data['name'])

        collection = db["products"]

        # create a product by inserting it into the collection 
        result = await collection.insert_one(dict(data))
        
        return {"message" : "Product listing successfuly created!"}
    except OperationFailure:
        raise HTTPException(status_code=401, detail=["Something went wrong! Operation Failure"])
    except ValidationError as e:
        errors = [] # list to store raised ValueError's
        
        # add each ValueError to the list
        for error in e.errors():
            errors.append(error['msg'])

        # return a 400 status code and ValueErrors
        raise HTTPException(status_code=400, detail=errors)

@app.get('/products/{name}/{id}')
async def get_product(name:str, id: UUID):
    try:
        # validate the product's path
        product = GetProduct(name=name, id=id)

        collection = db['products']

        result = await collection.find_one({'alias':  name, 'id': str(product.id)})
        
         # product not found, raise operation failure error
        if result is None:
            raise OperationFailure('This product is not available.')
                
        images = []
        
        # for each image retrieved, create a dictionary of bytes and data type
        for image in result['images']:
            images.append({'bytes' : base64.b64encode(image['bytes']).decode("utf-8"), 'type' : image['type']})

        return {'name': result['name'], 'publisher' : result['publisher'], 
            'short_desc': result['short_desc'], 'price': result['price'], 
            'condition': result['condition'], 'condition_desc': result['condition_desc'],
            'seller' : result['seller'],
            'images': images,
        }
    except OperationFailure:
        raise HTTPException(status_code=404, detail="Page not found")
    except ValidationError as e:
        errors = [] # list to store raised ValueErrors
        
        # add each ValueError to the list
        for error in e.errors():
            errors.append(error['msg'])

        # return a 400 status code and ValueErrors
        raise HTTPException(status_code=400, detail=errors)
    
@app.get('/top-products')
async def get_top_products():
    try:
        collection = db['products']

        # retrieve list of top products (returns all products for now)
        results = await collection.find().to_list(length=None)

        # list of top products
        products = []

        # for every product, return name, publisher, condition, price, seller, image, and link
        for result in results:
            products.append({
                'name': result['name'], 'publisher' : result['publisher'], 'price': result['price'],
                'condition': result['condition'], 'condition_desc': result['condition_desc'],
                'seller' : result['seller'],
                'image': {
                    'bytes': base64.b64encode(result['images'][0]['bytes']).decode("utf-8"), 
                    'type' : result['images'][0]['type']
                },
                'link': f"http://127.0.0.1:3000/products/{result['name']}/{result['id']}"
            }) 
        return products
    except OperationFailure:
        raise HTTPException(staus_code=500, detail="500 Internal Server Error")