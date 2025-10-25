#!/bin/bash

# Filipino Mobile Assistant - Installation Script
# This script automates the setup process

echo "🚀 Filipino Mobile Assistant - Setup Script"
echo "=========================================="
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Node.js is installed
echo "📦 Checking Node.js..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo "Please install Node.js 18+ from https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v)
echo -e "${GREEN}✅ Node.js $NODE_VERSION found${NC}"
echo ""

# Check if npm is installed
echo "📦 Checking npm..."
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed!${NC}"
    exit 1
fi

NPM_VERSION=$(npm -v)
echo -e "${GREEN}✅ npm $NPM_VERSION found${NC}"
echo ""

# Setup Backend
echo "🔧 Setting up Backend..."
cd backend

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Backend package.json not found!${NC}"
    exit 1
fi

echo "Installing backend dependencies..."
npm install

if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit backend/.env and add your API keys${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

echo -e "${GREEN}✅ Backend setup complete!${NC}"
echo ""

# Setup Mobile App
echo "📱 Setting up Mobile App..."
cd ../mobile-app

if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Mobile app package.json not found!${NC}"
    exit 1
fi

echo "Installing mobile app dependencies..."
npm install

# Check if Expo CLI is installed globally
if ! command -v expo &> /dev/null; then
    echo "Installing Expo CLI globally..."
    npm install -g expo-cli
fi

if [ ! -f ".env" ]; then
    echo "Creating .env file from template..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit mobile-app/.env and add your configuration${NC}"
else
    echo -e "${GREEN}✅ .env file already exists${NC}"
fi

echo -e "${GREEN}✅ Mobile app setup complete!${NC}"
echo ""

# Final instructions
echo "=========================================="
echo -e "${GREEN}🎉 Installation Complete!${NC}"
echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Get your API keys (see SETUP_GUIDE.md)"
echo "   - Google Gemini API"
echo "   - Supabase (create project)"
echo "   - OpenWeatherMap API"
echo "   - TomTom Traffic API"
echo "   - OpenAI API"
echo ""
echo "2. Setup Supabase database:"
echo "   - Run backend/supabase-schema.sql in Supabase SQL Editor"
echo ""
echo "3. Configure environment variables:"
echo "   - Edit backend/.env"
echo "   - Edit mobile-app/.env"
echo ""
echo "4. Start the backend server:"
echo "   cd backend && npm run dev"
echo ""
echo "5. Start the mobile app (in new terminal):"
echo "   cd mobile-app && npm start"
echo ""
echo "📖 For detailed setup instructions, see SETUP_GUIDE.md"
echo ""
echo "Happy coding! 🚀"
