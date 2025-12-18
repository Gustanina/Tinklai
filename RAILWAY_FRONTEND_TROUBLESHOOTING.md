# Railway Frontend Build Failed - Troubleshooting

## Service: "beneficial-gentleness" - Build Failed

### Step 1: Check Build Logs

1. Click on the **"beneficial-gentleness"** service
2. Go to **"Deployments"** tab
3. Click on the **latest deployment** (the one that failed)
4. Click **"View Logs"** or scroll down to see build logs
5. Look for error messages

### Common Issues and Solutions

#### Issue 1: Root Directory Not Set

**Error:** `package.json not found` or `Cannot find module`

**Solution:**
1. Go to **Settings** tab
2. Scroll to **"Build & Deploy"** section
3. Set **Root Directory** to: `frontend`
4. Click **Save**
5. Railway will automatically redeploy

#### Issue 2: Build Command Issues

**Error:** Build command fails

**Solution:**
In **Settings** > **Build & Deploy**, set:
- **Build Command**: `cd frontend && npm install && npm run build`
- **Start Command**: `cd frontend && npm run start:prod`

#### Issue 3: TypeScript Errors

**Error:** TypeScript compilation errors

**Solution:**
The build script uses `vite build` which should handle TypeScript. If errors persist:
- Check build logs for specific TypeScript errors
- Make sure all dependencies are installed

#### Issue 4: Missing Dependencies

**Error:** `Cannot find module 'express'` or similar

**Solution:**
Make sure `frontend/package.json` has all dependencies:
- `express` (for server.js)
- All React dependencies

#### Issue 5: Port Issues

**Error:** Port already in use or PORT not set

**Solution:**
Railway automatically sets `PORT` environment variable. Make sure `server.js` uses:
```javascript
const PORT = process.env.PORT || 5173;
```

### Step 2: Verify Configuration

Check these in Railway Settings:

1. **Root Directory**: Must be `frontend`
2. **Build Command**: Should be `npm install && npm run build` (if Root Directory is set)
   OR `cd frontend && npm install && npm run build` (if Root Directory is not set)
3. **Start Command**: Should be `npm run start:prod` (if Root Directory is set)
   OR `cd frontend && npm run start:prod` (if Root Directory is not set)

### Step 3: Environment Variables

Make sure these are set in **Variables** tab:
- `VITE_API_URL` = `https://tinklai-production.up.railway.app`
- `NODE_ENV` = `production`

### Step 4: Manual Fix - Update Build Commands

If Root Directory doesn't work, use these commands:

**In Settings > Build & Deploy:**

**Build Command:**
```bash
cd frontend && npm install && npm run build
```

**Start Command:**
```bash
cd frontend && npm run start:prod
```

### Step 5: Redeploy

After making changes:
1. Click **"Redeploy"** button
2. Or Railway will auto-redeploy after saving settings
3. Watch the build logs

### Quick Checklist

- [ ] Root Directory set to `frontend` in Settings
- [ ] Build Command is correct
- [ ] Start Command is correct
- [ ] Environment variables are set
- [ ] All files are in GitHub (`frontend/server.js`, `frontend/package.json`)
- [ ] Build logs checked for specific errors

### If Still Failing

1. **Copy the exact error message** from build logs
2. **Check if files exist in GitHub:**
   - `frontend/server.js`
   - `frontend/package.json`
   - `frontend/railway.json`
   - `frontend/nixpacks.toml`

3. **Try deleting and recreating the service:**
   - Delete the "beneficial-gentleness" service
   - Create new service from GitHub
   - Set Root Directory immediately
   - Add environment variables
   - Redeploy

