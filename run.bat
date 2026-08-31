@echo off
setlocal

cd /d "%~dp0"

echo ======================================
echo    Starting SankalpQ Web Application  
echo ======================================

where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed or not found in PATH.
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] npm is not installed or not found in PATH.
    pause
    exit /b 1
)

if not exist "node_modules\" (
    echo [!] node_modules not found. Installing dependencies...
    call npm install
    if %errorlevel% neq 0 (
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
)

echo Starting development server at http://localhost:3000 ...
call npm run dev
