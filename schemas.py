from pydantic import BaseModel
from typing import Optional

class UserCreate(BaseModel):
    username: str
    password: str
    is_admin: bool = False

class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    is_admin: Optional[bool] = None

class SwitchCreate(BaseModel):
    ip_address: str
    hostname: str
    brand: str = "SNR"

class SwitchUpdate(BaseModel):
    ip_address: Optional[str] = None
    hostname: Optional[str] = None
    brand: Optional[str] = None

class CommandCreate(BaseModel):
    name: str
    template: str

class CommandUpdate(BaseModel):
    name: Optional[str] = None
    template: Optional[str] = None

class Token(BaseModel):
    access_token: str
    token_type: str
