# Kaip gauti ADMIN rolę

Yra keletas būdų gauti ADMIN rolę. Pasirinkite patogiausią jums.

## ⚡ Būdas 1: Automatinis script'as (PAPRASČIAUSIAS!)

**Naujausias ir paprasčiausias būdas!** Tiesiog paleiskite script'ą:

### PowerShell:

```powershell
# Naudojant numatytuosius parametrus
.\create-admin.ps1

# Arba su savo duomenimis
.\create-admin.ps1 -Email "your@email.com" -Username "yourname" -Password "yourpassword"
```

### cURL (jei naudojate Linux/Mac):

```bash
curl -X POST http://localhost:3000/auth/create-admin \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "username": "admin",
    "password": "admin123"
  }'
```

### Swagger UI:

1. Eikite į: http://localhost:3000/api
2. Raskite `POST /auth/create-admin` endpoint'ą
3. Spauskite "Try it out"
4. Įveskite duomenis ir spauskite "Execute"

**Svarbu:** Šis endpoint'as veikia tik kai `NODE_ENV=dev` (development režime).

---

## Būdas 2: Pirmasis registruotas vartotojas automatiškai gauna ADMIN

Jei duomenų bazėje nėra jokių vartotojų, pirmasis registruotas vartotojas automatiškai gauna ADMIN rolę!

Tiesiog registruokitės per frontend arba API - jei esate pirmasis, automatiškai tapsite ADMIN.

---

## Būdas 3: Per PostgreSQL duomenų bazę

Jei jau turite registruotą naudotoją, galite tiesiogiai pakeisti jo rolę duomenų bazėje.

### 1. Prisijunkite prie PostgreSQL:

```bash
# Jei naudojate Docker
docker exec -it <container_name> psql -U admin -d reader-backend

# Arba tiesiogiai
psql -U admin -d reader-backend -h localhost
```

### 2. Patikrinkite naudotojus:

```sql
SELECT id, email, username, role FROM users;
```

### 3. Pakeiskite rolę į ADMIN:

```sql
-- Pakeiskite savo email
UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';
```

### 4. Patikrinkite:

```sql
SELECT id, email, username, role FROM users WHERE email = 'your@email.com';
```

### 5. Prisijunkite iš naujo per API:

Dabar kai prisijungsite su tuo pačiu email/password, gausite ADMIN rolę ir galėsite keisti kitų naudotojų roles.

---

## Būdas 4: Sukurti naują ADMIN naudotoją per duomenų bazę

Jei norite sukurti visiškai naują ADMIN naudotoją:

```sql
-- Įterpkite naują naudotoją su ADMIN role
-- Slaptažodis: "admin123" (hash'as bus sugeneruotas automatiškai)
-- ARBA naudokite bcrypt hash generatorį

-- Pavyzdys (slaptažodis "admin123" hash'as):
INSERT INTO users (email, username, password, role, "createdAt", "updatedAt")
VALUES (
  'admin@example.com',
  'Admin User',
  '$2b$10$rOzJqKqKqKqKqKqKqKqKqOqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKqKq', -- Naudokite tikrą hash'ą
  'ADMIN',
  NOW(),
  NOW()
);
```

**Geriau:** Naudokite API registraciją, tada pakeiskite rolę per duomenų bazę (Būdas 1).

---

## Būdas 5: Per API (jei jau turite ADMIN naudotoją)

Jei jau turite vieną ADMIN naudotoją, galite keisti kitų naudotojų roles per API:

### PowerShell:

```powershell
# 1. Prisijunkite kaip ADMIN
$loginBody = @{
    email = "admin@example.com"
    password = "admin_password"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $loginBody

$adminToken = $response.accessToken

# 2. Pakeiskite kitų naudotojų rolę
$updateBody = @{
    role = "ADMIN"
} | ConvertTo-Json

# Pakeiskite :id į tikrą naudotojo ID
Invoke-RestMethod -Uri "http://localhost:3000/users/1/role" `
    -Method PATCH `
    -Headers @{ Authorization = "Bearer $adminToken" } `
    -ContentType "application/json" `
    -Body $updateBody
```

### cURL:

```bash
# 1. Prisijunkite
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin_password"}'

# 2. Išsaugokite accessToken

# 3. Pakeiskite rolę
curl -X PATCH http://localhost:3000/users/1/role \
  -H "Authorization: Bearer YOUR_ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"role":"ADMIN"}'
```

---

## Būdas 6: Sukurti seed scriptą

Galiu sukurti automatinį scriptą, kuris sukurs pirmąjį ADMIN naudotoją. Ar norite, kad sukursiu?

---

## Greitas patikrinimas

Patikrinkite, ar turite ADMIN rolę:

```powershell
# Prisijunkite
$body = @{ email = "your@email.com"; password = "your_password" } | ConvertTo-Json
$token = (Invoke-RestMethod -Uri "http://localhost:3000/auth/login" -Method POST -ContentType "application/json" -Body $body).accessToken

# Patikrinkite savo profilį
$me = Invoke-RestMethod -Uri "http://localhost:3000/users/me" -Method GET -Headers @{ Authorization = "Bearer $token" }
Write-Host "Role: $($me.role)"
```

Jei matote `"role": "ADMIN"`, viskas veikia!

---

## Rekomendacija

**PAPRASČIAUSIAS būdas:** Būdas 1 (automatinis script'as)
- Tiesiog paleiskite `.\create-admin.ps1` - viskas!

**Jei jau turite vartotoją:** Būdas 3 (per duomenų bazę)
1. Prisijunkite prie PostgreSQL
2. Pakeiskite rolę: `UPDATE users SET role = 'ADMIN' WHERE email = 'your@email.com';`
3. Prisijunkite iš naujo

**Jei duomenų bazė tuščia:** Būdas 2 (pirmasis registruotas)
- Tiesiog registruokitės - automatiškai tapsite ADMIN!

