# Simple script to create an admin user
# Usage: .\create-admin.ps1 -Email "admin@example.com" -Username "admin" -Password "admin123"

param(
    [Parameter(Mandatory=$false)]
    [string]$Email = "admin@example.com",
    
    [Parameter(Mandatory=$false)]
    [string]$Username = "admin",
    
    [Parameter(Mandatory=$false)]
    [string]$Password = "admin123",
    
    [Parameter(Mandatory=$false)]
    [string]$ApiUrl = "http://localhost:3000"
)

Write-Host "Creating admin user..." -ForegroundColor Cyan
Write-Host "Email: $Email" -ForegroundColor Gray
Write-Host "Username: $Username" -ForegroundColor Gray
Write-Host "API URL: $ApiUrl" -ForegroundColor Gray
Write-Host ""

$body = @{
    email = $Email
    username = $Username
    password = $Password
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "$ApiUrl/auth/create-admin" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -ErrorAction Stop

    Write-Host "✅ Admin user created successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Access Token: $($response.accessToken)" -ForegroundColor Yellow
    Write-Host "User Role: $($response.user.role)" -ForegroundColor Yellow
    Write-Host "User ID: $($response.user.id)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "You can now login with:" -ForegroundColor Cyan
    Write-Host "  Email: $Email" -ForegroundColor White
    Write-Host "  Password: $Password" -ForegroundColor White
} catch {
    $errorMessage = $_.Exception.Message
    if ($_.ErrorDetails.Message) {
        try {
            $errorDetails = $_.ErrorDetails.Message | ConvertFrom-Json
            $errorMessage = $errorDetails.message
        } catch {
            $errorMessage = $_.ErrorDetails.Message
        }
    }
    
    Write-Host "❌ Error: $errorMessage" -ForegroundColor Red
    
    if ($errorMessage -like "*development mode*") {
        Write-Host ""
        Write-Host "💡 Tip: Make sure NODE_ENV=dev in your .env file" -ForegroundColor Yellow
    }
    
    exit 1
}

