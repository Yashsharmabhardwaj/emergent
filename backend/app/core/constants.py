"""
Application constants
"""

# HTTP Status Messages
HTTP_200_OK = "Success"
HTTP_201_CREATED = "Created successfully"
HTTP_400_BAD_REQUEST = "Bad request"
HTTP_401_UNAUTHORIZED = "Unauthorized"
HTTP_403_FORBIDDEN = "Forbidden"
HTTP_404_NOT_FOUND = "Not found"
HTTP_500_INTERNAL_SERVER_ERROR = "Internal server error"

# User Constants
MIN_PASSWORD_LENGTH = 8
MAX_PASSWORD_LENGTH = 72  # bcrypt limit
MIN_USERNAME_LENGTH = 3
MAX_USERNAME_LENGTH = 50

# Token Constants
TOKEN_TYPE = "bearer"

# Database Collections
COLLECTION_USERS = "users"
COLLECTION_PROMPTS = "prompts"
COLLECTION_STATUS_CHECKS = "status_checks"

# Pagination
DEFAULT_PAGE_SIZE = 20
MAX_PAGE_SIZE = 100

# Error Messages
ERROR_USER_EXISTS = "Email already registered"
ERROR_INVALID_CREDENTIALS = "Incorrect email or password"
ERROR_USER_NOT_FOUND = "User not found"
ERROR_INVALID_TOKEN = "Could not validate credentials"
ERROR_PROMPT_NOT_FOUND = "Prompt not found"

# Success Messages
SUCCESS_USER_CREATED = "User created successfully"
SUCCESS_LOGIN = "Login successful"
SUCCESS_PROMPT_CREATED = "Prompt created successfully"