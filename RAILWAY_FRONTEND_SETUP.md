# Railway Frontend Setup - Step by Step

## Problem: Railway doesn't let you select folder during initial setup

Railway's initial GitHub repo connection doesn't show a "Root Directory" option. Here's how to fix it:

## Solution: Set Root Directory After Service Creation

### Step 1: Create the Service

1. Go to Railway dashboard
2. Click **"New Project"** or select existing project
3. Click **"New Service"**
4. Select **"GitHub Repo"**
5. Choose your repository: `Gustanina/Tinklai`
6. Railway will create the service (it will try to build from root - that's OK for now)

### Step 2: Configure Root Directory

**This is the key step!**

1. Click on your **newly created service** (the one that just failed or is building)
2. Click the **Settings** tab (⚙️ gear icon) at the top
3. Scroll down to **"Build & Deploy"** section
4. Find **"Root Directory"** field
5. Type: `frontend` (without quotes)
6. Click **"Save"** or **"Update"**

### Step 3: Configure Environment Variables

1. Still in the service, go to **Variables** tab
2. Click **"New Variable"**
3. Add these variables:

```
VITE_API_URL = https://your-backend-url.up.railway.app
NODE_ENV = production
```

**Important**: Replace `your-backend-url` with your actual backend Railway URL!

### Step 4: Redeploy

1. After saving Root Directory, Railway will automatically trigger a new build
2. Or manually click **"Redeploy"** button
3. Wait for build to complete

## Alternative: If Root Directory Field Doesn't Appear

If you don't see "Root Directory" field in Settings:

### Option A: Use Build Commands

In **Settings** > **Build & Deploy**:
- **Build Command**: `cd frontend && npm install && npm run build`
- **Start Command**: `cd frontend && npm run start:prod`

### Option B: Use nixpacks.toml

The `frontend/nixpacks.toml` file should help Railway detect the correct directory, but you still need to set Root Directory in Settings.

## Visual Guide

```
Railway Dashboard
├── Your Project
    └── Your Service (click here)
        ├── Deployments (default tab)
        ├── Variables (add VITE_API_URL here)
        ├── Settings (⚙️ - click here!)
        │   └── Build & Deploy
        │       └── Root Directory: frontend ← SET THIS!
        └── Metrics
```

## Troubleshooting

### "Root Directory" field is missing
- Make sure you're in the **Settings** tab, not Deployments
- Try refreshing the page
- The field should be under "Build & Deploy" section

### Build still fails
- Check build logs - they should show commands running in `frontend/` directory
- Verify `frontend/package.json` exists
- Make sure `frontend/server.js` exists

### Service keeps building from root
- Double-check Root Directory is saved (refresh and check again)
- Try deleting and recreating the service
- Make sure you're editing the correct service

## Quick Checklist

- [ ] Service created from GitHub repo
- [ ] Root Directory set to `frontend` in Settings
- [ ] Environment variable `VITE_API_URL` added
- [ ] Build command runs successfully
- [ ] Service is running and accessible

## After Successful Deploy

1. Get your frontend URL from Railway (click "Generate Domain")
2. Update backend CORS to include frontend URL
3. Test the frontend - it should connect to your backend API

