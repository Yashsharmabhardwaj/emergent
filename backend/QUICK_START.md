# Quick Start Guide

## Running the Server

```bash
cd backend
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Project Structure at a Glance

```
app/
├── main.py              # 🚀 Start here - FastAPI app
├── api/v1/
│   ├── router.py        # 🔀 Main router
│   └── endpoints/       # 📍 API endpoints
│       ├── auth.py      # 🔐 Login/Register
│       ├── prompts.py   # 💬 Prompts CRUD
│       └── status.py    # ✅ Status checks
├── core/
│   ├── config.py        # ⚙️  Settings
│   ├── constants.py     # 📋 Constants
│   └── security.py      # 🔒 JWT & passwords
├── db/
│   └── mongodb.py       # 🗄️  Database
├── models/              # 📦 Pydantic models
└── utils/               # 🛠️  Helpers
```

## Common Tasks

### Add a New Endpoint

1. **Create model** in `app/models/your_model.py`:
```python
from pydantic import BaseModel

class YourModel(BaseModel):
    name: str
    value: int
```

2. **Create endpoint** in `app/api/v1/endpoints/your_endpoint.py`:
```python
from fastapi import APIRouter, Depends
from app.models.your_model import YourModel

router = APIRouter()

@router.post("/")
async def create_item(item: YourModel):
    return {"message": "Created", "item": item}
```

3. **Add to router** in `app/api/v1/router.py`:
```python
from app.api.v1.endpoints import your_endpoint

api_router.include_router(
    your_endpoint.router,
    prefix="/your-endpoint",
    tags=["Your Endpoint"]
)
```

### Add a Protected Endpoint

```python
from fastapi import Depends
from app.utils.dependencies import get_current_user

@router.get("/protected")
async def protected_route(current_user: dict = Depends(get_current_user)):
    return {"user": current_user["username"]}
```

### Add a New Constant

In `app/core/constants.py`:
```python
ERROR_ITEM_NOT_FOUND = "Item not found"
COLLECTION_ITEMS = "items"
```

### Add a New Setting

In `app/core/config.py`:
```python
class Settings(BaseSettings):
    # ... existing settings ...
    NEW_SETTING: str = "default_value"
```

Then use it:
```python
from app.core.config import settings
print(settings.NEW_SETTING)
```

## Testing Endpoints

### Using curl

**Register:**
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","username":"testuser","password":"pass123"}'
```

**Login:**
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"pass123"}'
```

**Get User Info (with token):**
```bash
TOKEN="your_jwt_token_here"
curl http://localhost:8000/api/me \
  -H "Authorization: Bearer $TOKEN"
```

**Create Prompt:**
```bash
curl -X POST http://localhost:8000/api/prompts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"What is AI?"}'
```

### Using Swagger UI

Go to: http://localhost:8000/docs

1. Click "Authorize" button
2. Enter: `Bearer your_token_here`
3. Try out endpoints interactively

## Database Operations

### Access MongoDB

```bash
docker exec -it emergent_mongodb mongosh \
  -u admin -p password123 --authenticationDatabase admin
```

### View Collections

```javascript
use emergent_db
show collections
db.users.find().pretty()
db.prompts.find().pretty()
```

### Clear Collection

```javascript
db.prompts.deleteMany({})
```

## Environment Variables

Create/edit `.env` file:

```env
# Required
MONGO_URL=mongodb://admin:password123@localhost:27017/emergent_db?authSource=admin
DB_NAME=emergent_db
JWT_SECRET=your-super-secret-key-change-this

# Optional
CORS_ORIGINS=http://localhost:3000,http://localhost:3001
ACCESS_TOKEN_EXPIRE_MINUTES=30
ENVIRONMENT=development
DEBUG=true
```

## Troubleshooting

### Import Error: "No module named 'app'"

Make sure you're in the `backend` directory and using:
```bash
python3 -m uvicorn app.main:app --reload
```

### Database Connection Error

Check MongoDB is running:
```bash
docker ps | grep emergent_mongodb
```

Start if not running:
```bash
docker start emergent_mongodb
```

### CORS Error

Add your frontend URL to `.env`:
```env
CORS_ORIGINS=http://localhost:3000
```

### Token Expired

Tokens expire after 30 minutes. Login again to get a new token.

## File Naming Conventions

- **Files**: `snake_case.py`
- **Classes**: `PascalCase`
- **Functions**: `snake_case`
- **Constants**: `UPPER_SNAKE_CASE`
- **Private**: `_leading_underscore`

## Code Examples

### Create a Database Query

```python
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.db.mongodb import get_database
from fastapi import Depends

@router.get("/items")
async def get_items(db: AsyncIOMotorDatabase = Depends(get_database)):
    items = await db.items.find({}).to_list(100)
    return items
```

### Add Authentication

```python
from app.utils.dependencies import get_current_user

@router.get("/my-items")
async def get_my_items(
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    items = await db.items.find({"user_id": current_user["id"]}).to_list(100)
    return items
```

### Hash a Password

```python
from app.core.security import get_password_hash, verify_password

# Hash
hashed = get_password_hash("mypassword")

# Verify
is_valid = verify_password("mypassword", hashed)
```

### Create a JWT Token

```python
from app.core.security import create_access_token
from datetime import timedelta

token = create_access_token(
    data={"sub": user_id},
    expires_delta=timedelta(minutes=30)
)
```

## Useful Commands

```bash
# Install dependencies
pip3 install -r requirements.txt

# Run server
python3 -m uvicorn app.main:app --reload

# Run with specific host/port
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8080

# Run in production mode (no reload)
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4

# Check Python version
python3 --version

# List installed packages
pip3 list

# Format code (if black is installed)
black app/

# Sort imports (if isort is installed)
isort app/
```

## Next Steps

1. Read [README.md](README.md) for detailed documentation
2. Read [ARCHITECTURE.md](ARCHITECTURE.md) for system design
3. Check [API Documentation](http://localhost:8000/docs) when server is running
4. Explore the code starting from `app/main.py`