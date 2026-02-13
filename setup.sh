#!/bin/bash

echo "🚀 Setting up Will You Be My Valentine app..."

# Check if .env exists in backend
if [ ! -f backend/.env ]; then
    echo "⚠️  Creating backend/.env from example..."
    cp backend/.env.example backend/.env
    echo "✏️  Please edit backend/.env and add your Neon DB connection string!"
else
    echo "✅ backend/.env already exists"
fi

# Check if .env exists in frontend
if [ ! -f frontend/.env ]; then
    echo "⚠️  Creating frontend/.env from example..."
    cp frontend/.env.example frontend/.env
    echo "✅ frontend/.env created"
else
    echo "✅ frontend/.env already exists"
fi

echo ""
echo "📦 Installing dependencies..."
echo ""

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend && npm install
cd ..

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend && npm install
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "📝 Next steps:"
echo "1. Add your Neon DB connection string to backend/.env"
echo "2. Start the backend: cd backend && npm run dev"
echo "3. In a new terminal, start the frontend: cd frontend && npm run dev"
echo ""
echo "💝 Happy Valentine's Day!"
