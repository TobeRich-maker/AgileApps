#!/bin/bash

echo "🚀 Setting up SprintFlow Laravel Backend..."

# Install dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Create database (MySQL)
echo "📊 Setting up database..."
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS sprintflow;"

# Run migrations
php artisan migrate

# Seed database with sample data
php artisan db:seed

# Install Laravel Sanctum
php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

# Clear caches
php artisan config:clear
php artisan cache:clear
php artisan route:clear

echo "✅ Backend setup complete!"
echo ""
echo "🔧 Next steps:"
echo "1. Update your .env file with correct database credentials"
echo "2. Run: php artisan serve"
echo "3. API will be available at: http://localhost:8000/api"
echo ""
echo "📚 Default users created:"
echo "- john@example.com / password (Developer)"
echo "- jane@example.com / password (Scrum Master)"  
echo "- mike@example.com / password (Product Owner)"
echo "- sarah@example.com / password (Designer)"
echo "- admin@example.com / password (Admin)"
