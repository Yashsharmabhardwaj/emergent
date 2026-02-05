"""
Common dependencies for API routes
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials
from motor.motor_asyncio import AsyncIOMotorDatabase

from app.core.security import security, decode_token
from app.core.constants import ERROR_INVALID_TOKEN, COLLECTION_USERS
from app.db.mongodb import get_database


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: AsyncIOMotorDatabase = Depends(get_database)
) -> dict:
    """
    Dependency to get current authenticated user
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail=ERROR_INVALID_TOKEN,
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    # Decode token
    payload = decode_token(credentials.credentials)
    user_id: str = payload.get("sub")
    
    if user_id is None:
        raise credentials_exception
    
    # Get user from database
    user = await db[COLLECTION_USERS].find_one({"id": user_id}, {"_id": 0})
    
    if user is None:
        raise credentials_exception
    
    return user