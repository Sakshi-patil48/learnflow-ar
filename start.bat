@echo off
title LearnFlow AR - Development Server (Port 7676)
setlocal enabledelayedexpansion

echo.
echo ============================================
echo LearnFlow AR - Server Launch on http://localhost:7676
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

REM Check if node_modules exists
if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install
    if errorlevel 1 (
        echo ERROR: Failed to install dependencies!
        pause
        exit /b 1
    )
    echo Dependencies installed successfully!
    echo.
)

echo Building latest production assets...
call npm run build
if errorlevel 1 (
    echo ERROR: Failed to build project!
    echo Check the error messages above.
    pause
    exit /b 1
)

echo.
echo ============================================
echo Setup completed successfully!
echo ============================================
echo.
echo Starting LearnFlow AR Server on http://localhost:7676 ...
echo Opening http://localhost:7676 in your web browser...
echo.

REM Set PORT to 7676
set PORT=7676

REM Auto-open browser after 2 seconds
start "" timeout /t 2 /nobreak >nul & start http://localhost:7676

REM Run the dev server
call npm run dev

echo.
echo Server has stopped. Press any key to close this window...
pause
