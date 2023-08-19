from fastapi import Form, HTTPException, UploadFile, Body
from pydantic import BaseModel, validator, Field
from typing import List, Optional, Dict, Union
from bson.binary import UuidRepresentation
from uuid import UUID, uuid4

class Product(BaseModel):
    name: str = Form(...)
    brand: str = Form(...)
    price: float = Form(...)
    color: Optional[str] = Form(None)
    short_desc: str = Form(...)
    category: List[str] = Form(...)
    condition: str = Form(...)
    condition_desc: str = Form(...)

    @validator('name')
    def name_length(cls, v):
        if len(v) < 3:
            raise ValueError('name must be between 3-50 characters long!')
        elif len(v) > 50:
            raise ValueError('name must be between 3-50 characters long!')
        return v
    
    @validator('brand')
    def brand_length(cls, v):
        if len(v) < 3:
            raise ValueError('brand name must be between 3-25 characters long!')
        elif len(v) > 25:
            raise ValueError('brand name must be between 3-25 characters long!')
        return v
    
    @validator('price')
    def price_within_range(cls, v):
        if v <= 0:
            raise ValueError('price cannot be less than or equal to $0.00!')
        elif v > 10000:
            raise ValueError('price cannot be more than $10,000.00!')
        return v

# Product Models

# Public search 
class GetProduct(BaseModel):
    name: str
    id: UUID

    @validator('name')
    def name_length(cls, v):
        if len(v) > 30 or len(v) <= 0:
            raise ValueError('invalid path')
        return v
