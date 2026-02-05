"""
Prompt management endpoints
"""
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List

from app.models.prompt import PromptCreate, PromptResponse, PromptInDB
from app.core.constants import COLLECTION_PROMPTS
from app.db.mongodb import get_database
from app.utils.dependencies import get_current_user
from app.utils.helpers import prepare_for_db, prepare_from_db


router = APIRouter()


@router.post("/", response_model=PromptResponse, status_code=status.HTTP_201_CREATED)
async def create_prompt(
    prompt_data: PromptCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Create a new prompt for the authenticated user
    """
    # Create prompt with mock AI response
    prompt = PromptInDB(
        user_id=current_user["id"],
        content=prompt_data.content,
        response="This is a mock response. In a real implementation, this would be processed by an AI model."
    )
    
    # Prepare for database insertion
    prompt_dict = prepare_for_db(prompt.model_dump())
    
    # Insert into database
    await db[COLLECTION_PROMPTS].insert_one(prompt_dict)
    
    return PromptResponse(**prompt.model_dump())


@router.get("/", response_model=List[PromptResponse])
async def get_user_prompts(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
    skip: int = 0,
    limit: int = 100
):
    """
    Get all prompts for the authenticated user
    """
    # Query prompts for current user
    prompts = await db[COLLECTION_PROMPTS].find(
        {"user_id": current_user["id"]}, 
        {"_id": 0}
    ).skip(skip).limit(limit).to_list(limit)
    
    # Prepare prompts from database
    result = []
    for prompt in prompts:
        prompt_data = prepare_from_db(prompt, "created_at", "updated_at")
        result.append(PromptResponse(**prompt_data))
    
    return result


@router.get("/{prompt_id}", response_model=PromptResponse)
async def get_prompt(
    prompt_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Get a specific prompt by ID
    """
    # Find prompt
    prompt = await db[COLLECTION_PROMPTS].find_one(
        {"id": prompt_id, "user_id": current_user["id"]},
        {"_id": 0}
    )
    
    if not prompt:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found"
        )
    
    # Prepare prompt from database
    prompt_data = prepare_from_db(prompt, "created_at", "updated_at")
    
    return PromptResponse(**prompt_data)


@router.delete("/{prompt_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_prompt(
    prompt_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Delete a specific prompt
    """
    # Delete prompt
    result = await db[COLLECTION_PROMPTS].delete_one(
        {"id": prompt_id, "user_id": current_user["id"]}
    )
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Prompt not found"
        )
    
    return None