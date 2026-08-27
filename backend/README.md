# FloraDecora Backend (NestJS + Supabase) — Railway/Render + Vercel Frontend

**Stack:** NestJS 11 + Prisma 6 + Supabase Postgres + R2 (S3)

**Local WSL:**
```bash
cd /mnt/e/floradecora.com
# 1. Supabase: create project at supabase.com -> Database -> Connection string
# copy DATABASE_URL + DIRECT_URL to backend/.env (see .env.example)
cp backend/.env.example backend/.env
# 2. Run DB + backend + frontend
wsl -d Ubuntu-26.04 -- bash -c "cd /mnt/e/floradecora.com && docker compose up -d flora-db backend floradecora"
# 3. Migrate
wsl -d Ubuntu-26.04 -- bash -c "cd /mnt/e/floradecora.com/backend && npx prisma migrate dev --name init && npx prisma generate"
# Frontend: http://localhost:3001  Backend: http://localhost:3002/api  DB: localhost:5433
```

**Supabase:**
- Dashboard -> Project Settings -> Database -> `DATABASE_URL` (pooler 6543) + `DIRECT_URL` (5432)
- Add both to `backend/.env` and to **Railway/Render Env** + **Vercel Env** (`NEXT_PUBLIC_API_URL`)

**Railway:**
- New Project -> Deploy from GitHub `aifazi/floradecora.com` -> Root Directory `backend` -> Add Variables from `.env.example` -> Deploy
- Railway gives `https://backend-*.up.railway.app` -> set `CORS_ORIGIN=https://floradecora.com,https://www.floradecora.com`

**Render:**
- New Web Service -> Connect `aifazi/floradecora.com` -> Root Directory `backend` -> Build `npm ci && npx prisma generate && npm run build` -> Start `npm run start:prod` -> Add Env vars -> Deploy

**Vercel Frontend:**
- Import `aifazi/floradecora.com` -> Root Directory `floradecora` -> Env `NEXT_PUBLIC_API_URL=https://your-backend.railway.app/api` + `NEXT_PUBLIC_WEB3FORMS_KEY` etc -> Deploy
- Supabase Auth: Add `https://floradecora.com` to Supabase -> Auth -> URL Configuration -> Redirect URLs

**API:**
- `POST /api/contact` `{name,email,phone,projectType,message}` -> Supabase `contacts`
- `POST /api/newsletter` `{email}`
- `GET /api/projects` / `POST /api/projects`
- `POST /api/media/upload` multipart `file` -> R2 `https://cdn.aifazi.net/...`
