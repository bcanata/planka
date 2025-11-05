# Database Reset Guide for Dokploy

## Problem
Your database has migration records from an old Planka installation that conflict with the current version:

```
Error: The migration directory is corrupt, the following files are missing:
20180721020022_create_next_id_function.js, ...
```

This happens because:
- Your database was created with an older version of Planka
- The new version (2.0.0-rc.4) uses consolidated migrations
- Knex can't find the old migration files in the new Docker image

## Solution: Reset the Database Volume

⚠️ **WARNING**: This will DELETE ALL DATA in your Planka database!

### Option 1: Via Dokploy Dashboard (Recommended)

1. **Stop the Application**
   - Go to Dokploy Dashboard
   - Navigate to: Projects → School → Planka
   - Click **Stop**

2. **Delete the Database Volume**
   - In the same application page, look for **Volumes** section
   - Find `school-planka-occofj_db-data` volume
   - Click **Delete** or **Remove** on this volume
   - Confirm deletion

3. **Redeploy**
   - Click **Deploy**
   - The application will create a fresh database with correct migrations
   - Your admin user will be created from environment variables

### Option 2: Via SSH to Dokploy Server

If you have SSH access to your Dokploy server:

```bash
# 1. Stop the containers
docker compose -p school-planka-occofj down

# 2. Remove the database volume (WARNING: deletes all data!)
docker volume rm school-planka-occofj_db-data

# 3. Redeploy via Dokploy dashboard
```

### Option 3: Manual Migration Table Cleanup (Advanced)

If you want to keep your data but fix the migration issue:

```bash
# 1. Connect to the postgres container
docker exec -it school-planka-occofj-postgres-1 psql -U planka -d planka

# 2. Drop the migrations table
DROP TABLE IF EXISTS knex_migrations;
DROP TABLE IF EXISTS knex_migrations_lock;

# 3. Exit
\q

# 4. Restart the planka container
docker restart school-planka-occofj-planka-1
```

**Note**: This approach is risky and may cause data inconsistencies if your database schema doesn't match the current migrations.

## After Reset

After resetting the database, the application will:

1. ✅ Create fresh database schema
2. ✅ Run all current migrations including your public sharing feature
3. ✅ Create admin user from these environment variables:
   - `DEFAULT_ADMIN_EMAIL=bcanata@gmail.com`
   - `DEFAULT_ADMIN_PASSWORD=Dewil7224:)`
   - `DEFAULT_ADMIN_NAME=Buğra Canata`

## Recommended: Use Dokploy's PostgreSQL Instead

For production, consider using Dokploy's built-in PostgreSQL service:

1. **Create a PostgreSQL database in Dokploy**
   - Navigate to: Projects → School → Databases
   - Click **Create Database** → **PostgreSQL**
   - Name it: `planka-db`
   - Set username/password

2. **Update your Planka application environment variables**
   - Remove `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD` (not needed)
   - Set `DATABASE_URL` to the connection string provided by Dokploy

3. **Remove postgres service from docker-compose.yml**
   - The Planka container will connect to Dokploy's managed PostgreSQL
   - No more volume conflicts!

## Prevention

To avoid this in the future:
- Use Dokploy's managed databases instead of docker-compose databases
- Always backup your database before major upgrades
- Keep track of which Planka version you're running
