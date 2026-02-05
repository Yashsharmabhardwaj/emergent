"""
Status check endpoints
"""
from fastapi import APIRouter, Depends
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List

from app.models.status import StatusCheckCreate, StatusCheckResponse, StatusCheckInDB
from app.core.constants import COLLECTION_STATUS_CHECKS
from app.db.mongodb import get_database
from app.utils.helpers import prepare_for_db, prepare_from_db


router = APIRouter()


@router.post("/", response_model=StatusCheckResponse)
async def create_status_check(
    status_data: StatusCheckCreate,
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Create a new status check
    """
    # Create status check
    status_check = StatusCheckInDB(**status_data.model_dump())
    
    # Prepare for database insertion
    status_dict = prepare_for_db(status_check.model_dump())
    
    # Insert into database
    await db[COLLECTION_STATUS_CHECKS].insert_one(status_dict)
    
    return StatusCheckResponse(**status_check.model_dump())


@router.get("/", response_model=List[StatusCheckResponse])
async def get_status_checks(
    db: AsyncIOMotorDatabase = Depends(get_database),
    skip: int = 0,
    limit: int = 1000
):
    """
    Get all status checks
    """
    # Query all status checks
    status_checks = await db[COLLECTION_STATUS_CHECKS].find(
        {}, 
        {"_id": 0}
    ).skip(skip).limit(limit).to_list(limit)
    
    # Prepare status checks from database
    result = []
    for check in status_checks:
        check_data = prepare_from_db(check, "timestamp")
        result.append(StatusCheckResponse(**check_data))
    
    return result