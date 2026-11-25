# PanchayatPost & EGramPanchayat Full Local Stack Launcher
Write-Host "=====================================================" -ForegroundColor Cyan
Write-Host " Starting PanchayatPost & EGramPanchayat Local Stack " -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Cyan

$mongodPath = "C:\Users\AE\.cache\mongodb-binaries\mongod-x64-win32-8.2.6.exe"
$dbPath = "C:\data\db"

# 1. MongoDB
$mongoCheck = Get-NetTCPConnection -LocalPort 27017 -ErrorAction SilentlyContinue
if (-not $mongoCheck) {
    Write-Host "[1/4] Starting MongoDB on port 27017..." -ForegroundColor Yellow
    if (-not (Test-Path $dbPath)) { New-Item -ItemType Directory -Path $dbPath -Force | Out-Null }
    Start-Process -FilePath $mongodPath -ArgumentList "--dbpath `"$dbPath`" --port 27017 --bind_ip 127.0.0.1" -WindowStyle Hidden
    Start-Sleep -Seconds 2
} else {
    Write-Host "[1/4] MongoDB is already running on port 27017." -ForegroundColor Green
}

# 2. PanchayatPost Backend (Express - Port 4000)
$pBackendCheck = Get-NetTCPConnection -LocalPort 4000 -ErrorAction SilentlyContinue
if (-not $pBackendCheck) {
    Write-Host "[2/4] Starting PanchayatPost Backend on port 4000..." -ForegroundColor Yellow
    Start-Process -FilePath "node" -ArgumentList "index.js" -WorkingDirectory "$PSScriptRoot\panchayatpostbackend" -WindowStyle Hidden
    Start-Sleep -Seconds 2
} else {
    Write-Host "[2/4] PanchayatPost Backend is already running on port 4000." -ForegroundColor Green
}

# 3. EGramPanchayat Backend (NestJS - Port 5800)
$egBackendCheck = Get-NetTCPConnection -LocalPort 5800 -ErrorAction SilentlyContinue
if (-not $egBackendCheck) {
    Write-Host "[3/4] Starting EGramPanchayat Backend on port 5800..." -ForegroundColor Yellow
    $env:NODE_ENV = "development"
    $env:PORT = "5800"
    Start-Process -FilePath "node" -ArgumentList "dist/main.js" -WorkingDirectory "$PSScriptRoot\egrampanchayatbackend" -WindowStyle Hidden
    Start-Sleep -Seconds 2
} else {
    Write-Host "[3/4] EGramPanchayat Backend is already running on port 5800." -ForegroundColor Green
}

# 4. Admin Portals Server (Ports 3000 & 3001)
$adminCheck = Get-NetTCPConnection -LocalPort 3000 -ErrorAction SilentlyContinue
if (-not $adminCheck) {
    Write-Host "[4/4] Starting Admin Web Portals (3000 & 3001)..." -ForegroundColor Yellow
    Start-Process -FilePath "node" -ArgumentList "serve-admin.js" -WorkingDirectory "$PSScriptRoot" -WindowStyle Hidden
    Start-Sleep -Seconds 1
} else {
    Write-Host "[4/4] Admin Web Portals are already running." -ForegroundColor Green
}

Write-Host ""
Write-Host "=====================================================" -ForegroundColor Green
Write-Host " All Services are RUNNING:                           " -ForegroundColor Green
Write-Host "  * MongoDB:                 mongodb://127.0.0.1:27017" -ForegroundColor White
Write-Host "  * PanchayatPost API:       http://localhost:4000    " -ForegroundColor White
Write-Host "  * EGramPanchayat API:      http://localhost:5800/api" -ForegroundColor White
Write-Host "  * Swagger API Docs:        http://localhost:5800/api-doc-v1" -ForegroundColor White
Write-Host "  * PanchayatPost Admin UI:  http://localhost:3000    " -ForegroundColor Cyan
Write-Host "  * EGram Admin UI:          http://localhost:3001    " -ForegroundColor Cyan
Write-Host "  * EGram Citizen Web App:   http://localhost:3002    " -ForegroundColor Cyan
Write-Host "  * PosterBanao Mobile App:  http://localhost:3003    " -ForegroundColor Cyan
Write-Host "=====================================================" -ForegroundColor Green
Write-Host " Admin Credentials:" -ForegroundColor Yellow
Write-Host "  PanchayatPost Admin (Port 3000):" -ForegroundColor White
Write-Host "    - Email:    egpanchayat@gmail.com (or admin@panchayatpost.com)" -ForegroundColor White
Write-Host "    - Password: Admin@123" -ForegroundColor White
Write-Host "  EGram Admin (Port 3001):" -ForegroundColor White
Write-Host "    - Mobile:   9723365365 (or 9999999999)" -ForegroundColor White
Write-Host "    - Password: Admin@123" -ForegroundColor White
Write-Host "=====================================================" -ForegroundColor Green
