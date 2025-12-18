# Kaip rasti Railway aplikacijos URL

## Greitas būdas

### 1. Railway Dashboard

1. Eikite į Railway dashboard: https://railway.app
2. Spustelėkite ant jūsų **projekto**
3. Spustelėkite ant **Web Service** (ne PostgreSQL)
4. Eikite į **"Settings"** tab
5. Raskite **"Domains"** arba **"Networking"** sekciją
6. Ten matysite jūsų aplikacijos URL

### 2. Alternatyvus būdas

1. Railway dashboard'e spustelėkite ant **Web Service**
2. Viršuje dešinėje matysite **"Generate Domain"** arba **"Settings"**
3. Eikite į **"Settings"** → **"Networking"**
4. Ten rasite:
   - **Custom Domain** (jei pridėjote)
   - **Railway Domain** (automatiškai sugeneruotas, pvz., `your-app.up.railway.app`)

### 3. Deploy Logs

Kai aplikacija sėkmingai deploy'inama, Railway logs gali rodyti URL, pvz.:
```
Your service is live at: https://your-app.up.railway.app
```

### 4. Service Overview

Railway dashboard'e, kai spustelėjate ant Web Service, viršuje turėtumėte matyti:
- **Service URL** arba **Public URL**
- Arba spustelėkite **"Open"** mygtuką

## Jei nerandate URL

1. **Patikrinkite, ar service deploy'intas:**
   - Eikite į **"Deployments"** tab
   - Turėtų būti sėkmingas deployment (žalia vėliavėlė)

2. **Sukurkite public domain:**
   - Settings → Networking → Generate Domain
   - Railway automatiškai sukurs: `your-app-name.up.railway.app`

3. **Patikrinkite service status:**
   - Service turėtų būti **"Active"**
   - Deploy logs turėtų rodyti "Nest application successfully started"

## Testavimas

Kai rasite URL, patikrinkite:

```bash
# Health check
curl https://your-app.up.railway.app/

# Arba naršyklėje
https://your-app.up.railway.app/
```

Turėtumėte matyti JSON su API informacija.

