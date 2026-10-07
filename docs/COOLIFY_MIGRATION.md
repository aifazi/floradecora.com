# Coolify Migration Runbook — Flora Decora (locked 7 Oct 2026)

Goal: same treatment as Global Garden — private GitHub repo, manual Deploy,
single-level subdomain, Cloudflare Tunnel, old stack untouched until cutover.

## Decisions
- Frontend public: `flora.aifazi.net` (single-level, free Universal SSL)
- Backend: INTERNAL ONLY, no domain, no tunnel route
- Database: new Coolify Postgres 17 + data-only dump/restore from old `flora-db`
- Secrets: REUSED from existing `.env` files (no rotation)

## 0. Repo prep (done)
- Branch `main`, remote `aifazi/floradecora.com`, in sync. Push any local work first.

## 1. Deploy key (one-time, UI)
1. Coolify → new private key → copy PUBLIC key
2. GitHub `aifazi/floradecora.com` → Settings → Deploy keys → Add (read-only)
   (separate key from the globalgarden repo key — deploy keys are repo-scoped)

## 2. Coolify resources (new project `floradecora` → environment `production`)

### 2a. Database
+ New → Database → PostgreSQL, image `postgres:17-alpine`
- Name: `flora-db`, user `postgres`, database `floradecora`
- Password: COPY from existing root `.env` `POSTGRES_PASSWORD` (same value keeps all connection strings identical)
- No public port. Deploy. Note the internal hostname from the DB page.

### 2b. Backend (NestJS)
+ New → Application → Private Git Repository (deploy key)
- Repo `git@github.com:aifazi/floradecora.com.git`, branch `main`
- Build pack Dockerfile, location `backend/Dockerfile.coolify`, port `3002`
- NO domain (internal). Clear any template junk (custom docker options, php/laravel hooks).
- Env (copy secrets from existing files, do NOT invent new ones):
  - `NODE_ENV=production`, `PORT=3002`
  - `DATABASE_URL` / `DIRECT_URL` = `postgresql://postgres:<same-pw>@<coolify-db-host>:5432/floradecora`
  - `JWT_SECRET` = existing value (frontend + backend MUST match)
  - `CORS_ORIGIN=https://flora.aifazi.net` (note https, not localhost)
  - `COOKIE_SECURE=true`, `ALLOW_INSECURE_COOKIE=false` (https via tunnel now)
  - `R2_*`, `CDN_URL`, `ADMIN_API_KEY` = copy existing values
- Deploy. Backend runs `prisma migrate deploy` on boot (empty schema OK).
- Verify internally: `docker exec <backend> wget -qO- http://127.0.0.1:3002/api/health`

### 2c. Data restore (WSL, after backend first boot migrated the schema)
```bash
docker exec flora-db pg_dump -U postgres -d floradecora --data-only --column-inserts > /tmp/flora-data.sql
NEWDB=$(docker ps --format '{{.Names}}' | grep -i -m1 'flora.*db' | grep -v '^flora-db$')
docker cp /tmp/flora-data.sql $NEWDB:/tmp/flora-data.sql
docker exec $NEWDB psql -U postgres -d floradecora -f /tmp/flora-data.sql
```
(data-only because the schema already migrated; dump includes sequence setvals)

### 2d. Frontend (Next.js)
+ New → Application → Private Git Repository (same key)
- Dockerfile location `floradecora/Dockerfile.coolify`, port `3000`
- Domain: `flora.aifazi.net`, scheme http, port 3000, redirects OFF
- Env:
  - `NODE_ENV=production`, `PORT=3000`
  - `BACKEND_URL=http://<backend-internal-hostname>:3002` (from backend app page)
  - `JWT_SECRET` = same value as backend
  - `NEXT_PUBLIC_LOADING_MS=2600` (build-time; set before first build)
  - Turnstile/Web3Forms keys = copy existing if set
- Deploy.

## 3. Tunnel route (Cloudflare Zero Trust)
Published application: `flora.aifazi.net` → `http://localhost:80`
(CNAME auto-created; Universal SSL covers single-level subdomain.)

## 4. Verify then cutover
1. `https://flora.aifazi.net` loads, login works (cookie secure path), images via CDN
2. Compare against old stack (`:3001`) side by side
3. Cutover: `docker stop floradecora floradecora-backend` (leave `flora-db` running 1 week as rollback), then `docker rm` + compose down when confident
4. Rollback: restart old containers; tunnel route unchanged (points at :80/traefik — old stack bypassed traefik, so rollback = repoint tunnel to `:3001` temporarily)

## Never do
- Do NOT stop the old stack before the new one is verified
- Do NOT rotate JWT_SECRET (logs out all sessions) or change the DB password mid-migration
- Do NOT add apex or multi-level (`*.x.aifazi.net`) hostnames
