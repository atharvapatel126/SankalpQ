#!/usr/bin/env bash

# ==============================================================================
# SankalpQ - Startup Script
# ==============================================================================

# Ensure script runs from the project root directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR" || exit 1

# Color definitions
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}======================================${NC}"
echo -e "${BLUE}   Starting SankalpQ Web Application  ${NC}"
echo -e "${BLUE}======================================${NC}"

# Check for Node.js
if ! command -v node &> /dev/null; then
    echo -e "${RED}[ERROR] Node.js is not installed or not in PATH.${NC}"
    echo -e "${YELLOW}Please install Node.js from https://nodejs.org/${NC}"
    exit 1
fi

# Check for npm
if ! command -v npm &> /dev/null; then
    echo -e "${RED}[ERROR] npm is not installed or not in PATH.${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js version: $(node -v)${NC}"
echo -e "${GREEN}✓ npm version:     $(npm -v)${NC}"

# Check if node_modules exists, otherwise install dependencies
if [ ! -d "node_modules" ]; then
    echo -e "\n${YELLOW}[!] node_modules not found. Installing dependencies...${NC}"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}[ERROR] Failed to install dependencies.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Dependencies installed successfully.${NC}"
fi

# Handle command-line arguments
MODE="${1:-dev}"

case "$MODE" in
    prod|production|start)
        echo -e "\n${BLUE}Building and starting production server...${NC}"
        npm run build && npm run start
        ;;
    build)
        echo -e "\n${BLUE}Building application...${NC}"
        npm run build
        ;;
    lint)
        echo -e "\n${BLUE}Running linter...${NC}"
        npm run lint
        ;;
    dev|*)
        echo -e "\n${GREEN}Starting development server at http://localhost:3000 ...${NC}"
        echo -e "${YELLOW}Press Ctrl+C to stop the server.${NC}\n"
        npm run dev
        ;;
esac
