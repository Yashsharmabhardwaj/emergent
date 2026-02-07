"""
Prompt models and schemas
"""
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone
from typing import Optional
import uuid


class PromptBase(BaseModel):
    """Base prompt schema"""
    content: str


class PromptCreate(PromptBase):
    """Schema for creating a prompt"""
    conversation_id: Optional[str] = None  # If provided, continues existing conversation


class PromptInDB(PromptBase):
    """Prompt schema as stored in database"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    conversation_id: Optional[str] = None
    phase: Optional[str] = None  # "discovery" | "plan"
    response: Optional[str] = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class PromptResponse(BaseModel):
    """Schema for prompt response"""
    id: str
    content: str
    conversation_id: Optional[str] = None
    phase: Optional[str] = None
    response: Optional[str]
    created_at: datetime
    updated_at: datetime


class PromptUpdate(BaseModel):
    """Schema for updating a prompt"""
    content: Optional[str] = None
    response: Optional[str] = None