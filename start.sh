#!/bin/bash
# Start backend server
node server.js > server.log 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID $BACKEND_PID"

# Start frontend Vite server
npx vite --port 3001 --host > vite.log 2>&1 &
FRONTEND_PID=$!
echo "Frontend started with PID $FRONTEND_PID"

sleep 3
echo "Checking backend status..."
curl -s http://localhost:3002/api/health || echo "Backend check failed"
echo "\nChecking frontend status..."
curl -sI http://localhost:3001 || echo "Frontend check failed"
