# Coolify Migration Runbook — Flora Decora (locked 7 Oct 2026)

Goal: same treatment as Global Garden — private GitHub repo, manual Deploy,
single-level subdomain, Cloudflare Tunnel, old stack untouched until cutover.

## Decisions
- Frontend public: `flora.aifazi.net` (single-level, free Universal SSL)
- Backend: INTERNAL ONLY, no domain, no tunnel route
- Database: **Supabase Cloud** project `floradecora` (ref `ysqkydiuejnjvuugklbi`, region ap-northeast-2)
  — NOT a Coolify Postgres. Data migrated + verified 7 Oct 2026.
- Secrets: REUSED from existing `.env` files (no rotation). DB password = new, generated.

## 0. Repo prep (done)
- Branch `main`, remote `aifazi/floradecora.com`, in sync. Push any local work first.

## 1. Supabase connection topology (IMPORTANT — discovered 7 Oct)
- `db.ysqkydiuejnjvuugklbi.supabase.co` resolves **AAAA-only (IPv6)** — unreachable
  from this machine (no IPv6 route) and likely from Coolify containers. Do NOT use it.
- Use the **session-mode pooler** instead (IPv4, transparent to Prisma/psql — no
  `pgbouncer=true` flag, `prisma migrate deploy` works through it):

```
postgresql://postgres.ysqkydiuejnjvuugklbi:<DB_PASSWORD>@aws-0-ap-northeast-2.pooler.supabase.com:5432/postgres?sslmode=require
```

- Username MUST be `postgres.ysqkydiuejnjvuugklbi` (tenant/external_id).
  Plain `postgres` only works with SNI tricks — avoid.
- `<DB_PASSWORD>`: stored at `C:\Users\aafaqit\.local\share\flora-supabase-db.pw`
  (set via `PATCH /v1/projects/{ref}/database/password` on the Management API).
- Pooler port map: **5432 = session mode (use this)**, 6543 = transaction mode.

## 2. Data migration status: DONE (7 Oct 2026)
- Full dump of old `flora-db` (WSL, pg_dump 17.11 -Fc) restored into Supabase via
  session pooler. All 15 public tables, row counts verified identical old↔new
  (5 `_prisma_migrations`, 4 cdn_providers, 1 contacts, 3 email_logs, 3 email_providers,
  3 email_queue, 3 email_templates, 0 media, 0 newsletters, 3 posts, 3 projects,
  15 refresh_tokens, 9 services, 7 site_settings, 1 users).
- Because `_prisma_migrations` came across, the backend's boot-time
  `prisma migrate deploy` will no-op.
- **Re-sync before cutover** (old stack keeps writing until stopped) — re-run:
  1. `C:\Users\aafaqit\AppData\Local\Temp\opencode\flora-dump.sh` (WSL) — fresh dump of old flora-db
  2. `C:\Users\aafaqit\AppData\Local\Temp\opencode\flora-restore2.sh` (WSL) — restore into Supabase + count verify
  - Data-only risk: none, restore is idempotent for same schema; if old schema drifted,
    run `pg_restore` without `--data-only` (dump is full schema+data).

## 3. Coolify resources (new project `floradecora` → environment `production`)

