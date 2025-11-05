# Fixing Dokploy Deployment - Port Configuration

## Problem
Port 3000 is already allocated on your Dokploy server, causing deployment to fail:
```
Error: Bind for 0.0.0.0:3000 failed: port is already allocated
```

## Root Cause
The `docker-compose.yml` was using `3000:1337` port mapping, which tries to bind to the host's port 3000.

**In Dokploy, you should NOT map to host ports.** Instead, expose only the internal container port (e.g., `1337`) and let Dokploy's Traefik reverse proxy handle external routing.

## Solution (FIXED)

The `docker-compose.yml` has been updated to use the correct port configuration:

**Before (WRONG for Dokploy):**
```yaml
ports:
  - 3000:1337  # ❌ This binds to host port 3000
```

**After (CORRECT for Dokploy):**
```yaml
ports:
  - 1337  # ✅ Only expose internal port, Dokploy handles the rest
```

## Database Authentication Fix

The docker-compose.yml also had hardcoded database credentials that didn't match Dokploy environment variables:

**Before (WRONG):**
```yaml
environment:
  - DATABASE_URL=postgresql://postgres@postgres/planka
postgres:
  environment:
    - POSTGRES_DB=planka
    - POSTGRES_HOST_AUTH_METHOD=trust
```

**After (CORRECT):**
```yaml
environment:
  - DATABASE_URL=postgresql://${POSTGRES_USER:-postgres}:${POSTGRES_PASSWORD}@postgres/${POSTGRES_DB:-planka}
postgres:
  environment:
    - POSTGRES_DB=${POSTGRES_DB:-planka}
    - POSTGRES_USER=${POSTGRES_USER:-postgres}
    - POSTGRES_PASSWORD=${POSTGRES_PASSWORD:-changeme}
```

Now the database connection uses your Dokploy environment variables!

## Required Dokploy Environment Variables

Make sure these are set in your Dokploy application settings:
- `POSTGRES_DB=planka`
- `POSTGRES_USER=planka`
- `POSTGRES_PASSWORD=your_secure_password`
- `BASE_URL=https://your-domain.com`
- `SECRET_KEY=your_secret_key`

Now commit and push this change, then redeploy in Dokploy!

## Quick Fix (Via Dokploy Dashboard)

### Option 1: Stop and Redeploy
1. Open your Dokploy dashboard
2. Navigate to: **Projects** → **School** → **Planka**
3. Click the **Stop** button (or **Destroy** if available)
4. Wait for containers to stop completely
5. Click **Deploy** again

### Option 2: Change Port in Dokploy Settings
1. Open your Dokploy dashboard
2. Navigate to: **Projects** → **School** → **Planka**
3. Go to **Settings** or **Ports** section
4. Change the external port from `3000` to `3001` (or any available port)
5. Update the `BASE_URL` environment variable to match
6. Save and **Deploy**

## Advanced Fix (Via SSH)

If you have SSH access to your Dokploy server:

```bash
# 1. SSH into your Dokploy server
ssh your-dokploy-server

# 2. Find the compose project (should be something like school-planka-occofj)
docker ps -a | grep planka

# 3. Stop the Docker Compose project
cd /path/to/dokploy/compose/projects/school-planka-occofj
docker compose down

# 4. Or force remove all planka containers
docker ps -a | grep planka | awk '{print $1}' | xargs docker rm -f

# 5. Check if port 3000 is now free
docker ps --filter "publish=3000"

# 6. If still occupied, find and stop the process
sudo lsof -i :3000
# Then kill the process or stop that container

# 7. Clean up Docker resources
docker system prune -f

# 8. Now redeploy via Dokploy dashboard
```

## Prevention

To avoid this issue in the future:

### 1. Use Traefik/Reverse Proxy (Recommended)
In Dokploy settings:
- Enable **Traefik** integration
- Set a domain name (e.g., `planka.yourdomain.com`)
- Remove direct port mapping (let Traefik handle it)
- Traefik will route traffic internally without port conflicts

### 2. Use Different Ports
- Configure each application to use unique external ports
- Example: Planka on 3001, other apps on 3002, 3003, etc.

### 3. Proper Cleanup
- Always **Stop** applications before redeploying
- Don't just kill containers manually
- Use Dokploy's built-in deployment management

## Debugging Commands

```bash
# Check what's running on port 3000
docker ps --filter "publish=3000"

# Check all containers (including stopped)
docker ps -a | grep planka

# View Docker Compose logs
docker compose -p school-planka-occofj logs

# Check Docker networks
docker network ls | grep planka

# See all port bindings
docker ps --format "table {{.ID}}\t{{.Names}}\t{{.Ports}}"
```

## Need Help?

If the issue persists:
1. Check Dokploy logs in the dashboard
2. Ensure no other services are using port 3000
3. Consider using Traefik instead of direct port mapping
4. Contact Dokploy support with the error logs
