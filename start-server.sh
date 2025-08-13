#!/bin/bash

echo "🚀 Starting Enterprise TSR Server..."

# Fix PATH to include Homebrew
export PATH="/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:$PATH"

# Check if Node.js is available
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found in PATH"
    exit 1
fi

# Check if npm is available
if ! command -v npm &> /dev/null; then
    echo "❌ npm not found in PATH"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"
echo "✅ npm version: $(npm -v)"

# Check if PostgreSQL is running
if ! pgrep -f postgres > /dev/null; then
    echo "⚠️  PostgreSQL not running, attempting to start..."
    brew services start postgresql@15
fi

# Check if Redis is running
if ! pgrep -f redis > /dev/null; then
    echo "⚠️  Redis not running, attempting to start..."
    brew services start redis
fi

# Start both backend and frontend
echo "🔄 Starting Enterprise TSR Server (Backend)..."
npm run enterprise &
BACKEND_PID=$!

echo "🔄 Starting React Frontend..."
cd frontend && npm start &
FRONTEND_PID=$!

echo "✅ Backend running on http://localhost:8080 (PID: $BACKEND_PID)"
echo "✅ Frontend running on http://localhost:3000 (PID: $FRONTEND_PID)"
echo ""
echo "🌐 Open http://localhost:3000 in your browser"
echo "📡 Backend API available at http://localhost:8080"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for both processes and handle cleanup
cleanup() {
    echo ""
    echo "🛑 Stopping servers..."
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

# Wait for both processes
wait
