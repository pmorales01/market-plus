from fastapi import Form, HTTPException, UploadFile
from pydantic import BaseModel, validator
from typing import List, Optional

class Product(BaseModel):
    name: str = Form(...)
    brand: str = Form(...)
    price: float = Form(...)
    color: Optional[str] = Form(None)
    short_desc: str = Form(...)
    category: List[str] = Form(...)
    condition: str = Form(...)
    condition_desc: str = Form(...)
    description: List[str] = Form(...)

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