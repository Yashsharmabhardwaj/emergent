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
    
    # Simple default title generation for new conversation
    title = None
    if not prompt_data.conversation_id:
        # Use first 50 chars of content
        title = prompt_data.content[:50] + ("..." if len(prompt_data.content) > 50 else "")

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
        title=title,
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
    Returns [{ id, title, preview, updated_at, message_count, is_pinned, is_archived }].
    """
    pipeline = [
        {"$match": {"user_id": current_user["id"], "conversation_id": {"$exists": True, "$ne": None}}},
        {"$sort": {"created_at": 1}}, # Sort by creation to identify the 'first' message correctly if needed
        {
            "$group": {
                "_id": "$conversation_id",
                "title": {"$first": "$title"}, 
                "preview": {"$last": "$content"}, # Preview last message? Or first? usually last is better for "recent"
                "updated_at": {"$max": "$updated_at"},
                "message_count": {"$sum": 1},
                "is_pinned": {"$first": "$is_pinned"},
                "is_archived": {"$first": "$is_archived"},
            }
        },
        {"$sort": {"updated_at": -1}},
        {"$limit": limit},
    ]
    cursor = db[COLLECTION_PROMPTS].aggregate(pipeline)
    conversations = []
    async for doc in cursor:
        # Fallback to preview/content if title is missing
        title = doc.get("title")
        preview = (doc.get("preview") or "")[:80] + ("..." if len(doc.get("preview") or "") > 80 else "")
        if not title:
            title = preview

        conversations.append({
            "id": doc["_id"],
            "title": title,
            "preview": preview,
            "updated_at": doc.get("updated_at"),
            "message_count": doc.get("message_count", 0),
            "is_pinned": doc.get("is_pinned", False),
            "is_archived": doc.get("is_archived", False),
        })
    return conversations


@router.patch("/conversations/{conversation_id}")
async def update_conversation_title(
    conversation_id: str,
    update_data: dict,  # Expect {"title": "New Title"} and/or {"is_pinned": true} and/or {"is_archived": false}
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Update a conversation's title, pin status, or archive status.
    Because we store these fields on Prompt documents, this updates all prompts in the conversation 
    to ensure consistency for the aggregation pipeline.
    """
    # Build update dict from provided fields
    update_fields = {}
    
    if "title" in update_data:
        new_title = update_data.get("title")
        if not new_title:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Title cannot be empty"
            )
        update_fields["title"] = new_title
    
    if "is_pinned" in update_data:
        update_fields["is_pinned"] = bool(update_data.get("is_pinned"))
    
    if "is_archived" in update_data:
        update_fields["is_archived"] = bool(update_data.get("is_archived"))
    
    if not update_fields:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No valid fields to update"
        )
    
    # Update all prompts in this conversation for this user
    result = await db[COLLECTION_PROMPTS].update_many(
        {"conversation_id": conversation_id, "user_id": current_user["id"]},
        {"$set": update_fields}
    )
    
    if result.matched_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found"
        )
        
    return {"message": "Conversation updated successfully", "updated_count": result.modified_count}


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



@router.delete("/conversations", status_code=status.HTTP_204_NO_CONTENT)
async def delete_conversations(
    conversation_ids: List[str],  # Expect list of IDs in body
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Bulk delete conversations.
    Deletes all prompts associated with the given conversation IDs.
    """
    if not conversation_ids:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No conversation IDs provided"
        )

    result = await db[COLLECTION_PROMPTS].delete_many(
        {
            "conversation_id": {"$in": conversation_ids},
            "user_id": current_user["id"]
        }
    )
    
    # We return 204 No Content so no body is expected, but if we wanted to return count
    # we would use 200 OK. Standard for DELETE bulk is often 204 or 200 with count.
    # Let's keep 204 for simplicity as planned, or 200 if we want to confirm count.
    # The plan implicits standard delete. 
    # If using 204, we can't return data.
    return None


@router.delete("/conversations/{conversation_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_conversation(
    conversation_id: str,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    """
    Delete a specific conversation (all its prompts).
    """
    result = await db[COLLECTION_PROMPTS].delete_many(
        {"conversation_id": conversation_id, "user_id": current_user["id"]}
    )
    
    if result.deleted_count == 0:
        # Check if conversation exists to differentiate 404 vs just empty
        # But for delete, idempotency is good. If it's gone, it's gone.
        # However, usually we return 404 if it didn't exist.
        # Let's return 404 if we want to be strict, or 204 if we want to be idempotent.
        # Existing delete_prompt returns 404.
        pass
        
    return None


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