"""
User models and schemas
"""
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from datetime import datetime, timezone
import uuid


class UserBase(BaseModel):
    """Base user schema"""
    email: EmailStr
    username: str


class UserCreate(UserBase):
    """Schema for creating a user"""
    password: str


class UserLogin(BaseModel):
    """Schema for user login"""
    email: EmailStr
    password: str


class UserInDB(UserBase):
    """User schema as stored in database"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    hashed_password: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True


class UserResponse(UserBase):
    """Schema for user response (without password)"""
    id: str
    created_at: datetime
    is_active: bool


class Token(BaseModel):
    """Token response schema"""
    access_token: str
    token_type: str