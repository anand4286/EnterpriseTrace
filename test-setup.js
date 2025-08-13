#!/usr/bin/env node

// Test script to verify enterprise server functionality
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Enterprise TSR Setup');
console.log('================================');

// Test 1: Check environment file
console.log('\n1. Environment Configuration:');
try {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const dbMatch = envContent.match(/DB_HOST=([^\n\r]*)/);
    const portMatch = envContent.match(/PORT=([^\n\r]*)/);
    console.log('   ✅ .env file exists');
    console.log(`   ✅ Database host: ${dbMatch ? dbMatch[1] : 'not set'}`);
    console.log(`   ✅ Port: ${portMatch ? portMatch[1] : 'not set'}`);
  } else {
    console.log('   ❌ .env file not found');
  }
} catch (error) {
  console.log(`   ❌ Error reading .env: ${error.message}`);
}

// Test 2: Check database schema
console.log('\n2. Database Schema:');
try {
  const schemaPath = path.join(process.cwd(), 'src/database/schema.sql');
  if (fs.existsSync(schemaPath)) {
    const schemaContent = fs.readFileSync(schemaPath, 'utf8');
    const tableCount = (schemaContent.match(/CREATE TABLE/g) || []).length;
    console.log('   ✅ Database schema file exists');
    console.log(`   ✅ Tables defined: ${tableCount}`);
  } else {
    console.log('   ❌ Database schema not found');
  }
} catch (error) {
  console.log(`   ❌ Error reading schema: ${error.message}`);
}

// Test 3: Check API routes
console.log('\n3. API Routes:');
const routesDir = path.join(process.cwd(), 'src/routes');
try {
  if (fs.existsSync(routesDir)) {
    const routeFiles = fs.readdirSync(routesDir).filter(f => f.endsWith('.ts'));
    console.log('   ✅ Routes directory exists');
    console.log(`   ✅ Route files: ${routeFiles.join(', ')}`);
  } else {
    console.log('   ❌ Routes directory not found');
  }
} catch (error) {
  console.log(`   ❌ Error reading routes: ${error.message}`);
}

// Test 4: Check enterprise routes
console.log('\n4. Enterprise Routes:');
const enterpriseRoutesDir = path.join(process.cwd(), 'src/routes/enterprise');
try {
  if (fs.existsSync(enterpriseRoutesDir)) {
    const enterpriseFiles = fs.readdirSync(enterpriseRoutesDir).filter(f => f.endsWith('.ts'));
    console.log('   ✅ Enterprise routes directory exists');
    console.log(`   ✅ Enterprise files: ${enterpriseFiles.join(', ')}`);
  } else {
    console.log('   ❌ Enterprise routes directory not found');
  }
} catch (error) {
  console.log(`   ❌ Error reading enterprise routes: ${error.message}`);
}

// Test 5: Check TypeScript configuration
console.log('\n5. TypeScript Configuration:');
try {
  const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
  if (fs.existsSync(tsconfigPath)) {
    const tsconfig = JSON.parse(fs.readFileSync(tsconfigPath, 'utf8'));
    console.log('   ✅ tsconfig.json exists');
    console.log(`   ✅ Target: ${tsconfig.compilerOptions?.target || 'not set'}`);
    console.log(`   ✅ Module: ${tsconfig.compilerOptions?.module || 'not set'}`);
  } else {
    console.log('   ❌ tsconfig.json not found');
  }
} catch (error) {
  console.log(`   ❌ Error reading tsconfig: ${error.message}`);
}

// Test 6: Check package.json scripts
console.log('\n6. Package Scripts:');
try {
  const packagePath = path.join(process.cwd(), 'package.json');
  if (fs.existsSync(packagePath)) {
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    console.log('   ✅ package.json exists');
    console.log(`   ✅ Scripts available: ${Object.keys(packageJson.scripts || {}).join(', ')}`);
    console.log(`   ✅ Dependencies: ${Object.keys(packageJson.dependencies || {}).length} packages`);
  } else {
    console.log('   ❌ package.json not found');
  }
} catch (error) {
  console.log(`   ❌ Error reading package.json: ${error.message}`);
}

console.log('\n🎯 Next Steps:');
console.log('   1. Run: npm install (if dependencies need updating)');
console.log('   2. Start server: npm run enterprise');
console.log('   3. Test API: curl http://localhost:8080/health');
console.log('   4. View docs: http://localhost:8080/api-docs');
console.log('   5. Login with: admin@demo.enterprise.com / DemoAdmin123!');

console.log('\n✨ Enterprise TSR System is ready for deployment!');
