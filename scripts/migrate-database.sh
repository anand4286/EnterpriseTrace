#!/bin/bash

# Database Migration Script for Enterprise TSR System

set -e

echo "🗄️  Enterprise TSR Database Migration"
echo "=================================="

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install PostgreSQL first."
    echo "   brew install postgresql (macOS)"
    echo "   sudo apt-get install postgresql (Ubuntu)"
    exit 1
fi

# Check if Redis is installed
if ! command -v redis-cli &> /dev/null; then
    echo "❌ Redis is not installed. Please install Redis first."
    echo "   brew install redis (macOS)"
    echo "   sudo apt-get install redis-server (Ubuntu)"
    exit 1
fi

# Load environment variables
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi

# Set default values if not provided
DB_HOST=${DB_HOST:-localhost}
DB_PORT=${DB_PORT:-5432}
DB_NAME=${DB_NAME:-tsr_enterprise}
DB_USER=${DB_USER:-postgres}
DB_PASSWORD=${DB_PASSWORD:-postgres}

echo "📊 Database Configuration:"
echo "   Host: $DB_HOST"
echo "   Port: $DB_PORT"
echo "   Database: $DB_NAME"
echo "   User: $DB_USER"

# Check PostgreSQL connection
echo ""
echo "🔍 Checking PostgreSQL connection..."
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d postgres -c '\q' 2>/dev/null; then
    echo "✅ PostgreSQL connection successful"
else
    echo "❌ Cannot connect to PostgreSQL. Please check your configuration."
    echo "   Make sure PostgreSQL is running and credentials are correct."
    exit 1
fi

# Check if database exists
echo ""
echo "🗄️  Checking if database exists..."
if PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -lqt | cut -d \| -f 1 | grep -qw $DB_NAME; then
    echo "✅ Database '$DB_NAME' exists"
    
    echo ""
    read -p "🤔 Database already exists. Do you want to recreate it? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🗑️  Dropping existing database..."
        PGPASSWORD=$DB_PASSWORD dropdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME
        echo "✅ Database dropped"
    else
        echo "⏭️  Skipping database creation"
        exit 0
    fi
fi

# Create database
echo ""
echo "🏗️  Creating database '$DB_NAME'..."
PGPASSWORD=$DB_PASSWORD createdb -h $DB_HOST -p $DB_PORT -U $DB_USER $DB_NAME
echo "✅ Database created successfully"

# Run schema migration
echo ""
echo "📋 Running database schema migration..."
if [ -f "src/database/schema.sql" ]; then
    PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -f src/database/schema.sql
    echo "✅ Schema migration completed"
else
    echo "❌ Schema file not found: src/database/schema.sql"
    exit 1
fi

# Check Redis connection
echo ""
echo "🔍 Checking Redis connection..."
if redis-cli ping > /dev/null 2>&1; then
    echo "✅ Redis connection successful"
else
    echo "⚠️  Cannot connect to Redis. Starting Redis server..."
    if command -v brew &> /dev/null; then
        brew services start redis
    else
        sudo systemctl start redis-server
    fi
    
    # Wait a moment and check again
    sleep 2
    if redis-cli ping > /dev/null 2>&1; then
        echo "✅ Redis started successfully"
    else
        echo "❌ Failed to start Redis. Please start it manually."
    fi
fi

# Verify database tables
echo ""
echo "🔍 Verifying database tables..."
TABLE_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';")
echo "✅ Created $TABLE_COUNT tables"

# Show sample data
echo ""
echo "📊 Sample data verification:"
ORG_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM organizations;")
echo "   Organizations: $ORG_COUNT"

PERM_COUNT=$(PGPASSWORD=$DB_PASSWORD psql -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME -t -c "SELECT COUNT(*) FROM permissions;")
echo "   Permissions: $PERM_COUNT"

echo ""
echo "🎉 Database migration completed successfully!"
echo ""
echo "📝 Next steps:"
echo "   1. Copy .env.example to .env and update configuration"
echo "   2. Start the enterprise server: npm run enterprise"
echo "   3. Run the demo: npm run enterprise:demo"
echo ""
echo "🌐 Access points:"
echo "   • API Server: http://localhost:8080"
echo "   • API Docs: http://localhost:8080/api-docs"
echo "   • Health Check: http://localhost:8080/health"