Paste-ready env files (secrets, outside the repo):
- Backend: `C:\Users\aafaqit\.local\share\flora-coolify-backend.env` (18 keys — Supabase DATABASE_URL/DIRECT_URL, reused JWT_SECRET, CORS_ORIGIN=https://flora.aifazi.net, COOKIE_SECURE=true, ALLOW_* flags false)
- Frontend: `C:\Users\aafaqit\.local\share\flora-coolify-frontend.env` (5 keys — replace `<BACKEND_APP_UUID>` with the backend app UUID from its Coolify page)

### 3a. Deploy key (one-time, UI)
1. Coolify → new private key → copy PUBLIC key
2. GitHub `aifazi/floradecora.com` → Settings → Deploy keys → Add (read-only)
   (separate key from the globalgarden repo key — deploy keys are repo-scoped)

### 3b. Backend (NestJS)
- Private Git repo, branch `main`, build pack Dockerfile,
  location `backend/Dockerfile.coolify`, port `3002`, **NO domain** (internal).
- Clear any template junk (custom docker options, php/laravel hooks).
- Env: paste `flora-coolify-backend.env`.
- NOTE: do NOT add a Coolify PostgreSQL database — DB is Supabase.
- The image CMD runs `check-env` → `prisma migrate deploy` → server;
  `check-env` fails hard in production if COOKIE_SECURE!=true or CORS_ORIGIN has localhost.
- Deploy. Verify internal health from the backend container:
  `wget -qO- http://127.0.0.1:3002/api/health`

### 3c. Frontend (Next.js)
- Same deploy key, Dockerfile location `floradecora/Dockerfile.coolify`, port `3000`
- Domain: `flora.aifazi.net`, scheme http, port 3000, redirects OFF
- Env: paste `flora-coolify-frontend.env` after substituting `<BACKEND_APP_UUID>`.
- **Do NOT set `NEXT_PUBLIC_API_URL`** — all browser traffic goes through the
  frontend's own `/api/*` proxy routes + SSR using `BACKEND_URL` (server-only).
  Setting it would inline an internal URL into client bundles.
- Deploy.

## 4. Tunnel route (Cloudflare Zero Trust)
Published application: `flora.aifazi.net` → `http://localhost:80`
(CNAME auto-created; Universal SSL covers single-level subdomain.)

## 5. Verify then cutover
1. Re-sync data (section 2) right before deploying backend
2. `https://flora.aifazi.net` loads, login works (secure cookie path), images via CDN
3. Compare against old stack (`:3001`) side by side
4. Cutover: `docker stop floradecora floradecora-backend` (leave `flora-db` running
   1 week as rollback), then `docker rm` + compose down when confident
5. Rollback: restart old containers; tunnel rollout = repoint `flora.aifazi.net`
   route to `:3001` temporarily (old stack bypassed traefik)

## 6. Deployed state (7 Oct 2026 — both apps healthy)
- Project `floradecora` (`oqixnm4tchpnfi5bpdgdfrnm`) → env `production` (`o0neylctu1wxksc6fnobxciy`)
- Server `localhost` (`dyacauysahepmkjihdivlkd9`), destination `coolify` (`2dcbbjpagr3xx5cbrtpgmszf`)
- Backend app: `k3abmgouaemh2jhikohagvjh` — internal only, HC `{"status":"ok","db":"up"}`
- Frontend app: `zqsqa25vdpmcojaeyefz31ql` — domain https://flora.aifazi.net (http scheme)
- Deploy key: Coolify private key `floradecora-deploy` (`1dzcrtoxrfrqmasobnog1kle`),
  GitHub deploy key id 165703754 (read-only)
- App-to-app: backend carries `custom_network_aliases=floradecora-backend`;
  frontend `BACKEND_URL=http://floradecora-backend:3002`.
  **App containers have NO stable UUID hostname** (alias is `<uuid>-<timestamp>` — changes
  every deploy). Bare-UUID hosts fall through to upstream DNS (search-domain expansion,
  timeouts) — always use `custom_network_aliases`.
- Build gotchas fixed: `base_directory=/backend` (resp. `/floradecora`) +
  `dockerfile_location=/Dockerfile.coolify` (Coolify concatenates the two); `NODE_ENV`
  must be **runtime-only** (build-time production strips devDependencies → tsc/nest missing).
- Still pending: tunnel public hostname (see section 4) — requires Zero Trust dashboard
  (tunnel token is admin-only, not readable for API use).

## Never do
- Do NOT stop the old stack before the new one is verified
- Do NOT rotate JWT_SECRET (logs out all sessions)
- Do NOT use `db.ysqkydiuejnjvuugklbi.supabase.co` (IPv6-only) from anywhere — pooler only
- Do NOT set `NEXT_PUBLIC_API_URL` on the frontend
- Do NOT add apex or multi-level (`*.x.aifazi.net`) hostnames
- Do NOT commit the env/pw files (they live under `~\.local\share\`, outside the repo)
