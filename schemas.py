from pydantic import BaseModel, Field
from typing import Optional, Dict

class UserCreate(BaseModel):
    id: Optional[int] = None
    username: str
    password: Optional[str] = None
    is_admin: bool = False

class UserUpdate(BaseModel):
    username: Optional[str] = None
    password: Optional[str] = None
    is_admin: Optional[bool] = None

class SwitchCreate(BaseModel):
    id: Optional[int] = None
    ip_address: str
    hostname: Optional[str] = None
    brand: str = "cisco_ios"

class SwitchUpdate(BaseModel):
    ip_address: Optional[str] = None
    hostname: Optional[str] = None
    brand: Optional[str] = None

class CommandCreate(BaseModel):
    id: Optional[int] = None
    name: str = Field(..., description="Название команды")
    template: str = Field(..., description="Шаблон команды")
    variables: Optional[Dict[str, str]] = None

class CommandUpdate(BaseModel):
    name: Optional[str] = None
    template: Optional[str] = None
    variables: Optional[Dict[str, str]] = None

class Token(BaseModel):
    access_token: str
    token_type: str
