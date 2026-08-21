# Flora Decora — Website

A Next.js (App Router) rebuild of the Flora Decora marketing site: Home,
About, Services, Projects and Contact. No backend/database — contact-form
inquiries are forwarded straight to email via [Web3Forms](https://web3forms.com).

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- Web3Forms for the contact form (client-side POST, no server code, free tier)
- Deploys to Vercel as a static/SSR site with zero configuration

## Local setup

```bash
npm install
cp .env.local.example .env.local
npm run dev
```

Open http://localhost:3000.

## Wiring up the contact form (Web3Forms)

1. Go to https://web3forms.com and enter the email address that should
   receive inquiries (e.g. `info@floradecora.com`). No account needed.
2. You'll get an **access key** by email — copy it.
3. Locally: put it in `.env.local` as `NEXT_PUBLIC_WEB3FORMS_KEY=...`.
4. On Vercel: Project → Settings → Environment Variables → add
   `NEXT_PUBLIC_WEB3FORMS_KEY` with the same value, for Production (and
   Preview if you want form testing on preview deployments too).
5. Redeploy. Submissions on `/contact` will now arrive by email. Web3Forms'
   free tier includes spam filtering and a basic honeypot field is already
   wired into the form.

No API key is exposed beyond this public form-submission key, which is
designed by Web3Forms to be used client-side (it only allows submissions to
the inbox it was issued for).

## Deploying to Vercel

1. Push this project to a GitHub repo.
2. In Vercel: **New Project** → import the repo → framework preset
   `Next.js` is auto-detected → no build settings to change.
3. Add the `NEXT_PUBLIC_WEB3FORMS_KEY` environment variable (see above)
   before the first deploy, or add it after and redeploy.
4. Deploy. Add your custom domain (e.g. `floradecora.com`) under
   Project → Settings → Domains.

## Content to replace before launch

- `app/projects/page.tsx` — swap the gradient placeholder tiles for real
  project photography (filenames/notes are marked inline).
- Stats (`20+ years`, `300+ projects`, `150+ clients`) in `app/page.tsx`
  and `app/projects/page.tsx` — set to the real current figures.
- Any copy you'd like adjusted — most page content lives directly in each
  `app/**/page.tsx` file as plain arrays/JSX, no CMS required.

## Project structure

```
app/
  layout.tsx          Root layout, fonts, Header/Footer
  page.tsx             Home
  about/page.tsx
  services/page.tsx
  projects/page.tsx
  contact/page.tsx
components/
  Header.tsx, Footer.tsx
  SitePlanHero.tsx      Animated line-drawing hero (site master-plan motif)
  SectionHeading.tsx
  ContactForm.tsx        Web3Forms-powered inquiry form
```

## Vercel Root Directory
This repo keeps the Next.js app in `floradecora/`. In Vercel: Project → Settings → General → Root Directory = `floradecora` (already configured for this repo). Alternatively `vercel.json` at the repo root handles `cd floradecora && npm run build` if Root Directory is left blank.