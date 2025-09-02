#!/bin/bash

echo "🚀 Setting up tRPC Notes API..."
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Check if .env file exists
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please update .env file with your database credentials before continuing"
    echo "   DATABASE_URL should point to your Supabase Postgres database"
    echo ""
    echo "   Example:"
    echo "   DATABASE_URL=\"postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres\""
    echo ""
    read -p "Press Enter after updating .env file..."
else
    echo "✅ .env file already exists"
fi

# Check if DATABASE_URL is set
if grep -q "DATABASE_URL=" .env && ! grep -q "DATABASE_URL=\"postgresql://username:password@host:port/database\"" .env; then
    echo "✅ DATABASE_URL is configured"
    
    # Push database schema
    echo "🗄️  Pushing database schema..."
    npm run db:push
    
    # Ask if user wants to seed the database
    read -p "Do you want to seed the database with sample data? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🌱 Seeding database..."
        npm run db:seed
    fi
else
    echo "⚠️  DATABASE_URL not configured. Please update .env file and run:"
    echo "   npm run db:push"
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Start the development server: npm run dev"
echo "2. Test the API: npm run test:client"
echo "3. View API docs at: http://localhost:3000/trpc"
echo "4. Health check: http://localhost:3000/health"
echo ""
echo "Happy coding! 🚀" 