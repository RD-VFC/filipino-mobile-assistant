@echo off
REM Filipino Mobile Assistant - Windows Installation Script

echo.
echo ========================================
echo Filipino Mobile Assistant - Setup Script
echo ========================================
echo.

REM Check if Node.js is installed
echo Checking Node.js...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed!
    echo Please install Node.js 18+ from https://nodejs.org/
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo [OK] Node.js %NODE_VERSION% found
echo.

REM Check if npm is installed
echo Checking npm...
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed!
    pause
    exit /b 1
)

for /f "tokens=*" %%i in ('npm -v') do set NPM_VERSION=%%i
echo [OK] npm %NPM_VERSION% found
echo.

REM Setup Backend
echo Setting up Backend...
cd backend

if not exist "package.json" (
    echo [ERROR] Backend package.json not found!
    pause
    exit /b 1
)

echo Installing backend dependencies...
call npm install

if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo [WARNING] Please edit backend\.env and add your API keys
) else (
    echo [OK] .env file already exists
)

echo [OK] Backend setup complete!
echo.

REM Setup Mobile App
echo Setting up Mobile App...
cd ..\mobile-app

if not exist "package.json" (
    echo [ERROR] Mobile app package.json not found!
    pause
    exit /b 1
)

echo Installing mobile app dependencies...
call npm install

REM Check if Expo CLI is installed globally
where expo >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Installing Expo CLI globally...
    call npm install -g expo-cli
)

if not exist ".env" (
    echo Creating .env file from template...
    copy .env.example .env
    echo [WARNING] Please edit mobile-app\.env and add your configuration
) else (
    echo [OK] .env file already exists
)

echo [OK] Mobile app setup complete!
echo.

REM Final instructions
echo ========================================
echo [SUCCESS] Installation Complete!
echo ========================================
echo.
echo Next Steps:
echo.
echo 1. Get your API keys (see SETUP_GUIDE.md)
echo    - Google Gemini API
echo    - Supabase (create project)
echo    - OpenWeatherMap API
echo    - TomTom Traffic API
echo    - OpenAI API
echo.
echo 2. Setup Supabase database:
echo    - Run backend\supabase-schema.sql in Supabase SQL Editor
echo.
echo 3. Configure environment variables:
echo    - Edit backend\.env
echo    - Edit mobile-app\.env
echo.
echo 4. Start the backend server:
echo    cd backend
echo    npm run dev
echo.
echo 5. Start the mobile app (in new terminal):
echo    cd mobile-app
echo    npm start
echo.
echo For detailed setup instructions, see SETUP_GUIDE.md
echo.
echo Happy coding!
echo.
pause
