# ==============================================================================
# SankalpQ - Startup Script (PowerShell)
# ==============================================================================

Set-Location -Path $PSScriptRoot

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "   Starting SankalpQ Web Application  " -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan

# Check for Node.js
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] Node.js is not installed or not in PATH." -ForegroundColor Red
    Write-Host "Please install Node.js from https://nodejs.org/ or run: winget install OpenJS.NodeJS.LTS" -ForegroundColor Yellow
    exit 1
}

# Check for npm
if (-not (Get-Command npm -ErrorAction SilentlyContinue)) {
    Write-Host "[ERROR] npm is not installed or not in PATH." -ForegroundColor Red
    exit 1
}

$nodeVer = node -v
$npmVer = npm -v
Write-Host "[OK] Node.js version: $nodeVer" -ForegroundColor Green
Write-Host "[OK] npm version:     $npmVer" -ForegroundColor Green

# Check if node_modules exists
if (-not (Test-Path -Path "node_modules")) {
    Write-Host "`n[!] node_modules not found. Installing dependencies..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to install dependencies." -ForegroundColor Red
        exit 1
    }
    Write-Host "[OK] Dependencies installed successfully." -ForegroundColor Green
}

Write-Host "`nStarting development server at http://localhost:3000 ..." -ForegroundColor Green
npm run dev
