# Railway Frontend Deployment Guide

## Prerequisites

1. Railway account
2. GitHub repository connected to Railway
3. Backend API already deployed (or Railway URL)

## Step 1: Create New Service in Railway

1. Go to Railway dashboard
2. Click "New Project" or select existing project
3. Click "New Service"
4. Select "GitHub Repo"
5. Choose your repository
6. Railway will create the service (you can't set root directory here yet)

## Step 1.5: Configure Root Directory

**After the service is created:**

1. Click on your new service
2. Go to **Settings** tab (gear icon)
3. Scroll down to **Build & Deploy** section
4. Find **Root Directory** field
5. Enter: `frontend`
6. Click **Save**

## Step 2: Configure Environment Variables

In Railway dashboard, add these environment variables:

```
VITE_API_URL=https://your-backend-url.up.railway.app
PORT=5173
NODE_ENV=production
```

**Note**: Replace `https://your-backend-url.up.railway.app` with your actual backend Railway URL.

## Step 3: Configure Build Settings

**Option A: Using Root Directory (Recommended)**

1. In **Settings** > **Build & Deploy**:
   - **Root Directory**: `frontend`
   - Railway will auto-detect build commands from `frontend/package.json`

**Option B: Using Build Commands (Alternative)**

If Root Directory doesn't work, manually set in **Settings** > **Build & Deploy**:
- **Build Command**: `cd frontend && npm install && npm run build`
- **Start Command**: `cd frontend && npm run start:prod`

**Option C: Using nixpacks.toml (Automatic)**

The `frontend/nixpacks.toml` file will automatically configure Railway to:
- Use Node.js 20
- Run `npm install` in the frontend directory
- Run `npm run build`
- Start with `npm run start:prod`

Just make sure **Root Directory** is set to `frontend` in Settings.

## Step 4: Deploy

1. Railway will automatically build and deploy
2. Wait for build to complete
3. Get your frontend URL from Railway dashboard

## Step 5: Update Backend CORS (if needed)

Make sure your backend allows requests from your frontend URL:

In `src/main.ts`, update CORS:
```typescript
app.enableCors({
  origin: [
    'http://localhost:5173',
    'https://your-frontend-url.up.railway.app'
  ],
  credentials: true,
  // ...
});
```

## Troubleshooting

### Build fails
- Check Node.js version (should be 20+)
- Check build logs in Railway

### 404 errors on routes
- Make sure `server.js` is serving `index.html` for all routes
- Check that `dist` folder is being served correctly

### API connection errors
- Verify `VITE_API_URL` environment variable is set correctly
- Check backend CORS settings
- Verify backend is running and accessible

### Port issues
- Railway automatically sets `PORT` environment variable
- Make sure `server.js` uses `process.env.PORT || 5173`

## Local Testing

Test production build locally:

```bash
cd frontend
npm run build
npm run start:prod
```

Visit: http://localhost:5173

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `https://tinklai-production.up.railway.app` |
| `PORT` | Server port (auto-set by Railway) | `5173` |
| `NODE_ENV` | Environment | `production` |

## Notes

- Frontend is served as static files from `dist` folder
- `server.js` handles client-side routing (SPA)
- All routes serve `index.html` for React Router to work
- Environment variables prefixed with `VITE_` are available in frontend code

