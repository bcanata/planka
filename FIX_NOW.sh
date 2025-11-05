#!/bin/bash
# Emergency fix script for Planka database migration issue
# Run this on your Dokploy server via SSH

set -e

echo "========================================="
echo "Planka Database Volume Reset Script"
echo "========================================="
echo ""
echo "⚠️  WARNING: This will DELETE all data in the Planka database!"
echo ""
read -p "Are you sure you want to continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo "Aborted."
    exit 1
fi

echo ""
echo "Step 1: Stopping containers..."
docker compose -p school-planka-occofj down || docker stop school-planka-occofj-planka-1 school-planka-occofj-postgres-1 2>/dev/null || true

echo ""
echo "Step 2: Removing containers..."
docker rm -f school-planka-occofj-planka-1 school-planka-occofj-postgres-1 2>/dev/null || true

echo ""
echo "Step 3: Deleting database volume..."
docker volume rm school-planka-occofj_db-data

echo ""
echo "Step 4: Verifying volume is gone..."
if docker volume ls | grep -q "school-planka-occofj_db-data"; then
    echo "❌ ERROR: Volume still exists!"
    exit 1
else
    echo "✅ Volume successfully deleted"
fi

echo ""
echo "========================================="
echo "✅ Done! Now redeploy in Dokploy dashboard"
echo "========================================="
echo ""
echo "Next steps:"
echo "1. Go to Dokploy dashboard"
echo "2. Navigate to: Projects → School → Planka"
echo "3. Click 'Deploy'"
echo ""
echo "The app will create a fresh database with correct migrations."
