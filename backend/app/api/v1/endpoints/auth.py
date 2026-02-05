"""
Authentication endpoints
"""
from fastapi import APIRouter, HTTPException, status, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import timedelta

from app.models.user import UserCreate, UserLogin, UserResponse, Token, UserInDB
from app.core.security import verify_password, get_password_hash, create_access_token
from app.core.config import settings
from app.core.constants import (
    ERROR_USER_EXISTS, 
    ERROR_INVALID_CREDENTIALS,
    COLLECTION_USERS,
    TOKEN_TYPE
)
from app.db.mongodb import get_database
from app.utils.helpers import prepare_for_db
from app.utils.dependencies import get_current_user


router = APIRouter()


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_data: UserCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Register a new user
    """
    # Check if user already exists
    existing_user = await db[COLLECTION_USERS].find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=ERROR_USER_EXISTS
        )
    
    # Create new user
    hashed_password = get_password_hash(user_data.password)
    user = UserInDB(
        email=user_data.email,
        username=user_data.username,
        hashed_password=hashed_password
    )
    
    # Prepare for database insertion
    user_dict = prepare_for_db(user.model_dump())
    
    # Insert into database
    await db[COLLECTION_USERS].insert_one(user_dict)
    
    # Return user response (without password)
    return UserResponse(**user.model_dump())


@router.post("/login", response_model=Token)
async def login(
    user_credentials: UserLogin,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Login user and return JWT token
    """
    # Find user by email
    user = await db[COLLECTION_USERS].find_one(
        {"email": user_credentials.email}, 
        {"_id": 0}
    )
    
    # Verify user exists and password is correct
    if not user or not verify_password(user_credentials.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=ERROR_INVALID_CREDENTIALS,
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["id"]}, 
        expires_delta=access_token_expires
    )
    
    return {"access_token": access_token, "token_type": TOKEN_TYPE}


@router.get("/me", response_model=UserResponse)
async def get_current_user_info(
    current_user: dict = Depends(get_current_user)
):
    """
    Get current authenticated user information
    """
    # Convert ISO string timestamp back to datetime object if needed
    from app.utils.helpers import prepare_from_db
    user_data = prepare_from_db(current_user, "created_at")
    
    return UserResponse(**user_data)