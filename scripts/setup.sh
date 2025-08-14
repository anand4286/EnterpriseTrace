#!/bin/bash

# Enterprise Trace - Complete Setup Script
# This script sets up the entire development environment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

echo -e "${BLUE}"
echo "██████╗ ███╗   ██╗████████╗███████╗██████╗ ██████╗ ██████╗ ██╗███████╗███████╗"
echo "██╔══██╗████╗  ██║╚══██╔══╝██╔════╝██╔══██╗██╔══██╗██╔══██╗██║██╔════╝██╔════╝"
echo "███████║██╔██╗ ██║   ██║   █████╗  ██████╔╝██████╔╝██████╔╝██║███████╗█████╗  "
echo "██╔══██║██║╚██╗██║   ██║   ██╔══╝  ██╔══██╗██╔═══╝ ██╔══██╗██║╚════██║██╔══╝  "
echo "██║  ██║██║ ╚████║   ██║   ███████╗██║  ██║██║     ██║  ██║██║███████║███████╗"
echo "╚═╝  ╚═╝╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝     ╚═╝  ╚═╝╚═╝╚══════╝╚══════╝"
echo -e "${NC}"
echo -e "${PURPLE}Enterprise-Scale Requirement Traceability Matrix System${NC}"
echo "==========================================================="
echo ""

# Step 1: Check Node.js version
echo -e "${BLUE}🔍 Step 1: Checking Node.js Version Compatibility${NC}"
echo "---------------------------------------------------"
if [ -f "scripts/check-node-version.sh" ]; then
    ./scripts/check-node-version.sh
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Node.js version check failed. Please install the correct version.${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⚠️  Version check script not found. Proceeding with caution...${NC}"
fi
echo ""

# Step 2: Install backend dependencies
echo -e "${BLUE}📦 Step 2: Installing Backend Dependencies${NC}"
echo "-------------------------------------------"
if [ -f "package.json" ]; then
    echo "Installing backend packages..."
    npm install
    echo -e "${GREEN}✅ Backend dependencies installed successfully${NC}"
else
    echo -e "${RED}❌ package.json not found in current directory${NC}"
    exit 1
fi
echo ""

# Step 3: Install frontend dependencies
echo -e "${BLUE}🎨 Step 3: Installing Frontend Dependencies${NC}"
echo "--------------------------------------------"
if [ -d "frontend" ] && [ -f "frontend/package.json" ]; then
    echo "Installing frontend packages..."
    cd frontend
    npm install
    cd ..
    echo -e "${GREEN}✅ Frontend dependencies installed successfully${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend directory not found. Skipping frontend setup.${NC}"
fi
echo ""

# Step 4: Check for environment configuration
echo -e "${BLUE}⚙️  Step 4: Environment Configuration${NC}"
echo "------------------------------------"
if [ -f ".env.example" ]; then
    if [ ! -f ".env" ]; then
        echo "Creating .env file from template..."
        cp .env.example .env
        echo -e "${GREEN}✅ Environment file created${NC}"
        echo -e "${YELLOW}💡 Please edit .env file with your database credentials${NC}"
    else
        echo -e "${GREEN}✅ Environment file already exists${NC}"
    fi
else
    echo -e "${YELLOW}⚠️  No .env.example found. You may need to create .env manually.${NC}"
fi
echo ""

# Step 5: Database setup check
echo -e "${BLUE}🗄️  Step 5: Database Setup Check${NC}"
echo "--------------------------------"
if command -v psql &> /dev/null; then
    echo -e "${GREEN}✅ PostgreSQL found${NC}"
else
    echo -e "${YELLOW}⚠️  PostgreSQL not found. Please install PostgreSQL 13+${NC}"
    echo -e "${BLUE}📋 Installation commands:${NC}"
    echo "  macOS: brew install postgresql"
    echo "  Ubuntu: sudo apt install postgresql postgresql-contrib"
    echo "  Windows: Download from https://www.postgresql.org/"
fi

if command -v redis-server &> /dev/null; then
    echo -e "${GREEN}✅ Redis found${NC}"
else
    echo -e "${YELLOW}⚠️  Redis not found. Please install Redis 6+${NC}"
    echo -e "${BLUE}📋 Installation commands:${NC}"
    echo "  macOS: brew install redis"
    echo "  Ubuntu: sudo apt install redis-server"
    echo "  Windows: Download from https://redis.io/"
fi
echo ""

# Step 6: Build check
echo -e "${BLUE}🏗️  Step 6: Build Verification${NC}"
echo "-----------------------------"
echo "Testing TypeScript compilation..."
if npm run build > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Build successful${NC}"
else
    echo -e "${YELLOW}⚠️  Build had warnings or errors. Check above output.${NC}"
fi
echo ""

# Step 7: Development server check
echo -e "${BLUE}🚀 Step 7: Development Server Check${NC}"
echo "-----------------------------------"
echo "Checking if development ports are available..."

# Check if port 3000 is available
if lsof -i :3000 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 3000 is already in use (Frontend)${NC}"
else
    echo -e "${GREEN}✅ Port 3000 available (Frontend)${NC}"
fi

# Check if port 8081 is available
if lsof -i :8081 > /dev/null 2>&1; then
    echo -e "${YELLOW}⚠️  Port 8081 is already in use (Backend)${NC}"
else
    echo -e "${GREEN}✅ Port 8081 available (Backend)${NC}"
fi
echo ""

# Summary
echo -e "${GREEN}🎉 Setup Complete!${NC}"
echo "=================="
echo ""
echo -e "${BLUE}📋 Next Steps:${NC}"
echo "1. Configure your database in .env file"
echo "2. Start PostgreSQL and Redis services"
echo "3. Run database migrations: npm run db:migrate"
echo "4. Start development server: npm run dev"
echo ""
echo -e "${PURPLE}🔗 Useful Commands:${NC}"
echo "  npm run dev           - Start development servers"
echo "  npm run build         - Build for production"
echo "  npm run test          - Run test suite"
echo "  npm run check-versions - Check Node.js compatibility"
echo ""
echo -e "${BLUE}📚 Documentation:${NC}"
echo "  NODE-VERSION-MANAGEMENT.md - Node.js version requirements"
echo "  README.md                  - Complete project documentation"
echo "  API-DOCUMENTATION.md       - API endpoint documentation"
echo ""
echo -e "${GREEN}✨ Enterprise Trace is ready for development!${NC}"
