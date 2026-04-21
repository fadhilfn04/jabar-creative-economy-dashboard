#!/bin/bash

# Script to run database migrations
# Usage: ./scripts/migrate.sh

set -e

# Load environment variables
if [ -f .env.local ]; then
  export $(cat .env.local | grep -v '^#' | xargs)
else
  echo "Error: .env.local file not found"
  exit 1
fi

# Check if psql is installed
if ! command -v psql &> /dev/null; then
  echo "Error: psql is not installed. Please install PostgreSQL client tools."
  exit 1
fi

echo "Running database migrations..."

# Run the users table migration
echo "Creating users table..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f scripts/create-users-table.sql

echo "Migration completed successfully!"
echo ""
echo "⚠️  IMPORTANT: Please change the default admin password!"
echo "Default admin email: admin@ekraf.jabarprov.go.id"
echo "Default admin password: admin123 (CHANGE THIS!)"