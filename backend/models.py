from fastapi import Form, HTTPException, UploadFile
from pydantic import BaseModel
from typing import List, Optional

class Product(BaseModel):
    name: str
    brand: str
    price: float
    color: Optional[str]
    short_desc: str
    images: List[UploadFile]
    condition: str
    condition_desc: str
    description: str
    