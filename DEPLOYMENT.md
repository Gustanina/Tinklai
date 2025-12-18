# Deployment Instrukcijos

## Railway Deployment

### 1. Reikalingi Environment Variables

Railway projekte nustatykite šiuos environment variables:

#### Būtini kintamieji:
```
POSTGRES_USER=admin
POSTGRES_PASSWORD=your_password
POSTGRES_HOST=your_postgres_host
POSTGRES_DB=reader-backend
POSTGRES_PORT=5432
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
NODE_ENV=production
PORT=3000
```

### 2. Kaip nustatyti Railway:

1. Eikite į Railway projektą
2. Spustelėkite "Variables" arba "Environment"
3. Pridėkite visus aukščiau išvardintus kintamuosius

### 3. PostgreSQL Database Railway:

1. Railway dashboard'e pridėkite PostgreSQL service
2. Railway automatiškai sukurs `DATABASE_URL` arba atskirus kintamuosius
3. Jei naudojate `DATABASE_URL`, galite jį parse'inti arba naudoti atskirus kintamuosius

### 4. Build ir Deploy:

Railway automatiškai:
- Aptiks `package.json`
- Paleis `npm install`
- Paleis `npm run build` (jei yra `railway.json`)
- Paleis `npm run start:prod`

### 5. Troubleshooting:

#### Klaida: "Config validation error"
**Sprendimas:** Patikrinkite, ar visi reikalingi environment variables yra nustatyti Railway

#### Klaida: "Cannot connect to database"
**Sprendimas:** 
- Patikrinkite PostgreSQL service veikia Railway
- Patikrinkite `POSTGRES_HOST`, `POSTGRES_USER`, `POSTGRES_PASSWORD` yra teisingi
- Patikrinkite, ar database yra sukurtas

#### Klaida: "JWT_SECRET is not defined"
**Sprendimas:** Pridėkite `JWT_SECRET` ir `JWT_REFRESH_SECRET` į Railway environment variables

#### Klaida: Build fails
**Sprendimas:**
- Patikrinkite, ar `npm run build` veikia lokaliai
- Patikrinkite, ar visos priklausomybės yra `package.json`

---

## Vercel Deployment (Alternative)

Jei naudojate Vercel, sukurkite `vercel.json`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/dist/main.js"
    }
  ],
  "env": {
    "NODE_ENV": "production"
  }
}
```

**Pastaba:** Vercel gali turėti problemų su PostgreSQL, geriau naudoti Railway arba Render.

---

## Render Deployment

1. Sukurkite naują Web Service
2. Prijunkite GitHub repository
3. Build Command: `npm install && npm run build`
4. Start Command: `npm run start:prod`
5. Pridėkite PostgreSQL database
6. Pridėkite environment variables

---

## Heroku Deployment

1. Sukurkite `Procfile`:
```
web: npm run start:prod
```

2. Pridėkite PostgreSQL addon
3. Nustatykite environment variables per Heroku dashboard

---

## Svarbu!

- **NIEKADA** necommit'inkite `.env` failo
- Naudokite saugius JWT secret'us production (min 32 simboliai)
- Patikrinkite, ar database connection veikia prieš deploy'inant
- Naudokite `NODE_ENV=production` production aplinkoje

