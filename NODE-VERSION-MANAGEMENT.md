# Node.js Version Management for Enterprise Trace

## 🎯 Overview
Enterprise Trace has specific Node.js version requirements to ensure optimal performance, security, and compatibility across different machines and environments.

## 📋 Version Requirements

### Minimum Requirements
- **Node.js**: 18.0.0 or higher
- **npm**: 8.0.0 or higher

### Recommended Version
- **Node.js**: 18.18.0 (LTS)
- **npm**: Latest stable version

### Why These Versions?
- **Node.js 18+**: Required for modern TypeScript features, ES modules, and security updates
- **npm 8+**: Better package resolution, security fixes, and workspace support
- **LTS Versions**: Long-term support ensures stability and security

## 🔧 Setup Instructions

### For New Machines/Developers

#### Option 1: Using NVM (Recommended)
```bash
# Install NVM (if not already installed)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# Restart terminal or source the profile
source ~/.bashrc  # or ~/.zshrc

# Install and use the recommended Node.js version
nvm install 18.18.0
nvm use 18.18.0
nvm alias default 18.18.0

# Clone and setup the project
git clone <repository-url>
cd EnterpriseTrace
npm run setup
```

#### Option 2: Direct Installation
```bash
# Download Node.js 18.18.0 from https://nodejs.org/
# Or use package managers:

# macOS (Homebrew)
brew install node@18

# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Windows (Chocolatey)
choco install nodejs --version=18.18.0
```

### Automatic Version Checking

The project includes automatic version checking:

```bash
# Check versions manually
npm run check-versions

# Full setup with version check
npm run setup

# All npm scripts automatically check versions
npm install  # Checks version before installing
npm run dev  # Checks version before starting development
npm test     # Checks version before running tests
```

## 🛠 Version Management Files

### `.nvmrc`
```
18.18.0
```
Specifies the exact Node.js version for NVM users.

### `package.json` - Engines Field
```json
{
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```
Enforces minimum version requirements.

### Version Check Scripts
- **`scripts/check-node-version.sh`**: Interactive version checker with upgrade instructions
- **`scripts/enforce-node-version.js`**: Automatic enforcement in npm scripts

## 🚨 Troubleshooting Version Issues

### Problem: "Node.js version too old"
```bash
# Solution 1: Upgrade using NVM
nvm install 18.18.0
nvm use 18.18.0

# Solution 2: Direct download
# Visit https://nodejs.org/ and download Node.js 18.18.0

# Solution 3: Package manager upgrade
# macOS: brew upgrade node
# Linux: Follow installation instructions above
```

### Problem: "npm version too old"
```bash
# Upgrade npm to latest
npm install -g npm@latest

# Or install specific version
npm install -g npm@9.8.0
```

### Problem: Different versions across team members
```bash
# Everyone should use the same .nvmrc file
nvm use  # Uses version from .nvmrc

# Or enforce via package.json engines field
npm config set engine-strict true
```

### Problem: CI/CD Issues
```bash
# Skip version check in CI (if needed)
export SKIP_NODE_VERSION_CHECK=true
npm install

# Or use specific Node.js version in CI
# GitHub Actions example:
# - uses: actions/setup-node@v3
#   with:
#     node-version: '18.18.0'
```

## 🔒 Environment-Specific Configurations

### Development Environment
```bash
# Use exact version for consistency
nvm use 18.18.0
npm install
npm run dev
```

### Production Environment
```bash
# Docker uses specific version
FROM node:18.18.0-alpine
# ... rest of Dockerfile
```

### CI/CD Environment
```yaml
# GitHub Actions example
- name: Setup Node.js
  uses: actions/setup-node@v3
  with:
    node-version: '18.18.0'
    cache: 'npm'
```

## 📊 Version Compatibility Matrix

| Node.js Version | npm Version | Status | Notes |
|----------------|-------------|---------|-------|
| 18.18.0 | 9.8.x | ✅ Recommended | LTS, fully tested |
| 18.17.x | 9.6.x | ✅ Supported | Stable |
| 18.16.x | 9.5.x | ✅ Supported | Stable |
| 18.0.x - 18.15.x | 8.x | ⚠️ Minimum | Basic support |
| 16.x | 8.x | ❌ Not supported | Too old |
| 17.x | 8.x | ❌ Not supported | Odd version |

## 🔧 Advanced Configuration

### Strict Version Enforcement
```bash
# Enable strict engine checking globally
npm config set engine-strict true

# Or per project
echo "engine-strict=true" >> .npmrc
```

### Version Pinning
```json
// package.json - for exact version requirement
{
  "engines": {
    "node": "18.18.0",
    "npm": "9.8.0"
  }
}
```

### Multiple Node.js Versions (Development)
```bash
# Install multiple versions for testing
nvm install 18.16.0
nvm install 18.17.0
nvm install 18.18.0

# Test with different versions
nvm use 18.16.0 && npm test
nvm use 18.17.0 && npm test
nvm use 18.18.0 && npm test
```

## 🚀 Quick Start Commands

```bash
# New team member setup
git clone <repository-url>
cd EnterpriseTrace
nvm use          # Uses .nvmrc version
npm run setup    # Installs with version check

# Daily development
nvm use          # Ensure correct version
npm run dev      # Start development

# Before deployment
npm run check-versions  # Verify environment
npm run build          # Build with version check
```

## 📝 Best Practices

1. **Always use .nvmrc**: Ensures team consistency
2. **Run version checks**: Before important operations
3. **Document version changes**: In commit messages and changelogs
4. **Test with target versions**: Before releases
5. **Update dependencies**: Regularly check for Node.js updates
6. **Use LTS versions**: For production stability
7. **Version lock in CI**: Use exact versions in automation

## 🔗 Additional Resources

- [Node.js Release Schedule](https://nodejs.org/en/about/releases/)
- [NVM Documentation](https://github.com/nvm-sh/nvm)
- [npm Version Management](https://docs.npmjs.com/about-semantic-versioning)
- [Docker Node.js Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)

---

**🏆 Result**: With these configurations, Enterprise Trace will automatically check and enforce Node.js version requirements, preventing compatibility issues across different machines and environments.
