@echo off
echo =====================================
echo Mobile Assistant Backend Setup
echo =====================================
echo.

cd /d "%~dp0"

echo Installing Node.js dependencies...
call npm install

echo.
echo Configuration files ready:
echo   - .env file created with your credentials
echo   - Supabase connection configured
echo   - Gemini API key configured
echo   - Local Whisper path: D:\UserProfile\Documents\@ VFC\whisper
echo.

echo =====================================
echo Next Steps:
echo =====================================
echo.
echo 1. Get your Supabase Anon Key and Service Key:
echo    - Go to: https://supabase.com/dashboard/project/zjpgqjbdoqajacibnsih/settings/api
echo    - Copy 'anon public' key to SUPABASE_ANON_KEY in .env
echo    - Copy 'service_role' key to SUPABASE_SERVICE_KEY in .env
echo.
echo 2. Get API keys (optional but recommended):
echo    - OpenWeatherMap: https://openweathermap.org/api
echo    - TomTom Traffic: https://developer.tomtom.com/
echo.
echo 3. Run the database schema:
echo    - Open Supabase SQL Editor
echo    - Run the SQL from: backend/supabase-schema.sql
echo.
echo 4. Verify Whisper installation:
echo    - Check that D:\UserProfile\Documents\@ VFC\whisper exists
echo    - Ensure you have main.exe or whisper.exe in that folder
echo.
echo 5. Start the server:
echo    npm run dev    (development with auto-reload)
echo    npm start      (production mode)
echo.
echo Server will run on: http://localhost:3000
echo.
echo Setup complete!
echo.
pause
