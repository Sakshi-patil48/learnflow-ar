@echo off
title LearnFlow AR - Setup and Run (Port 7676)
setlocal enabledelayedexpansion

echo.
echo ============================================
echo LearnFlow AR - Installation & Setup
echo ============================================
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH!
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js version:
node --version
echo.

REM Navigate to project directory
cd /d "%~dp0"

echo Installing npm dependencies...
call npm install
if errorlevel 1 (
    echo ERROR: Failed to install dependencies!
    pause
    exit /b 1
)

echo.
echo Building the project...
call npm run build
if errorlevel 1 (
    echo ERROR: Failed to build project!
    pause
    exit /b 1
)

echo.
echo ============================================
echo Setup completed successfully!
echo ============================================
echo.
echo Starting server on http://localhost:7676 ...
echo Press Ctrl+C to stop the server
echo.

set PORT=7676
start http://localhost:7676
call npm run dev
