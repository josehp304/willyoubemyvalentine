#!/bin/bash
set -e

echo "🏗️  Building Valentine App for Vercel..."

# Install dependencies
echo "📦 Installing dependencies..."
npm install --prefix backend
npm install --prefix frontend

# Build backend
echo "🔧 Building backend..."
cd backend && npm run build && cd ..

# Build frontend
echo "⚛️  Building frontend..."
cd frontend && npm run build && cd ..

# Copy backend dist to api folder for Vercel serverless functions
echo "📁 Preparing for Vercel deployment..."
mkdir -p api
cp -r backend/dist/* api/
cp backend/package.json api/
cp backend/package-lock.json api/ 2>/dev/null || true

echo "✅ Build complete! Ready for Vercel deployment."
echo "📝 Run 'vercel' to deploy or 'vercel --prod' for production"
