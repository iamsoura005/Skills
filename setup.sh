#!/bin/bash

# Skill Swap Platform Setup Script for macOS/Linux
# Make this file executable: chmod +x setup.sh
# Run with: ./setup.sh

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${GREEN}=== Skill Swap Platform Setup ===${NC}"
echo -e "${YELLOW}This script will help you set up the Skill Swap Platform${NC}"

# Function to check if a command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check if Node.js is installed
echo -e "\n${BLUE}Checking Node.js installation...${NC}"
if command_exists node; then
    NODE_VERSION=$(node --version)
    echo -e "${GREEN}Node.js is installed: $NODE_VERSION${NC}"
    
    # Check if version is recent enough (v16+)
    NODE_MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR_VERSION" -lt 16 ]; then
        echo -e "${YELLOW}Warning: Node.js version is older than v16. Consider upgrading.${NC}"
    fi
else
    echo -e "${RED}Node.js is not installed.${NC}"
    echo -e "${YELLOW}Please install Node.js from https://nodejs.org/ or use a package manager:${NC}"
    
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo -e "${YELLOW}For macOS: brew install node${NC}"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo -e "${YELLOW}For Ubuntu/Debian: curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash - && sudo apt-get install -y nodejs${NC}"
    fi
    
    read -p "Would you like to open the Node.js download page? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if command_exists open; then
            open "https://nodejs.org/"
        elif command_exists xdg-open; then
            xdg-open "https://nodejs.org/"
        fi
    fi
    
    echo -e "${YELLOW}Please install Node.js and run this script again.${NC}"
    exit 1
fi

# Check if npm is available
echo -e "\n${BLUE}Checking npm...${NC}"
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    echo -e "${GREEN}npm is available: $NPM_VERSION${NC}"
else
    echo -e "${RED}npm is not available. Please reinstall Node.js.${NC}"
    exit 1
fi

# Check if we're in the correct directory
echo -e "\n${BLUE}Checking project structure...${NC}"
if [ -f "package.json" ]; then
    echo -e "${GREEN}Found package.json - we're in the right directory${NC}"
else
    echo -e "${RED}package.json not found. Please navigate to the project directory first.${NC}"
    exit 1
fi

# Install dependencies
echo -e "\n${BLUE}Installing project dependencies...${NC}"
echo -e "${YELLOW}This may take a few minutes...${NC}"

if npm install; then
    echo -e "${GREEN}Dependencies installed successfully!${NC}"
else
    echo -e "${RED}Failed to install dependencies. Please check your internet connection and try again.${NC}"
    exit 1
fi

# Check if .env.local exists
echo -e "\n${BLUE}Checking environment configuration...${NC}"
if [ -f ".env.local" ]; then
    echo -e "${YELLOW}.env.local already exists${NC}"
else
    if [ -f ".env.local.example" ]; then
        cp ".env.local.example" ".env.local"
        echo -e "${GREEN}Created .env.local from example file${NC}"
    else
        echo -e "${YELLOW}Creating .env.local file...${NC}"
        cat > .env.local << EOF
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF
        echo -e "${GREEN}Created .env.local file${NC}"
    fi
fi

# Make sure the file is not executable for security
chmod 600 .env.local

# Display next steps
echo -e "\n${GREEN}=== Setup Complete! ===${NC}"
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "${NC}1. Set up your Supabase database:${NC}"
echo -e "   ${BLUE}- Go to https://supabase.com and create a new project${NC}"
echo -e "   ${BLUE}- Run the SQL from database/schema.sql in your Supabase SQL editor${NC}"
echo -e "   ${BLUE}- Optionally run database/sample-data.sql for sample data${NC}"

echo -e "\n${NC}2. Update your environment variables:${NC}"
echo -e "   ${BLUE}- Edit .env.local with your Supabase URL and keys${NC}"

echo -e "\n${NC}3. Start the development server:${NC}"
echo -e "   ${GREEN}npm run dev${NC}"

echo -e "\n${NC}4. Open your browser to:${NC}"
echo -e "   ${GREEN}http://localhost:3000${NC}"

echo -e "\n${YELLOW}For detailed setup instructions, see SETUP_GUIDE.md${NC}"

# Ask if user wants to start the dev server
echo
read -p "Would you like to start the development server now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "\n${BLUE}Starting development server...${NC}"
    echo -e "${YELLOW}Press Ctrl+C to stop the server${NC}"
    npm run dev
fi

echo -e "\n${GREEN}Setup script completed!${NC}"
