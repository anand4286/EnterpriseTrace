#!/usr/bin/env node

/**
 * Node.js Version Enforcement Script for Enterprise Trace
 * This script runs automatically before npm scripts to ensure version compatibility
 */

const semver = require('semver');
const { execSync } = require('child_process');

// Configuration
const MIN_NODE_VERSION = '18.0.0';
const MIN_NPM_VERSION = '8.0.0';
const RECOMMENDED_NODE_VERSION = '18.18.0';

// ANSI Color codes
const colors = {
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m'
};

function log(color, message) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function getCurrentVersions() {
  try {
    const nodeVersion = process.version.slice(1); // Remove 'v' prefix
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    return { nodeVersion, npmVersion };
  } catch (error) {
    log('red', '❌ Error getting version information');
    process.exit(1);
  }
}

function checkNodeVersion(current, minimum, recommended) {
  if (!semver.gte(current, minimum)) {
    log('red', '\n❌ Node.js version is too old!');
    log('red', `Current: v${current}`);
    log('red', `Required: v${minimum} or higher`);
    log('red', `Recommended: v${recommended}`);
    log('yellow', '\n🔧 Upgrade Options:');
    log('yellow', `1. Using NVM: nvm install ${recommended} && nvm use ${recommended}`);
    log('yellow', '2. Download latest from: https://nodejs.org/');
    log('yellow', '3. Using Homebrew (macOS): brew upgrade node');
    log('yellow', '4. Using package manager (Linux): sudo apt update && sudo apt install nodejs npm');
    console.log('');
    process.exit(1);
  }
  
  if (!semver.eq(current, recommended)) {
    log('yellow', `\n💡 For optimal compatibility, consider using Node.js v${recommended}`);
    log('blue', `Current: v${current} (compatible but not recommended)`);
  }
  
  return true;
}

function checkNpmVersion(current, minimum) {
  if (!semver.gte(current, minimum)) {
    log('red', '\n❌ npm version is too old!');
    log('red', `Current: v${current}`);
    log('red', `Required: v${minimum} or higher`);
    log('yellow', '\n🔧 Upgrade npm:');
    log('yellow', 'npm install -g npm@latest');
    console.log('');
    process.exit(1);
  }
  
  return true;
}

function main() {
  // Skip version check in CI environments (optional)
  if (process.env.CI || process.env.SKIP_NODE_VERSION_CHECK) {
    log('blue', '⏭️  Skipping Node.js version check (CI environment)');
    return;
  }

  const { nodeVersion, npmVersion } = getCurrentVersions();
  
  // Only show header if we're not in quiet mode
  if (!process.env.NODE_VERSION_CHECK_QUIET) {
    log('blue', '🔍 Checking Node.js version compatibility...');
  }
  
  checkNodeVersion(nodeVersion, MIN_NODE_VERSION, RECOMMENDED_NODE_VERSION);
  checkNpmVersion(npmVersion, MIN_NPM_VERSION);
  
  if (!process.env.NODE_VERSION_CHECK_QUIET) {
    log('green', '✅ Node.js and npm versions are compatible!');
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  log('yellow', '\n⚠️  Version check interrupted');
  process.exit(1);
});

process.on('SIGTERM', () => {
  log('yellow', '\n⚠️  Version check terminated');
  process.exit(1);
});

// Run the check
main();
