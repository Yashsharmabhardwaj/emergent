# Backend Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     FastAPI Application                      │
│                        (app/main.py)                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌──────────────┐      ┌──────────────┐     ┌──────────────┐
│   API v1     │      │  Middleware  │     │   Database   │
│   Router     │      │    (CORS)    │     │   MongoDB    │
└──────────────┘      └──────────────┘     └──────────────┘
        │
        │
        ├─────────────┬─────────────┬─────────────┐
        │             │             │             │
        ▼             ▼             ▼             ▼
┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐
│   Auth   │  │ Prompts  │  │  Status  │  │  Health  │
│ Endpoints│  │Endpoints │  │Endpoints │  │  Check   │
└──────────┘  └──────────┘  └──────────┘  └──────────┘
```

## Request Flow

### 1. Authentication Flow

```
User Request
    │
    ▼
┌─────────────────────────────────────────┐
│  POST /api/register or /api/login       │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  app/api/v1/endpoints/auth.py           │
│  - Validate input (Pydantic)            │
│  - Check user exists (register)         │
│  - Verify password (login)              │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  app/core/security.py                   │
│  - Hash password (register)             │
│  - Create JWT token (login)             │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  app/db/mongodb.py                      │
│  - Insert user (register)               │
│  - Query user (login)                   │
└─────────────────────────────────────────┘
    │
    ▼
Response with JWT Token
```

### 2. Protected Endpoint Flow

```
User Request with JWT
    │
    ▼
┌─────────────────────────────────────────┐
│  GET/POST /api/prompts                  │
│  Header: Authorization: Bearer <token>  │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  app/utils/dependencies.py              │
│  - get_current_user()                   │
│  - Extract token from header            │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  app/core/security.py                   │
│  - decode_token()                       │
│  - Verify JWT signature                 │
│  - Check expiration                     │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  app/db/mongodb.py                      │
│  - Query user by ID from token          │
└─────────────────────────────────────────┘
    │
    ▼
┌─────────────────────────────────────────┐
│  app/api/v1/endpoints/prompts.py        │
│  - Execute business logic               │
│  - Access current_user from dependency  │
└─────────────────────────────────────────┘
    │
    ▼
Response with Data
```

## Layer Responsibilities

### 1. Presentation Layer (API Endpoints)
**Location**: `app/api/v1/endpoints/`

**Responsibilities**:
- Handle HTTP requests/responses
- Input validation (via Pydantic)
- Call business logic
- Return appropriate status codes

**Example**:
```python
@router.post("/prompts", response_model=PromptResponse)
async def create_prompt(
    prompt_data: PromptCreate,
    current_user: dict = Depends(get_current_user),
    db: AsyncIOMotorDatabase = Depends(get_database)
):
    # Business logic here
    pass
```

### 2. Business Logic Layer (Core)
**Location**: `app/core/`

**Responsibilities**:
- Security operations (JWT, passwords)
- Configuration management
- Application constants
- Business rules

**Example**:
```python
def create_access_token(data: dict) -> str:
    # JWT creation logic
    pass
```

### 3. Data Access Layer (Database)
**Location**: `app/db/`

**Responsibilities**:
- Database connections
- Query execution
- Data persistence

**Example**:
```python
class MongoDB:
    @classmethod
    async def connect_db(cls):
        # Connection logic
        pass
```

### 4. Data Models Layer
**Location**: `app/models/`

**Responsibilities**:
- Data validation
- Type definitions
- Schema definitions

**Example**:
```python
class UserCreate(BaseModel):
    email: EmailStr
    username: str
    password: str
```

### 5. Utilities Layer
**Location**: `app/utils/`

**Responsibilities**:
- Reusable dependencies
- Helper functions
- Common utilities

**Example**:
```python
async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> dict:
    # Auth dependency logic
    pass
```

## Design Patterns

### 1. Dependency Injection
FastAPI's dependency injection system is used throughout:
- Database connections
- Authentication
- Configuration

### 2. Repository Pattern
Database operations are centralized in `app/db/mongodb.py`

### 3. Service Layer Pattern
Business logic is separated from API endpoints in `app/core/`

### 4. Factory Pattern
Settings and database connections use factory pattern

## Configuration Management

```
Environment Variables (.env)
    │
    ▼
