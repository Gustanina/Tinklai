# Greitas budas gauti ADMIN role
# Naudojimas: .\make-admin.ps1 -Email "your@email.com"

param(
    [Parameter(Mandatory=$true)]
    [string]$Email
)

Write-Host "=== ADMIN Roles Priskirimas ===" -ForegroundColor Cyan
Write-Host ""

# Patikrinti, ar PostgreSQL konteineris veikia
Write-Host "1. Tikriname PostgreSQL konteineri..." -ForegroundColor Yellow
$container = docker ps --filter "name=postgres" --format "{{.Names}}"
if (-not $container) {
    Write-Host "[ERROR] PostgreSQL konteineris nerastas!" -ForegroundColor Red
    Write-Host "  Paleiskite: docker-compose up -d" -ForegroundColor Yellow
    exit 1
}
Write-Host "[OK] PostgreSQL konteineris veikia: $container" -ForegroundColor Green
Write-Host ""

# Patikrinti, ar naudotojas egzistuoja
Write-Host "2. Tikriname, ar naudotojas egzistuoja..." -ForegroundColor Yellow
$userCheck = docker exec $container psql -U admin -d reader-backend -t -c "SELECT COUNT(*) FROM users WHERE email = '$Email';"
$userCheck = $userCheck.Trim()

if ($userCheck -eq "0") {
    Write-Host "[ERROR] Naudotojas su email '$Email' nerastas!" -ForegroundColor Red
    Write-Host "  Pirmiausia registruokites per API:" -ForegroundColor Yellow
    Write-Host "  POST http://localhost:3000/auth/register" -ForegroundColor Gray
    exit 1
}
Write-Host "[OK] Naudotojas rastas!" -ForegroundColor Green
Write-Host ""

# Pakeisti role
Write-Host "3. Keiciame role i ADMIN..." -ForegroundColor Yellow
$result = docker exec $container psql -U admin -d reader-backend -c "UPDATE users SET role = 'ADMIN' WHERE email = '$Email';"
$affected = docker exec $container psql -U admin -d reader-backend -t -c "SELECT COUNT(*) FROM users WHERE email = '$Email' AND role = 'ADMIN';"
$affected = $affected.Trim()

if ($affected -eq "1") {
    Write-Host "[OK] Role sekmingai pakeista i ADMIN!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Dabar:" -ForegroundColor Cyan
    Write-Host "1. Prisijunkite per API su tuo paciu email/password" -ForegroundColor Yellow
    Write-Host "2. Gausite ADMIN token" -ForegroundColor Yellow
    Write-Host "3. Galėsite keisti kitu naudotoju roles" -ForegroundColor Yellow
} else {
    Write-Host "[ERROR] Nepavyko pakeisti roles!" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "=== Baigta ===" -ForegroundColor Cyan
