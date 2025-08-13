#!/bin/bash
cd /Users/Anand/github/TSR
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use
npm run dev:enterprise