┌─────────────────────────────────────────┐
│  app/core/config.py                     │
│  - Pydantic Settings                    │
│  - Type validation                      │
│  - Default values                       │
└─────────────────────────────────────────┘
    │
    ▼
Used throughout application via:
from app.core.config import settings
```

## Error Handling

```
Exception Occurs
    │
    ▼
┌─────────────────────────────────────────┐
│  FastAPI Exception Handlers             │
│  - HTTPException → HTTP response        │
│  - ValidationError → 422 response       │
│  - Other → 500 response                 │
└─────────────────────────────────────────┘
    │
    ▼
JSON Error Response to Client
```

## Database Schema

```
MongoDB (emergent_db)
│
├── users
│   ├── id (string, UUID)
│   ├── email (string, unique)
│   ├── username (string)
│   ├── hashed_password (string)
│   ├── created_at (datetime)
│   └── is_active (boolean)
│
├── prompts
│   ├── id (string, UUID)
│   ├── user_id (string, foreign key)
│   ├── content (string)
│   ├── response (string, nullable)
│   ├── created_at (datetime)
│   └── updated_at (datetime)
│
└── status_checks
    ├── id (string, UUID)
    ├── client_name (string)
    └── timestamp (datetime)
```

## Security Architecture

### Authentication Flow
1. User provides credentials
2. Backend verifies credentials
3. JWT token generated with user ID
4. Token returned to client
5. Client includes token in subsequent requests
6. Backend verifies token on each request

### Password Security
- Passwords hashed with bcrypt
- Salt automatically generated
- Never stored in plain text
- Never returned in API responses

### Token Security
- JWT with expiration
- Signed with secret key
- Includes user ID in payload
- Verified on each protected request

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- JWT tokens (no session storage)
- MongoDB supports sharding

### Vertical Scaling
- Async/await for I/O operations
- Connection pooling
- Efficient database queries

### Caching Strategy (Future)
- Redis for session data
- Cache frequently accessed data
- Invalidate on updates

## Monitoring & Logging

```
Application Events
    │
    ▼
┌─────────────────────────────────────────┐
│  Python logging module                  │
│  - INFO: Normal operations              │
│  - WARNING: Potential issues            │
│  - ERROR: Errors occurred               │
└─────────────────────────────────────────┘
    │
    ▼
stdout/stderr → Log aggregation system
```

## Testing Strategy

### Unit Tests
- Test individual functions
- Mock dependencies
- Fast execution

### Integration Tests
- Test API endpoints
- Use test database
- Test authentication flow

### End-to-End Tests
- Test complete user flows
- Use real database
- Test frontend integration

## Deployment Architecture

```
┌─────────────────────────────────────────┐
│         Load Balancer (Nginx)           │
└─────────────────────────────────────────┘
                │
        ┌───────┴───────┐
        │               │
        ▼               ▼
┌──────────────┐ ┌──────────────┐
│  FastAPI     │ │  FastAPI     │
│  Instance 1  │ │  Instance 2  │
└──────────────┘ └──────────────┘
        │               │
        └───────┬───────┘
                │
                ▼
┌─────────────────────────────────────────┐
│         MongoDB Cluster                 │
│  - Primary                              │
│  - Secondary (replica)                  │
│  - Secondary (replica)                  │
└─────────────────────────────────────────┘
```

## Best Practices Implemented

1. **Separation of Concerns**: Each module has a single responsibility
2. **DRY Principle**: Reusable utilities and dependencies
3. **Type Safety**: Type hints throughout
4. **Configuration Management**: Centralized settings
5. **Error Handling**: Consistent error responses
6. **Security**: JWT auth, password hashing, input validation
7. **Documentation**: Docstrings and API docs
8. **Async/Await**: Non-blocking I/O operations
9. **Dependency Injection**: Loose coupling
10. **RESTful API**: Standard HTTP methods and status codes