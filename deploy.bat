@echo off
echo 🚀 Starting Vercel Deployment for Skill Swap Platform
echo.

echo ✅ Step 1: Installing dependencies...
call npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo ✅ Step 2: Building application...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    pause
    exit /b 1
)

echo.
echo ✅ Step 3: Deploying to Vercel...
call vercel --prod --yes
if %errorlevel% neq 0 (
    echo ❌ Deployment failed
    pause
    exit /b 1
)

echo.
echo 🎉 Deployment completed successfully!
echo Your Skill Swap Platform is now live!
echo.
pause
