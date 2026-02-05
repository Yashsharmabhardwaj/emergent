"""
API v1 router - combines all endpoint routers
"""
from fastapi import APIRouter

from app.api.v1.endpoints import auth, prompts, status


# Create main API router
api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(
    auth.router,
    tags=["Authentication"]
)

api_router.include_router(
    prompts.router,
    prefix="/prompts",
    tags=["Prompts"]
)

api_router.include_router(
    status.router,
    prefix="/status",
    tags=["Status"]
)


# Root endpoint
@api_router.get("/", tags=["Root"])
async def root():
    """API root endpoint"""
    return {"message": "Emergent API", "version": "1.0.0"}