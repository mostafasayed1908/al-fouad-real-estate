#!/bin/bash

# 🚀 Al-Fouad Real Estate - Complete Project Setup Script
# This script will recreate the entire project structure

echo "🏗️  Creating Al-Fouad Real Estate project structure..."

# Create project directory
mkdir -p al-fouad-real-estate
cd al-fouad-real-estate

# Create all directories
echo "📁 Creating directories..."
mkdir -p admin
mkdir -p components/figma
mkdir -p components/ui
mkdir -p contexts
mkdir -p docs
mkdir -p guidelines
mkdir -p imports
mkdir -p styles
mkdir -p supabase/functions/server
mkdir -p supabase/migrations
mkdir -p utils/supabase

echo "✅ Directory structure created!"
echo ""
echo "📋 Next steps:"
echo "1. Copy files from Figma Make to the respective folders"
echo "2. Run: npm install"
echo "3. Run: npm run dev"
echo ""
echo "📁 Project structure:"
tree -L 2

echo ""
echo "🎯 Priority files to copy first:"
echo "   1. package.json"
echo "   2. index.html"
echo "   3. main.tsx"
echo "   4. App.tsx"
echo "   5. vite.config.ts"
echo "   6. tsconfig.json"
echo "   7. styles/globals.css"
echo "   8. All files in /components/"
echo "   9. All files in /admin/"
echo "  10. All files in /utils/supabase/"
echo ""
echo "✨ Happy coding!"
