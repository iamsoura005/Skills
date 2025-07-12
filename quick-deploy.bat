@echo off
echo 🚀 DEPLOYING SKILL SWAP PLATFORM TO VERCEL
echo ================================================
echo.

echo ✅ Step 1: Checking Vercel CLI...
where vercel >nul 2>nul
if %errorlevel% neq 0 (
    echo Installing Vercel CLI...
    npm install -g vercel
)

echo.
echo ✅ Step 2: Building application locally...
call npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed! Check the errors above.
    pause
    exit /b 1
)

echo.
echo ✅ Step 3: Deploying to Vercel...
echo Please follow the prompts to login and configure deployment.
echo.
call vercel --prod

echo.
echo 🎉 DEPLOYMENT COMPLETED!
echo Your Skill Swap Platform should now be live!
echo.
pause
