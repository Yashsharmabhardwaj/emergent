# Emergent Application Setup Guide

## Overview
This is a full-stack application with:
- **Frontend**: React with Tailwind CSS and shadcn/ui components
- **Backend**: FastAPI with JWT authentication
- **Database**: In-memory mock database (can be replaced with MongoDB using Docker)

## Current Status
✅ Frontend running on http://localhost:3000
✅ Backend running on http://localhost:8000
✅ MongoDB running in Docker container
✅ Authentication system implemented
✅ Dashboard with prompt submission
✅ Data persisted in MongoDB

## Features
1. **User Authentication**
   - Register new users
   - Login with email/password
   - JWT-based authentication
   - Protected routes

2. **Dashboard**
   - Submit prompts
   - View prompt history
   - User account information
   - Mock AI responses

## How to Use

### 1. Access the Application
- Open your browser and go to: http://localhost:3000

### 2. Register a New Account
- Click "Get Started" or "Sign up"
- Fill in:
  - Email address
  - Username
  - Password
  - Confirm password
- Click "Create account"

### 3. Login
- If you already have an account, click "Sign in"
- Enter your email and password
- Click "Sign in"

### 4. Use the Dashboard
- After login, you'll be redirected to the dashboard
- **Create a Prompt**:
  - Enter your prompt in the text area
  - Click "Submit Prompt"
  - View the AI-generated response (currently mock data)
- **View History**: Scroll down to see all your previous prompts
- **Account Info**: View your user details and statistics

## Running the Application

### Frontend
```bash
cd frontend
npm start
```
The frontend will run on http://localhost:3000

### Backend
```bash
cd backend
python3 -m uvicorn server:app --reload --host 0.0.0.0 --port 8000
```
The backend will run on http://localhost:8000

## API Endpoints

### Public Endpoints
- `GET /api/` - API status
- `POST /api/register` - Register new user
- `POST /api/login` - Login user

### Protected Endpoints (require authentication)
- `GET /api/me` - Get current user info
- `POST /api/prompts` - Create new prompt
- `GET /api/prompts` - Get user's prompts

## Docker Setup

MongoDB is already running in Docker! The container is named `emergent_mongodb`.

### MongoDB Container Details
- **Container Name**: emergent_mongodb
- **Port**: 27017 (mapped to host)
- **Username**: admin
- **Password**: password123
- **Database**: emergent_db

### Managing MongoDB Container

**Check if MongoDB is running:**
```bash
docker ps | grep emergent_mongodb
```

**Stop MongoDB:**
```bash
docker stop emergent_mongodb
```

**Start MongoDB:**
```bash
docker start emergent_mongodb
```

**View MongoDB logs:**
```bash
docker logs emergent_mongodb
```

**Remove MongoDB container (if needed):**
```bash
docker stop emergent_mongodb
docker rm emergent_mongodb
```

**Recreate MongoDB container:**
```bash
docker run -d --name emergent_mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  mongo:latest
```

## Environment Variables

### Frontend (.env)
```
REACT_APP_BACKEND_URL=http://localhost:8000
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
```

### Backend (.env)
```
MONGO_URL="mongodb://admin:password123@localhost:27017/emergent_db?authSource=admin"
DB_NAME="emergent_db"
CORS_ORIGINS="http://localhost:3000"
JWT_SECRET="your-secret-key-change-in-production"
```

## Next Steps

1. **Integrate Real AI**: Replace mock responses with actual AI model integration
2. **Add MongoDB**: Set up Docker and connect to real database
3. **Enhanced Features**:
   - Prompt templates
   - Export/import prompts
   - Sharing functionality
   - Advanced user settings
4. **Production Deployment**:
   - Set up proper environment variables
   - Configure production database
   - Add SSL certificates
   - Set up CI/CD pipeline

## Troubleshooting

### Frontend won't start
- Delete `node_modules` and `package-lock.json`
- Run `npm install --legacy-peer-deps`
- Run `npm start`

### Backend errors
- Make sure all Python packages are installed:
  ```bash
  pip3 install fastapi uvicorn python-dotenv pydantic 'python-jose[cryptography]' 'passlib[bcrypt]' python-multipart email-validator PyJWT
  ```

### CORS errors
- Check that backend CORS is configured for `http://localhost:3000`
- Check that frontend `.env` has correct `REACT_APP_BACKEND_URL`

### Authentication issues
- Clear browser localStorage
- Check JWT_SECRET is set in backend `.env`
- Verify token is being sent in Authorization header

## Tech Stack

### Frontend
- React 19
- React Router DOM
- Axios
- Tailwind CSS
- shadcn/ui components
- Lucide React icons

### Backend
- FastAPI
- Pydantic
- JWT (PyJWT)
- Passlib (bcrypt)
- Python-JOSE
- Uvicorn

## Security Notes

⚠️ **Important**: This is a development setup. For production:
- Change JWT_SECRET to a strong, random value
- Use HTTPS
- Set up proper CORS origins
- Use a real database with proper authentication
- Implement rate limiting
- Add input validation and sanitization
- Set up proper logging and monitoring