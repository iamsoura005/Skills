# Skill Swap Platform Setup Script for Windows
# Run this script in PowerShell as Administrator

Write-Host "=== Skill Swap Platform Setup ===" -ForegroundColor Green
Write-Host "This script will help you set up the Skill Swap Platform" -ForegroundColor Yellow

# Check if running as administrator
$currentPrincipal = New-Object Security.Principal.WindowsPrincipal([Security.Principal.WindowsIdentity]::GetCurrent())
$isAdmin = $currentPrincipal.IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "Please run this script as Administrator" -ForegroundColor Red
    exit 1
}

# Function to check if a command exists
function Test-Command($cmdname) {
    return [bool](Get-Command -Name $cmdname -ErrorAction SilentlyContinue)
}

# Check if Node.js is installed
Write-Host "`nChecking Node.js installation..." -ForegroundColor Blue
if (Test-Command "node") {
    $nodeVersion = node --version
    Write-Host "Node.js is installed: $nodeVersion" -ForegroundColor Green
} else {
    Write-Host "Node.js is not installed. Please install it from https://nodejs.org/" -ForegroundColor Red
    Write-Host "Download the LTS version and run the installer." -ForegroundColor Yellow
    
    $response = Read-Host "Would you like to open the Node.js download page? (y/n)"
    if ($response -eq "y" -or $response -eq "Y") {
        Start-Process "https://nodejs.org/"
    }
    
    Write-Host "Please install Node.js and run this script again." -ForegroundColor Yellow
    exit 1
}

# Check if npm is available
Write-Host "`nChecking npm..." -ForegroundColor Blue
if (Test-Command "npm") {
    $npmVersion = npm --version
    Write-Host "npm is available: $npmVersion" -ForegroundColor Green
} else {
    Write-Host "npm is not available. Please reinstall Node.js." -ForegroundColor Red
    exit 1
}

# Check if we're in the correct directory
Write-Host "`nChecking project structure..." -ForegroundColor Blue
if (Test-Path "package.json") {
    Write-Host "Found package.json - we're in the right directory" -ForegroundColor Green
} else {
    Write-Host "package.json not found. Please navigate to the project directory first." -ForegroundColor Red
    exit 1
}

# Install dependencies
Write-Host "`nInstalling project dependencies..." -ForegroundColor Blue
Write-Host "This may take a few minutes..." -ForegroundColor Yellow

try {
    npm install
    Write-Host "Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "Failed to install dependencies. Please check your internet connection and try again." -ForegroundColor Red
    exit 1
}

# Check if .env.local exists
Write-Host "`nChecking environment configuration..." -ForegroundColor Blue
if (Test-Path ".env.local") {
    Write-Host ".env.local already exists" -ForegroundColor Yellow
} else {
    if (Test-Path ".env.local.example") {
        Copy-Item ".env.local.example" ".env.local"
        Write-Host "Created .env.local from example file" -ForegroundColor Green
    } else {
        Write-Host "Creating .env.local file..." -ForegroundColor Yellow
        $envContent = @"
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
"@
        $envContent | Out-File -FilePath ".env.local" -Encoding UTF8
        Write-Host "Created .env.local file" -ForegroundColor Green
    }
}

# Display next steps
Write-Host "`n=== Setup Complete! ===" -ForegroundColor Green
Write-Host "`nNext steps:" -ForegroundColor Yellow
Write-Host "1. Set up your Supabase database:" -ForegroundColor White
Write-Host "   - Go to https://supabase.com and create a new project" -ForegroundColor Gray
Write-Host "   - Run the SQL from database/schema.sql in your Supabase SQL editor" -ForegroundColor Gray
Write-Host "   - Optionally run database/sample-data.sql for sample data" -ForegroundColor Gray

Write-Host "`n2. Update your environment variables:" -ForegroundColor White
Write-Host "   - Edit .env.local with your Supabase URL and keys" -ForegroundColor Gray

Write-Host "`n3. Start the development server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Cyan

Write-Host "`n4. Open your browser to:" -ForegroundColor White
Write-Host "   http://localhost:3000" -ForegroundColor Cyan

Write-Host "`nFor detailed setup instructions, see SETUP_GUIDE.md" -ForegroundColor Yellow

# Ask if user wants to start the dev server
Write-Host "`n" -NoNewline
$startServer = Read-Host "Would you like to start the development server now? (y/n)"
if ($startServer -eq "y" -or $startServer -eq "Y") {
    Write-Host "`nStarting development server..." -ForegroundColor Blue
    Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
    npm run dev
}

Write-Host "`nSetup script completed!" -ForegroundColor Green
