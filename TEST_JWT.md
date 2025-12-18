# JWT Testavimo Instrukcijos

## ⚠️ SVARBU: Naudokite POST metodą, ne GET!

Visi `/auth/*` endpointai yra **POST** metodai, ne GET.

## 1. Registracija (POST)

### PowerShell (Invoke-RestMethod):

```powershell
$body = @{
    email = "test@example.com"
    username = "Test User"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

$response | ConvertTo-Json
```

### cURL:

```bash
curl -X POST http://localhost:3000/auth/register ^
  -H "Content-Type: application/json" ^
  -d "{\"email\":\"test@example.com\",\"username\":\"Test User\",\"password\":\"password123\"}"
```

### Postman:
- **Method:** POST
- **URL:** `http://localhost:3000/auth/register`
- **Body:** raw JSON
```json
{
  "email": "test@example.com",
  "username": "Test User",
  "password": "password123"
}
```

## 2. Prisijungimas (POST)

### PowerShell:

```powershell
$body = @{
    email = "test@example.com"
    password = "password123"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:3000/auth/login" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

$accessToken = $response.accessToken
Write-Host "Access Token: $accessToken"
```

## 3. Naudojimas su Token (GET/POST/PATCH/DELETE)

### PowerShell su Token:

```powershell
$headers = @{
    Authorization = "Bearer $accessToken"
}

$projects = Invoke-RestMethod -Uri "http://localhost:3000/projects" `
    -Method GET `
    -Headers $headers

$projects | ConvertTo-Json
```

## 4. Token Atnaujinimas (POST)

### PowerShell:

```powershell
$body = @{
    refreshToken = $response.refreshToken
} | ConvertTo-Json

$newTokens = Invoke-RestMethod -Uri "http://localhost:3000/auth/refresh" `
    -Method POST `
    -ContentType "application/json" `
    -Body $body

$newTokens | ConvertTo-Json
```

## 5. Klaidos, kurias galite gauti:

### ❌ "Cannot GET /auth/register"
**Priežastis:** Naudojate GET metodą vietoj POST
**Sprendimas:** Naudokite POST metodą

### ❌ "Unauthorized" (401)
**Priežastis:** 
- Neteisingas email arba password
- Token pasibaigė arba neteisingas
- Trūksta Authorization header

**Sprendimas:**
- Patikrinkite email/password
- Naudokite refresh token, jei access token pasibaigė
- Pridėkite `Authorization: Bearer YOUR_TOKEN` header

### ❌ "Forbidden" (403)
**Priežastis:** Jūsų rolė neturi prieigos prie šio endpointo
**Sprendimas:** 
- GUEST gali tik GET
- MEMBER gali GET, POST, PATCH
- ADMIN gali visus metodus

## 6. Greitas Testavimo Skriptas (PowerShell)

Išsaugokite kaip `test-jwt.ps1`:

```powershell
# 1. Registracija
Write-Host "1. Registruojame naują naudotoją..." -ForegroundColor Green
$registerBody = @{
    email = "test@example.com"
    username = "Test User"
    password = "password123"
} | ConvertTo-Json

$registerResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/register" `
    -Method POST `
    -ContentType "application/json" `
    -Body $registerBody

Write-Host "Registracija sėkminga!" -ForegroundColor Green
Write-Host "Access Token: $($registerResponse.accessToken.Substring(0, 50))..." -ForegroundColor Yellow

# 2. Naudojame token
Write-Host "`n2. Gauname projektus su token..." -ForegroundColor Green
$headers = @{
    Authorization = "Bearer $($registerResponse.accessToken)"
}

$projects = Invoke-RestMethod -Uri "http://localhost:3000/projects" `
    -Method GET `
    -Headers $headers

Write-Host "Projektai gauti sėkmingai!" -ForegroundColor Green
$projects | ConvertTo-Json
```

Paleiskite:
```powershell
.\test-jwt.ps1
```

