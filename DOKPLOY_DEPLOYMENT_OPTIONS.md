# Dokploy Deployment Options for Planka

## Current Issue: Database Migration Conflict

You're seeing this error:
```
Error: The migration directory is corrupt, the following files are missing
```

This happens because your database has old migration records. **See [DATABASE_RESET_GUIDE.md](./DATABASE_RESET_GUIDE.md) for the fix.**

## Deployment Options

### Option 1: Embedded PostgreSQL (Current Setup) ⚠️

**File**: `docker-compose.yml`

**Pros**:
- Simple - everything in one compose file
- No external dependencies

**Cons**:
- ❌ Volume conflicts can occur (like you're experiencing)
- ❌ Harder to backup/restore
- ❌ Database upgrades are manual
- ❌ Can't easily share database between services

**Current Status**: ⚠️ You have a database volume conflict. Reset required.

---

### Option 2: Dokploy Managed PostgreSQL (Recommended) ✅

Use Dokploy's built-in PostgreSQL service instead of docker-compose postgres.

**File**: `docker-compose-external-db.yml`

**Setup Steps**:

1. **Create PostgreSQL Database in Dokploy**:
   ```
   Dashboard → Projects → School → Create Database
   - Type: PostgreSQL 16
   - Name: planka-db
   - Username: planka
   - Password: <generate secure password>
   ```

2. **Get Connection String**:
   Dokploy will provide something like:
   ```
   postgresql://planka:password@postgres-xyz:5432/planka
   ```

3. **Update Planka Application**:
   - In Dokploy, go to your Planka app settings
   - Change **Docker Compose File** path to: `docker-compose-external-db.yml`
   - Update environment variables:
     ```
     DATABASE_URL=postgresql://planka:password@postgres-xyz:5432/planka
     ```
   - Remove: `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`

4. **Deploy**:
   - Click **Deploy**
   - Fresh database with correct migrations!

**Pros**:
- ✅ Managed by Dokploy
- ✅ Easy backups via Dokploy UI
- ✅ Automatic updates
- ✅ No volume conflicts
- ✅ Better for production

**Cons**:
- Requires Dokploy database service (which you likely already have)

---

## Quick Fix: Reset Current Database

**Fastest solution right now**:

1. **Stop the app** in Dokploy
2. **Delete the volume** `school-planka-occofj_db-data` via Dokploy UI or SSH:
   ```bash
   docker volume rm school-planka-occofj_db-data
   ```
3. **Deploy** again

This gives you a fresh database with the correct migrations.

See [DATABASE_RESET_GUIDE.md](./DATABASE_RESET_GUIDE.md) for detailed instructions.

---

## Environment Variables Reference

### Required (Both Options)
```bash
BASE_URL=https://pano.8092.tr
SECRET_KEY=planka_secret_key_789_very_long_and_secure
```

### For Embedded PostgreSQL (docker-compose.yml)
```bash
POSTGRES_DB=planka
POSTGRES_USER=planka
POSTGRES_PASSWORD=postgres_secret_password_123
```

### For External Database (docker-compose-external-db.yml)
```bash
DATABASE_URL=postgresql://planka:password@host:5432/planka
```

### Optional (Both Options)
```bash
# Admin user
DEFAULT_ADMIN_EMAIL=admin@example.com
DEFAULT_ADMIN_PASSWORD=your-secure-password
DEFAULT_ADMIN_NAME=Admin User

# OAuth (Google)
OIDC_ISSUER=https://accounts.google.com
OIDC_CLIENT_ID=your-client-id.apps.googleusercontent.com
OIDC_CLIENT_SECRET=your-client-secret
OIDC_SCOPES=openid profile email
OIDC_IGNORE_ROLES=true

# SMTP (Gmail example)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=your-email@gmail.com

# Proxy
TRUST_PROXY=true
```

---

## Recommended Action

1. **Short term**: Reset the database volume (see DATABASE_RESET_GUIDE.md)
2. **Long term**: Switch to Dokploy managed PostgreSQL for better stability

Both options work, but Option 2 (Dokploy managed DB) is more production-ready.
