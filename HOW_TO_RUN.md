# How to Run Backend and Frontend

This guide explains how to run both the backend API and frontend application.

## Prerequisites

- **Node.js** >= 20.0.0
- **npm** >= 10.0.0
- **Docker** and **Docker Compose** (for PostgreSQL database)

## Quick Start (Both Applications)

### Step 1: Start PostgreSQL Database

Open a terminal in the project root directory:

```bash
docker-compose up -d
```

This starts PostgreSQL in the background.

### Step 2: Configure Backend Environment

1. Create `.env` file in the root directory (if not exists):
```bash
copy env.example .env
```

2. Make sure your `.env` file contains:
```env
# App
PORT=3000
NODE_ENV=dev

# Database
POSTGRES_HOST=localhost
POSTGRES_USER=admin
POSTGRES_PASSWORD=root
POSTGRES_DB=reader-backend
POSTGRES_PORT=5432

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_REFRESH_SECRET=your-super-secret-refresh-key-change-this-in-production
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

### Step 3: Install Backend Dependencies

In the project root directory:

```bash
npm install
```

### Step 4: Start Backend Server

In the project root directory:

```bash
npm run start:dev
```

Backend will be available at: **http://localhost:3000**

You can verify it's running by visiting:
- Health check: http://localhost:3000
- Swagger API docs: http://localhost:3000/api

### Step 5: Configure Frontend Environment

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Create `.env` file:
```env
VITE_API_URL=http://localhost:3000
```

### Step 6: Install Frontend Dependencies

In the `frontend` directory:

```bash
npm install
```

### Step 7: Start Frontend Development Server

In the `frontend` directory:

```bash
npm run dev
```

Frontend will be available at: **http://localhost:5173**

## Running in Separate Terminals

You need **two terminal windows** to run both applications simultaneously:

### Terminal 1 - Backend

```bash
# In project root
cd C:\Users\Gusta\Desktop\Saitinų_Laboras\tinklai

# Start database (if not running)
docker-compose up -d

# Start backend
npm run start:dev
```

Backend runs on: **http://localhost:3000**

### Terminal 2 - Frontend

```bash
# Navigate to frontend
cd C:\Users\Gusta\Desktop\Saitinų_Laboras\tinklai\frontend

# Start frontend
npm run dev
```

Frontend runs on: **http://localhost:5173**

## Verification

### Backend is Running:
- ✅ Visit: http://localhost:3000
- ✅ Should see: `{"message":"Reader Backend API is running",...}`
- ✅ Swagger docs: http://localhost:3000/api

### Frontend is Running:
- ✅ Visit: http://localhost:5173
- ✅ Should see: Login/Register page
- ✅ Can navigate to different pages

## Troubleshooting

### Backend Issues

**Port 3000 already in use:**
```bash
# Change PORT in .env file to another port (e.g., 3001)
PORT=3001
```

**Database connection error:**
```bash
# Make sure Docker is running
docker ps

# Restart database
docker-compose down
docker-compose up -d
```

**JWT secrets missing:**
- Make sure `.env` file has `JWT_SECRET` and `JWT_REFRESH_SECRET`

### Frontend Issues

**Port 5173 already in use:**
- Vite will automatically use the next available port (5174, 5175, etc.)

**Cannot connect to API / Registration failed:**
- Make sure backend is running on http://localhost:3000
- Check `VITE_API_URL` in `frontend/.env` file (should be `http://localhost:3000`)
- CORS is enabled in backend (configured in `src/main.ts`)
- **Important:** After creating `frontend/.env`, restart the frontend dev server
- Check browser console (F12) for detailed error messages
- Verify backend logs for any errors

**Module not found errors:**
```bash
# Reinstall dependencies
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## Production Build

### Build Backend:
```bash
npm run build
npm run start:prod
```

### Build Frontend:
```bash
cd frontend
npm run build
npm run preview
```

## Using Railway (Cloud Deployment)

If you want to use the cloud-deployed backend instead of local:

1. Update `frontend/.env`:
```env
VITE_API_URL=https://tinklai-production.up.railway.app
```

2. You only need to run frontend locally:
```bash
cd frontend
npm run dev
```

Backend will be accessed from Railway cloud.

## Summary

| Application | Port | URL | Command |
|------------|------|-----|---------|
| Backend API | 3000 | http://localhost:3000 | `npm run start:dev` |
| Frontend | 5173 | http://localhost:5173 | `cd frontend && npm run dev` |
| Database | 5432 | localhost:5432 | `docker-compose up -d` |

**Remember:** You need both backend and frontend running to use the full application!

