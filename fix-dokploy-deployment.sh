#!/bin/bash
# Script to fix Dokploy deployment port conflict
# Run this on your Dokploy server via SSH

echo "=== Stopping and removing conflicting Planka containers ==="

# Stop all containers with 'planka' in the name
docker ps -a | grep planka | awk '{print $1}' | xargs -r docker stop

# Remove all containers with 'planka' in the name
docker ps -a | grep planka | awk '{print $1}' | xargs -r docker rm

# Check what's using port 3000
echo -e "\n=== Checking what's using port 3000 ==="
docker ps --filter "publish=3000"

# If you want to remove all stopped containers and free up resources
echo -e "\n=== Cleaning up Docker resources ==="
docker system prune -f

echo -e "\n=== Done! Now you can redeploy through Dokploy ==="
