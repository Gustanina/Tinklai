# Railway Deployment Setup - Greitas Gidas

## ✅ Aplikacija veikia, bet reikia nustatyti Environment Variables!

### Greitas Setup (5 min)

#### 1. Pridėkite PostgreSQL Database Railway

1. Railway dashboard'e spustelėkite **"+ New"**
2. Pasirinkite **"Database"** → **"PostgreSQL"**
3. Railway automatiškai sukurs PostgreSQL service

#### 2. Nustatykite Environment Variables

Railway projekte eikite į **"Variables"** arba **"Environment"** ir pridėkite:

##### Būtini kintamieji (iš PostgreSQL service):

Railway automatiškai sukuria šiuos kintamuosius, kai pridėsite PostgreSQL:
- `PGHOST` arba `POSTGRES_HOST` 
- `PGUSER` arba `POSTGRES_USER`
- `PGPASSWORD` arba `POSTGRES_PASSWORD`
- `PGPORT` arba `POSTGRES_PORT`
- `PGDATABASE` arba `POSTGRES_DB`

**Arba** Railway gali sukurti `DATABASE_URL` - tada mūsų kodas automatiškai jį naudos!

##### Jei Railway naudoja skirtingus pavadinimus:

Pridėkite šiuos kintamuosius **rankiniu būdu**:

```
POSTGRES_HOST=<iš PostgreSQL service>
POSTGRES_USER=<iš PostgreSQL service>
POSTGRES_PASSWORD=<iš PostgreSQL service>
POSTGRES_PORT=5432
POSTGRES_DB=reader-backend
```

##### JWT kintamieji (privalomi):

```
JWT_SECRET=<sugeneruokite saugų raktą, min 32 simboliai>
JWT_REFRESH_SECRET=<sugeneruokite saugų raktą, min 32 simboliai>
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

##### Kiti kintamieji:

```
NODE_ENV=production
PORT=3000
```

### 3. Kaip gauti PostgreSQL kintamuosius Railway

1. Railway dashboard'e spustelėkite ant **PostgreSQL service**
2. Eikite į **"Variables"** arba **"Connect"** tab
3. Ten matysite visus connection string'us ir kintamuosius
4. Nukopijuokite reikalingus kintamuosius į jūsų **Web Service** environment variables

### 4. Kaip generuoti JWT Secret'us

**PowerShell:**
```powershell
# Generuoti saugų raktą
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Minimum 0 -Maximum 256 }))
```

**Arba naudokite online generator:**
- https://generate-secret.vercel.app/32
- Arba bet kurį kitą random string generator

**Arba terminal:**
```bash
openssl rand -base64 32
```

### 5. Patikrinimas

Po nustatymo Railway automatiškai perdeploy'ins aplikaciją. Patikrinkite:

1. **Deploy Logs** - turėtų rodyti "Nest application successfully started"
2. **Health Check** - eikite į jūsų Railway URL (pvz., `https://your-app.railway.app/`)
3. Turėtumėte matyti JSON su API informacija

### 6. Troubleshooting

#### Klaida: "Config validation error"
**Sprendimas:** 
- Patikrinkite, ar **visi** reikalingi kintamieji yra nustatyti
- Patikrinkite, ar kintamųjų pavadinimai yra **tikslūs** (case-sensitive!)

#### Klaida: "Cannot connect to database"
**Sprendimas:**
- Patikrinkite, ar PostgreSQL service **veikia** Railway
- Patikrinkite, ar kintamieji yra nustatyti **teisingame service** (Web Service, ne PostgreSQL service)
- Railway PostgreSQL service turi būti **prijungtas** prie jūsų Web Service

#### Kaip prijungti PostgreSQL prie Web Service Railway:

1. Spustelėkite ant **Web Service**
2. Eikite į **"Settings"**
3. Raskite **"Service Connections"** arba **"Dependencies"**
4. Pridėkite **PostgreSQL service** kaip dependency
5. Railway automatiškai eksportuos kintamuosius

### 7. Greitas Checklist

- [ ] PostgreSQL service pridėtas Railway
- [ ] PostgreSQL prijungtas prie Web Service (Service Connections)
- [ ] `JWT_SECRET` nustatytas (min 32 simboliai)
- [ ] `JWT_REFRESH_SECRET` nustatytas (min 32 simboliai)
- [ ] `NODE_ENV=production` nustatytas
- [ ] `PORT=3000` nustatytas (arba Railway automatiškai)
- [ ] Aplikacija perdeploy'inta
- [ ] Health check veikia (`/` endpoint)

### 8. Testavimas po Deployment

```bash
# 1. Health check
curl https://your-app.railway.app/

# 2. Registracija
curl -X POST https://your-app.railway.app/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","username":"Test","password":"password123"}'
```

---

**Svarbu:** Railway automatiškai eksportuoja PostgreSQL kintamuosius, kai pridėsite PostgreSQL service kaip dependency. Jei vis dar klaida, patikrinkite Service Connections.

