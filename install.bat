@echo off
echo ========================================
echo    Skill Swap Platform - Quick Install
echo ========================================
echo.

echo Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed or not in PATH
    echo.
    echo Please follow these steps:
    echo 1. Go to https://nodejs.org
    echo 2. Download and install the LTS version
    echo 3. Restart your computer
    echo 4. Run this script again
    echo.
    pause
    exit /b 1
)

echo Node.js found! Version:
node --version

echo.
echo Checking npm...
npm --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: npm is not available
    echo Please reinstall Node.js
    pause
    exit /b 1
)

echo npm found! Version:
npm --version

echo.
echo Installing project dependencies...
echo This may take 2-3 minutes...
echo.

npm install
if %errorlevel% neq 0 (
    echo.
    echo ERROR: Failed to install dependencies
    echo Try running as Administrator
    pause
    exit /b 1
)

echo.
echo Setting up environment file...
if not exist .env.local (
    if exist .env.local.example (
        copy .env.local.example .env.local >nul
        echo Created .env.local from example
    ) else (
        echo # Supabase Configuration > .env.local
        echo NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url >> .env.local
        echo NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key >> .env.local
        echo SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key >> .env.local
        echo. >> .env.local
        echo # App Configuration >> .env.local
        echo NEXT_PUBLIC_APP_URL=http://localhost:3000 >> .env.local
        echo Created .env.local file
    )
) else (
    echo .env.local already exists
)

echo.
echo ========================================
echo           SETUP COMPLETE!
echo ========================================
echo.
echo Next steps:
echo 1. Set up your Supabase database:
echo    - Go to https://supabase.com
echo    - Create a new project
echo    - Run the SQL from database/schema.sql
echo    - Update .env.local with your credentials
echo.
echo 2. Start the development server:
echo    npm run dev
echo.
echo 3. Open your browser to:
echo    http://localhost:3000
echo.
echo For detailed instructions, see:
echo FOLLOW_THESE_EXACT_STEPS.md
echo.

set /p start="Would you like to start the development server now? (y/n): "
if /i "%start%"=="y" (
    echo.
    echo Starting development server...
    echo Press Ctrl+C to stop the server
    echo.
    npm run dev
)

echo.
echo Setup completed successfully!
pause
