#!/bin/bash

# Node.js Version Check Script for Enterprise Trace
# This script checks if the current Node.js version meets the minimum requirements

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Minimum required versions
MIN_NODE_VERSION="18.0.0"
MIN_NPM_VERSION="8.0.0"
RECOMMENDED_NODE_VERSION="18.18.0"

echo -e "${BLUE}🔍 Enterprise Trace - Node.js Version Check${NC}"
echo "=================================================="

# Function to compare version numbers
version_compare() {
    if [[ $1 == $2 ]]; then
        return 0
    fi
    local IFS=.
    local i ver1=($1) ver2=($2)
    # fill empty fields in ver1 with zeros
    for ((i=${#ver1[@]}; i<${#ver2[@]}; i++)); do
        ver1[i]=0
    done
    for ((i=0; i<${#ver1[@]}; i++)); do
        if [[ -z ${ver2[i]} ]]; then
            # fill empty fields in ver2 with zeros
            ver2[i]=0
        fi
        if ((10#${ver1[i]} > 10#${ver2[i]})); then
            return 1
        fi
        if ((10#${ver1[i]} < 10#${ver2[i]})); then
            return 2
        fi
    done
    return 0
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed!${NC}"
    echo ""
    echo -e "${YELLOW}📦 Installation Options:${NC}"
    echo "1. Download from: https://nodejs.org/"
    echo "2. Using NVM: nvm install $RECOMMENDED_NODE_VERSION"
    echo "3. Using Homebrew (macOS): brew install node"
    echo "4. Using package manager (Linux): sudo apt install nodejs npm"
    echo ""
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo -e "${RED}❌ npm is not installed!${NC}"
    echo "npm should come with Node.js installation."
    exit 1
fi

# Get current versions
CURRENT_NODE_VERSION=$(node --version | sed 's/v//')
CURRENT_NPM_VERSION=$(npm --version)

echo -e "${BLUE}📋 Current Versions:${NC}"
echo "Node.js: v$CURRENT_NODE_VERSION"
echo "npm: v$CURRENT_NPM_VERSION"
echo ""

# Check Node.js version
version_compare $CURRENT_NODE_VERSION $MIN_NODE_VERSION
node_result=$?

if [ $node_result -eq 2 ]; then
    echo -e "${RED}❌ Node.js version too old!${NC}"
    echo "Current: v$CURRENT_NODE_VERSION"
    echo "Required: v$MIN_NODE_VERSION or higher"
    echo "Recommended: v$RECOMMENDED_NODE_VERSION"
    echo ""
    echo -e "${YELLOW}🔧 Upgrade Options:${NC}"
    echo "1. Using NVM: nvm install $RECOMMENDED_NODE_VERSION && nvm use $RECOMMENDED_NODE_VERSION"
    echo "2. Download latest from: https://nodejs.org/"
    echo "3. Using Homebrew (macOS): brew upgrade node"
    echo ""
    exit 1
else
    echo -e "${GREEN}✅ Node.js version is compatible${NC}"
fi

# Check npm version
version_compare $CURRENT_NPM_VERSION $MIN_NPM_VERSION
npm_result=$?

if [ $npm_result -eq 2 ]; then
    echo -e "${RED}❌ npm version too old!${NC}"
    echo "Current: v$CURRENT_NPM_VERSION"
    echo "Required: v$MIN_NPM_VERSION or higher"
    echo ""
    echo -e "${YELLOW}🔧 Upgrade npm:${NC}"
    echo "npm install -g npm@latest"
    echo ""
    exit 1
else
    echo -e "${GREEN}✅ npm version is compatible${NC}"
fi

# Check if current version matches recommended
version_compare $CURRENT_NODE_VERSION $RECOMMENDED_NODE_VERSION
recommended_result=$?

if [ $recommended_result -ne 0 ]; then
    echo ""
    echo -e "${YELLOW}💡 Recommendation:${NC}"
    echo "For optimal compatibility, consider using Node.js v$RECOMMENDED_NODE_VERSION"
    echo "This is the version tested with Enterprise Trace."
    echo ""
    echo -e "${BLUE}🔧 Switch to recommended version:${NC}"
    echo "nvm use $RECOMMENDED_NODE_VERSION"
fi

echo ""
echo -e "${GREEN}🎉 All version requirements are satisfied!${NC}"
echo -e "${BLUE}🚀 You can now run: npm install && npm run dev${NC}"
echo ""
