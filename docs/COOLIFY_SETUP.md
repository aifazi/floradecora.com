# Coolify Setup Guide for Flora Decora

This guide walks through installing Coolify on WSL2 and deploying the Flora Decora stack (Frontend, Backend, Database) for local development, with a clear path to production.

## Prerequisites

- WSL2 with Ubuntu 26.04
- Docker 29.6.1 (already installed)
- Docker Compose v5.3.0 (already installed)
- At least 4GB RAM, 20GB disk
- Ports 80, 443, 3000 free (for Coolify + services)

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                       Coolify (UI)                       │
│                     localhost:8000                        │
└────────────┬──────────────┬──────────────┬──────────────┘
             │              │              │
     ┌───────▼─────┐ ┌──────▼──────┐ ┌─────▼──────┐
     │  Frontend   │ │   Backend   │ │    DB     │
     │  (Next.js)  │ │  (NestJS)   │ │ Postgres  │
     │  port 3000  │ │  port 3002  │ │ port 5432 │
     └─────────────┘ └─────────────┘ └────────────┘
```

## Part 1 — Install Coolify on WSL2

### Step 1: Fix DNS (if needed)

```bash
# In WSL
sudo nano /etc/resolv.conf
# Replace contents with:
#   nameserver 8.8.8.8
#   nameserver 1.1.1.1
```

### Step 2: Run Coolify installer

```bash
# In WSL terminal
curl -fsSL https://cdn.coollabs.io/coolify/install.sh | bash
```

The installer will:
- Install Docker (already have it)
- Pull Coolify images
- Set up the Coolify server
- Print a URL (usually `http://localhost:8000` or your WSL IP)

**Important:** Coolify binds to ports 80, 443, and 8000 by default. If you have other services on these ports, stop them first.

### Step 3: Access Coolify UI

Open in Windows browser: `http://localhost:8000`

- Create your admin account
- You'll see the Coolify dashboard

### Step 4: Configure Coolify for WSL2

Coolify on WSL2 needs special networking config:

```bash
# Find your WSL2 IP
hostname -I
# Example: 172.21.0.2

# Allow Coolify to use it as a "local" server
# In Coolify UI: Settings → Servers → Local → Update FQDN to your WSL2 IP
```

## Part 2 — Prepare Your Project

### Required files (create these)

1. **`docker-compose.coolify.yml`** — Stack definition
2. **`.env.coolify`** — Environment variables
3. **`Dockerfile.coolify`** (frontend) — Production Dockerfile for Coolify
4. **`Dockerfile.coolify`** (backend) — Production Dockerfile for Coolify

### Create the files

I'll create them in the next steps. Place them in your project root.

## Part 3 — Deploy the Database

### Option A: Deploy via Coolify UI
1. Coolify Dashboard → **+ New** → **Resource** → **Database** → **PostgreSQL**
2. Name: `flora-db`
3. Image: `postgres:17-alpine`
4. User: `postgres`
5. Password: `<generate-strong-password>` (save this!)
6. Database: `floradecora`
7. Port: `5432`
8. Click **Deploy**

### Option B: Use existing Docker Compose

```bash
# In WSL
cd /mnt/e/floradecora.com
docker compose up -d flora-db
```

## Part 4 — Deploy the Backend (NestJS)

### Step 1: Push code to Git (if not already)

```bash
# On Windows host
cd E:\floradecora.com
git add -A
git commit -m "ready for coolify deploy"
git push origin main
```

### Step 2: Deploy via Coolify

1. Coolify → **+ New** → **Resource** → **Application**
2. **Source:** GitHub
3. **Repository:** `your-username/floradecora`
4. **Branch:** `main`
5. **Build Pack:** `Dockerfile`
6. **Dockerfile Location:** `backend/Dockerfile.coolify`
7. **Port:** `3002`
8. **Environment Variables:**

```env
NODE_ENV=production
DATABASE_URL=postgresql://postgres:<password>@flora-db:5432/floradecora
DIRECT_URL=postgresql://postgres:<password>@flora-db:5432/floradecora
JWT_SECRET=<generate-strong-secret>
CORS_ORIGIN=http://localhost:3000
COOKIE_SECURE=false
R2_ENDPOINT=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=floradecora
CDN_URL=https://cdn.aifazi.net
```

9. Click **Deploy**

### Step 3: Run migrations

```bash
# After backend is running
docker exec -it <backend-container> npx prisma migrate deploy
docker exec -it <backend-container> npx prisma db seed
```

## Part 5 — Deploy the Frontend (Next.js)

### Deploy via Coolify

1. Coolify → **+ New** → **Resource** → **Application**
2. **Source:** GitHub
3. **Repository:** `your-username/floradecora`
4. **Branch:** `main`
5. **Build Pack:** `Dockerfile`
6. **Dockerfile Location:** `floradecora/Dockerfile.coolify`
7. **Port:** `3000`
8. **Environment Variables:**

```env
NODE_ENV=production
PORT=3000
BACKEND_URL=http://<backend-service-name>:3002
JWT_SECRET=<same-as-backend>
NEXT_PUBLIC_TURNSTILE_SITE_KEY=
TURNSTILE_SECRET_KEY=
WEB3FORMS_KEY=
NEXT_PUBLIC_API_URL=http://<backend-service-name>:3002
```

9. Click **Deploy**

## Part 6 — Connect Services

In Coolify:
- Frontend service → **Connected Services** → Add `backend`
- Backend service → **Connected Services** → Add `flora-db`

This creates an internal Docker network so they can talk via service names.

## Part 7 — Access Your App

Local URLs after deployment:
- Frontend: `http://localhost:3000` (or your WSL2 IP:3000)
- Backend API: `http://localhost:3002`
- Coolify UI: `http://localhost:8000`

From Windows browser, use:
- `http://<wsl2-ip>` (e.g. `http://172.21.0.2:3000`)

Find your WSL2 IP:
```bash
hostname -I
```

## Part 8 — Production Push

When ready for production:

### Option 1: Same WSL2 server with domain
1. Point a domain to your WSL2 public IP
2. Configure Coolify → **Destinations** → Add domain
3. Enable Let's Encrypt SSL

### Option 2: Move to a VPS (Hetzner/DO/Linode)
1. Get a VPS (4GB+ RAM)
2. Run the same Coolify install script
3. Point your GitHub repo to the new Coolify instance
4. Deploy with same Dockerfiles

### Option 3: Use Coolify Cloud (managed)
- `https://app.coolify.io` — managed hosting
- Connect your GitHub and deploy

## Troubleshooting

### DNS issues in WSL2
```bash
sudo nano /etc/resolv.conf
# Add: nameserver 8.8.8.8
```

### Port conflicts
```bash
# Check what's using ports
sudo lsof -i :80
sudo lsof -i :8000
```

### Coolify can't reach services
- Make sure services are in the same Docker network
- Use service names (not localhost) for inter-service communication
- Check Coolify's `coolify-infra` network

### Database connection issues
- Ensure `DATABASE_URL` uses the service name `flora-db` not `localhost`
- Check that `flora-db` is running and healthy

## Useful Commands

```bash
# View all containers
docker ps -a

# View logs
docker logs <container-name>

# Restart a service
docker compose restart <service>

# Stop everything
docker compose down

# WSL2 IP
hostname -I
```

## Next Steps

After local testing works:
1. Set up CI/CD (GitHub Actions → Coolify webhook)
2. Add monitoring (Uptime Kuma or similar)
3. Add backups for PostgreSQL
4. Set up staging environment
5. Plan production deployment
