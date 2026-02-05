# Emergent Backend API

A well-structured FastAPI backend following Python best practices.

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py                 # FastAPI application entry point
│   │
│   ├── api/                    # API routes
│   │   ├── __init__.py
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── router.py       # Main API router
│   │       └── endpoints/      # API endpoints
│   │           ├── __init__.py
│   │           ├── auth.py     # Authentication endpoints
│   │           ├── prompts.py  # Prompt management
│   │           └── status.py   # Status checks
│   │
│   ├── core/                   # Core functionality
│   │   ├── __init__.py
│   │   ├── config.py           # Configuration settings
│   │   ├── constants.py        # Application constants
│   │   └── security.py         # Security utilities (JWT, passwords)
│   │
│   ├── db/                     # Database
│   │   ├── __init__.py
│   │   └── mongodb.py          # MongoDB connection
│   │
│   ├── models/                 # Pydantic models
│   │   ├── __init__.py
│   │   ├── user.py             # User models
│   │   ├── prompt.py           # Prompt models
│   │   └── status.py           # Status models
│   │
│   └── utils/                  # Utility functions
│       ├── __init__.py
│       ├── dependencies.py     # FastAPI dependencies
│       └── helpers.py          # Helper functions
│
├── .env                        # Environment variables
├── requirements.txt            # Python dependencies
├── server.py                   # Legacy server (deprecated)
└── README.md                   # This file
```

## Architecture Overview

### Core Components

#### 1. **app/main.py**
- FastAPI application initialization
- Middleware configuration (CORS)
- Database connection lifecycle
- API router inclusion
- Health check endpoint

#### 2. **app/core/**
- **config.py**: Centralized configuration using Pydantic Settings
- **constants.py**: Application-wide constants (error messages, collection names, etc.)
- **security.py**: Security utilities (password hashing, JWT tokens)

#### 3. **app/api/v1/**
- **router.py**: Combines all endpoint routers
- **endpoints/**: Individual endpoint modules
  - `auth.py`: Registration, login, user info
  - `prompts.py`: CRUD operations for prompts
  - `status.py`: Status check endpoints

#### 4. **app/models/**
- Pydantic models for request/response validation
- Separate models for:
  - Database representation (InDB)
  - API requests (Create, Update)
  - API responses (Response)

#### 5. **app/db/**
- MongoDB connection management
- Database dependency injection

#### 6. **app/utils/**
- **dependencies.py**: Reusable FastAPI dependencies (auth, db)
- **helpers.py**: Utility functions (datetime serialization, etc.)

## Running the Application

### Development Mode

```bash
# From backend directory
python3 -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Production Mode

```bash
python3 -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4
```

## API Documentation

Once the server is running, access:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

## API Endpoints

### Authentication
- `POST /api/register` - Register new user
- `POST /api/login` - Login and get JWT token
- `GET /api/me` - Get current user info (protected)

### Prompts
- `POST /api/prompts` - Create new prompt (protected)
- `GET /api/prompts` - Get user's prompts (protected)
- `GET /api/prompts/{id}` - Get specific prompt (protected)
- `DELETE /api/prompts/{id}` - Delete prompt (protected)

### Status
- `POST /api/status` - Create status check
- `GET /api/status` - Get all status checks

### Health
- `GET /health` - Health check endpoint

## Configuration

Configuration is managed through environment variables in `.env`:

```env
# Security
JWT_SECRET=your-secret-key-change-in-production
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# Database
MONGO_URL=mongodb://admin:password123@localhost:27017/emergent_db?authSource=admin
DB_NAME=emergent_db

# CORS (comma-separated)
CORS_ORIGINS=http://localhost:3000

# Environment
ENVIRONMENT=development
DEBUG=true
```

## Database Collections

### users
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "username": "username",
  "hashed_password": "bcrypt_hash",
  "created_at": "2026-02-05T18:00:00Z",
  "is_active": true
}
```

### prompts
```json
{
  "id": "uuid",
  "user_id": "user_uuid",
  "content": "User's prompt",
  "response": "AI response",
  "created_at": "2026-02-05T18:00:00Z",
  "updated_at": "2026-02-05T18:00:00Z"
}
```

### status_checks
```json
{
  "id": "uuid",
  "client_name": "client_name",
  "timestamp": "2026-02-05T18:00:00Z"
}
```

## Security Features

- **Password Hashing**: bcrypt with salt
- **JWT Authentication**: Secure token-based auth
- **Protected Routes**: Dependency injection for auth
- **CORS**: Configurable cross-origin requests
- **Input Validation**: Pydantic models

## Development Guidelines

### Adding New Endpoints

1. Create model in `app/models/`
2. Create endpoint in `app/api/v1/endpoints/`
3. Add router to `app/api/v1/router.py`
4. Add constants to `app/core/constants.py` if needed

### Adding New Dependencies

1. Add to `requirements.txt`
2. Install: `pip3 install -r requirements.txt`

### Code Style

- Follow PEP 8
- Use type hints
- Document functions with docstrings
- Keep functions small and focused

## Testing

```bash
# Run tests (when implemented)
pytest

# Run with coverage
pytest --cov=app tests/
```

## Deployment

### Docker

```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app/ ./app/
COPY .env .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables

For production, set these environment variables:
- `JWT_SECRET`: Strong random secret
- `MONGO_URL`: Production MongoDB URL
- `CORS_ORIGINS`: Production frontend URLs
- `ENVIRONMENT`: "production"
- `DEBUG`: false

## Monitoring

- Logs are output to stdout/stderr
- Use logging module for application logs
- Monitor `/health` endpoint for uptime

## Troubleshooting

### Import Errors
Make sure you're running from the `backend` directory:
```bash
cd backend
python3 -m uvicorn app.main:app --reload
```

### Database Connection Issues
Check MongoDB is running:
```bash
docker ps | grep emergent_mongodb
```

### CORS Errors
Update `CORS_ORIGINS` in `.env` to include your frontend URL

## Migration from Old Structure

The old `server.py` is deprecated. The new structure provides:
- Better organization and maintainability
- Easier testing and mocking
- Clear separation of concerns
- Scalable architecture
- Industry best practices

To use the new structure:
```bash
# Old way (deprecated)
python3 -m uvicorn server:app --reload

# New way
python3 -m uvicorn app.main:app --reload
```