#!/bin/zsh

# Fix zsh PATH for development tools
echo "Fixing zsh PATH for development tools..."

# Add common paths to zsh configuration
ZSH_CONFIG="$HOME/.zshrc"

# Backup existing .zshrc if it exists
if [ -f "$ZSH_CONFIG" ]; then
    cp "$ZSH_CONFIG" "$ZSH_CONFIG.backup.$(date +%Y%m%d_%H%M%S)"
fi

# Add paths to .zshrc
cat >> "$ZSH_CONFIG" << 'EOF'

# Development tools PATH
export PATH="/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin:/opt/homebrew/sbin:$PATH"

# Node.js and npm (if installed via Homebrew)
if [ -d "/opt/homebrew/bin" ]; then
    export PATH="/opt/homebrew/bin:$PATH"
fi

# Node.js and npm (if installed via nvm)
if [ -f "$HOME/.nvm/nvm.sh" ]; then
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
fi

# Standard macOS paths
export PATH="/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin:$PATH"

EOF

echo "Updated $ZSH_CONFIG with proper PATH configuration"
echo "Please restart your terminal or run: source ~/.zshrc"
echo ""
echo "Current session PATH has been updated temporarily."

# Update PATH for current session
export PATH="/usr/local/bin:/usr/bin:/bin:/opt/homebrew/bin:/opt/homebrew/sbin:$PATH"

echo "Checking npm availability:"
which npm && npm --version || echo "npm not found - you may need to install Node.js"
