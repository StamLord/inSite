from pydantic import BaseModel, EmailStr
from typing import Optional, List, Dict, Any


class UserCreateRequest(BaseModel):
    email: EmailStr
    password: str


class UserRegisterResponse(BaseModel):
    message: str


class UserLoginRequest(BaseModel):
    email: EmailStr
    password: str


class UserLoginResponse(BaseModel):
    access_token: str
    token_type: str


class GetUserResponse(BaseModel):
    user_id: str

