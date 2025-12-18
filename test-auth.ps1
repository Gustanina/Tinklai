# JWT Auth Testavimo Skriptas
# Paleiskite: .\test-auth.ps1

Write-Host "=== JWT Auth Testavimas ===" -ForegroundColor Cyan
Write-Host ""

# 1. Patikrinti, ar aplikacija veikia
Write-Host "1. Tikriname, ar aplikacija veikia..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "http://localhost:3000/" -Method GET -ErrorAction Stop
    Write-Host "✓ Aplikacija veikia!" -ForegroundColor Green
    $health | ConvertTo-Json
} catch {
    Write-Host "✗ Aplikacija neveikia arba nepasiekiama!" -ForegroundColor Red
    Write-Host "  Patikrinkite, ar aplikacija paleista: npm run start:dev" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# 2. Registracija
Write-Host "2. Registruojame naują naudotoją..." -ForegroundColor Yellow
$registerBody = @{
    email = "test@example.com"
    username = "Test User"
    password = "password123"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:3000/auth/register" `
        -Method POST `
        -ContentType "application/json" `
        -Body $registerBody `
        -ErrorAction Stop

    Write-Host "✓ Registracija sėkminga!" -ForegroundColor Green
    Write-Host "  User ID: $($registerResponse.user.id)" -ForegroundColor Cyan
    Write-Host "  Email: $($registerResponse.user.email)" -ForegroundColor Cyan
    Write-Host "  Role: $($registerResponse.user.role)" -ForegroundColor Cyan
    Write-Host "  Access Token: $($registerResponse.accessToken.Substring(0, 50))..." -ForegroundColor Gray
    
    $accessToken = $registerResponse.accessToken
} catch {
    Write-Host "✗ Registracija nepavyko!" -ForegroundColor Red
    Write-Host "  Klaida: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.ErrorDetails.Message) {
        $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
        Write-Host "  Detalės: $($errorDetails.message)" -ForegroundColor Red
    }
    exit 1
}

Write-Host ""

# 3. Testuojame su token
Write-Host "3. Gauname projektus su token..." -ForegroundColor Yellow
$headers = @{
    Authorization = "Bearer $accessToken"
}

try {
    $projects = Invoke-RestMethod -Uri "http://localhost:3000/projects" `
        -Method GET `
        -Headers $headers `
        -ErrorAction Stop

    Write-Host "✓ Projektai gauti sėkmingai!" -ForegroundColor Green
    Write-Host "  Rastų projektų: $($projects.meta.total)" -ForegroundColor Cyan
} catch {
    Write-Host "✗ Nepavyko gauti projektų!" -ForegroundColor Red
    Write-Host "  Klaida: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Testavimas baigtas ===" -ForegroundColor Cyan

