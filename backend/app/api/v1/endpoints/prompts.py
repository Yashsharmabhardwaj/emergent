"""
Prompt management endpoints
"""
import uuid
from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from typing import List

from app.models.prompt import PromptCreate, PromptResponse, PromptInDB
from app.core.constants import COLLECTION_PROMPTS
from app.db.mongodb import get_database
from app.utils.dependencies import get_current_user
from app.utils.helpers import prepare_for_db, prepare_from_db
from app.services.pm_agent import generate_pm_agent_response


router = APIRouter()


async def _get_conversation_history(
    db: AsyncIOMotorDatabase,
    user_id: str,
    conversation_id: str,
) -> List[tuple]:
    """Fetch previous prompts in a conversation as (user_msg, agent_response) tuples."""
    cursor = db[COLLECTION_PROMPTS].find(
        {"user_id": user_id, "conversation_id": conversation_id},
        {"content": 1, "response": 1},
        sort=[("created_at", 1)],
    )
    history = []
    async for doc in cursor:
        content = doc.get("content") or ""
        response = doc.get("response") or ""
        history.append((content, response))
    return history


@router.post("", response_model=PromptResponse, status_code=status.HTTP_201_CREATED)
@router.post("/", response_model=PromptResponse, status_code=status.HTTP_201_CREATED)
async def create_prompt(
    prompt_data: PromptCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Create a new prompt for the authenticated user.
    Pass conversation_id to continue an existing conversation (multi-turn).
    """
    conversation_id = prompt_data.conversation_id or str(uuid.uuid4())

    # Build conversation history for multi-turn
    history = []
    if prompt_data.conversation_id:
        history = await _get_conversation_history(
            db, current_user["id"], prompt_data.conversation_id
        )

    try:
        response_text, phase = await generate_pm_agent_response(
            prompt_data.content,
            conversation_history=history if history else None,
        )
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Product Manager Agent is unavailable. Start Ollama and try again."
        ) from exc

    prompt = PromptInDB(
        user_id=current_user["id"],
        content=prompt_data.content,
        conversation_id=conversation_id,
        phase=phase,
        response=response_text,
    )

    prompt_dict = prepare_for_db(prompt.model_dump())
    await db[COLLECTION_PROMPTS].insert_one(prompt_dict)

    return PromptResponse(**prompt.model_dump())


@router.get("", response_model=List[PromptResponse])
@router.get("/", response_model=List[PromptResponse])
async def get_user_prompts(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
    conversation_id: str | None = None,
    skip: int = 0,
    limit: int = 100
):
    """
    Get prompts for the authenticated user.
    Pass conversation_id to get only prompts in that conversation (thread).
    """
    query = {"user_id": current_user["id"]}
    if conversation_id:
        query["conversation_id"] = conversation_id
    sort_dir = 1 if conversation_id else -1  # Thread: oldest first; All: newest first
    prompts = await db[COLLECTION_PROMPTS].find(
        query,
        {"_id": 0}
    ).sort("created_at", sort_dir).skip(skip).limit(limit).to_list(limit)
    
    # Prepare prompts from database
    result = []
    for prompt in prompts:
        prompt_data = prepare_from_db(prompt, "created_at", "updated_at")
        result.append(PromptResponse(**prompt_data))
    
    return result


@router.get("/conversations")
async def list_conversations(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database),
    limit: int = 50,
):
    """
    List user's conversations (grouped by conversation_id).
    Returns [{ id, preview, updated_at, message_count }].
    """
    pipeline = [
        {"$match": {"user_id": current_user["id"], "conversation_id": {"$exists": True, "$ne": None}}},
        {"$sort": {"updated_at": -1}},
        {
            "$group": {
                "_id": "$conversation_id",
                "preview": {"$first": "$content"},
                "updated_at": {"$max": "$updated_at"},
                "message_count": {"$sum": 1},
            }
        },
        {"$sort": {"updated_at": -1}},
        {"$limit": limit},
    ]
    cursor = db[COLLECTION_PROMPTS].aggregate(pipeline)
    conversations = []
    async for doc in cursor:
        conversations.append({
            "id": doc["_id"],
            "preview": (doc.get("preview") or "")[:80] + ("..." if len(doc.get("preview") or "") > 80 else ""),
            "updated_at": doc.get("updated_at"),
            "message_count": doc.get("message_count", 0),
        })
    return conversations


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