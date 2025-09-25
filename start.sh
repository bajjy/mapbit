#!/bin/bash

echo "🗺️ Starting OSM RPG Map Converter..."
echo

echo "📦 Installing dependencies..."
npm run install:all

echo
echo "🚀 Starting development servers..."
echo "Server will be available at: http://localhost:3001"
echo "Client will be available at: http://localhost:3000"
echo

npm run dev
