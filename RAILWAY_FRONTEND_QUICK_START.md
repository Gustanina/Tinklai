# Railway Frontend - Greitas Paleidimas

## Problema: Matau tik backend API response

Jei matote JSON su `"message": "Reader Backend API is running"`, tai reiškia, kad:
- Einate į **backend** URL, ne frontend
- Arba frontend service dar nėra sukurtas Railway

## Sprendimas: Sukurti Frontend Service

### Step 1: Sukurti Naują Frontend Service

1. **Eikite į Railway Dashboard**
   - https://railway.app/dashboard

2. **Atidarykite savo projektą** (kur yra backend)

3. **Sukurkite naują service:**
   - Spauskite **"New"** arba **"+"** mygtuką
   - Pasirinkite **"GitHub Repo"**
   - Pasirinkite tą patį repository: `Gustanina/Tinklai`

4. **Railway sukurs service** (gali nepavykti build - tai OK)

### Step 2: Nustatyti Root Directory

**SVARBU!** Po service sukūrimo:

1. **Spauskite ant naujo service** (jis bus sąraše)
2. Eikite į **Settings** tab (⚙️ piktograma)
3. Slinkite žemyn iki **"Build & Deploy"** sekcijos
4. Raskite **"Root Directory"** lauką
5. Įveskite: `frontend`
6. Spauskite **"Save"**

### Step 3: Pridėti Environment Variables

1. Eikite į **Variables** tab
2. Spauskite **"New Variable"**
3. Pridėkite:
   ```
   VITE_API_URL = https://tinklai-production.up.railway.app
   NODE_ENV = production
   ```
   **Svarbu:** Pakeiskite `tinklai-production.up.railway.app` į jūsų tikrą backend URL!

### Step 4: Gaukite Frontend URL

1. Po build completion, eikite į **Settings** tab
2. Slinkite žemyn iki **"Networking"** sekcijos
3. Spauskite **"Generate Domain"** arba raskite esamą domain
4. Frontend URL bus kažkas panašaus:
   - `https://your-frontend-name.up.railway.app`
   - Arba custom domain, jei nustatėte

### Step 5: Patikrinti

1. Atidarykite frontend URL naršyklėje
2. Turėtumėte matyti **Login/Register** puslapį, ne JSON
3. Jei vis dar matote JSON - patikrinkite:
   - Ar Root Directory nustatytas į `frontend`?
   - Ar build sėkmingas?
   - Ar naudojate teisingą URL?

## Troubleshooting

### Vis dar matau backend response

**Patikrinkite:**
1. Ar naudojate **frontend** URL, ne backend?
2. Railway dashboard → Frontend service → Settings → Networking → Domain
3. Ar frontend service yra **atskiras** service nuo backend?

### Build fails

**Patikrinkite build logs:**
1. Railway dashboard → Frontend service → Deployments
2. Spauskite ant paskutinio deployment
3. Patikrinkite error messages

**Dažniausios problemos:**
- Root Directory nėra nustatytas
- `dist` folder nerandamas (build nepavyko)
- Missing dependencies

### 404 arba "Cannot GET /"

**Sprendimas:**
- Patikrinkite ar `server.js` veikia
- Patikrinkite ar `dist/index.html` egzistuoja
- Patikrinkite build logs

## Kaip atskirti Backend ir Frontend URL

**Backend URL:**
- Rodo JSON: `{"message": "Reader Backend API is running", ...}`
- URL gali būti: `tinklai-production.up.railway.app`
- Swagger: `/api` endpoint

**Frontend URL:**
- Rodo React aplikaciją (Login/Register puslapis)
- URL bus skirtingas: `your-frontend-name.up.railway.app`
- HTML puslapis su React komponentais

## Greitas Checklist

- [ ] Frontend service sukurtas Railway
- [ ] Root Directory nustatytas į `frontend`
- [ ] Environment variables pridėti (`VITE_API_URL`)
- [ ] Build sėkmingas (žalias statusas)
- [ ] Frontend domain sugeneruotas
- [ ] Frontend URL rodo React aplikaciją, ne JSON

## Jei vis dar neveikia

1. Patikrinkite Railway logs:
   - Service → Deployments → Latest → View Logs
   
2. Patikrinkite ar visi failai yra GitHub:
   - `frontend/server.js`
   - `frontend/package.json`
   - `frontend/railway.json`

3. Bandykite redeploy:
   - Service → Deployments → "Redeploy"

