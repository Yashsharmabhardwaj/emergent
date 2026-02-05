"""
Status check models and schemas
"""
from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime, timezone
import uuid


class StatusCheckBase(BaseModel):
    """Base status check schema"""
    client_name: str


class StatusCheckCreate(StatusCheckBase):
    """Schema for creating a status check"""
    pass


class StatusCheckInDB(StatusCheckBase):
    """Status check schema as stored in database"""
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))


class StatusCheckResponse(StatusCheckBase):
    """Schema for status check response"""
    id: str
    timestamp: datetime