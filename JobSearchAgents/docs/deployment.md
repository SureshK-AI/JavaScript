# Deployment

The stack targets **free tiers** with zero lock-in: a Node 20+ host for the API (Render/Railway/Fly) and a static host for the React frontend (Vercel/Netlify). SQLite is the zero-config default; swap to PostgreSQL when you outgrow it.

## Prerequisites

- Node 20+ (uses `node:sqlite` — requires Node 22.5+ for the built-in module, or a runtime with the `node:sqlite` backport; the project targets Node 20+ per `package.json` `engines`).
- `npm install` at the repo root (npm workspaces installs backend + frontend).
- Copy `.env.example` → `.env` and generate secrets:
  ```bash
  node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
  # use one value for JWT_SECRET and a different one for VAULT_KEY
  ```

## Local production build

```bash
npm run build        # tsc + vite build for both apps
npm start            # node apps/backend/dist/server.js (serves the API only)
```

## Backend (API) — Render / Railway / Fly

| Setting | Value |
| --- | --- |
| Root directory | `JobSearchAgents` |
| Build command | `npm install && npm run build -w @jobsearch/backend` |
| Start command | `npm run start -w @jobsearch/backend` |
| Node version | `>=20` (set `NODE_VERSION=20` on Render) |
| Port | Express reads `PORT` (default 3001; Render/Railway inject it) |

Required env vars on the host:

```
NODE_ENV=production
PORT=3001
JWT_SECRET=<32-byte hex>
VAULT_KEY=<32-byte hex>
FRONTEND_URL=https://<your-frontend-domain>
DATABASE_URL=sqlite://./data/jobsearch.db   # or a Postgres DSN
```

Notes:

- The SQLite file is written to `apps/backend/data/jobsearch.db` (relative to the backend). On ephemeral hosts (Render free tier), the filesystem is not persistent — use **PostgreSQL** or a mounted disk for real data. The code throws a clear error if you point `DATABASE_URL` at Postgres today, because the `pg` adapter is not bundled; implementing it is the one required change for managed Postgres.
- Uploads land in `apps/backend/data/uploads/` — same persistence caveat applies.
- Demo mode (`SCRAPER_DEMO_MODE=true`) and `AUTOMATION_ENABLED=false` are safe defaults for production.

## Frontend (static) — Vercel / Netlify

| Setting | Value |
| --- | --- |
| Root directory | `JobSearchAgents/apps/frontend` |
| Build command | `npm install && npm run build` |
| Publish directory | `dist` |
| Env var | `VITE_API_URL=https://<your-api-domain>/api` |

`VITE_API_URL` is baked in at build time. If it is unset, the client defaults to `/api` (same origin) — use the env var to point at the hosted API. Deploying to Vercel from the `apps/frontend` subdirectory works out of the box with `npm run build`; add a `vercel.json` with the root directory if deploying from the monorepo root.

## Security checklist for production

- [ ] `JWT_SECRET` and `VAULT_KEY` are unique 32-byte hex values, never the `.env.example` defaults
- [ ] `OAUTH_ENABLED` stays `true` only if you intend the demo provider; real OAuth2 would replace the demo route
- [ ] `AUTOMATION_ENABLED` is `false` unless the auto-apply flow has been reviewed (it submits real applications)
- [ ] `FRONTEND_URL` matches the frontend origin (CORS allowlist)
- [ ] Database and uploads are on persistent storage (Postgres / mounted disk)

## Optional integrations (all degrade gracefully when unset)

| Service | Env vars | Used for |
| --- | --- | --- |
| SendGrid | `SENDGRID_API_KEY`, `FROM_EMAIL` | Real email report delivery (falls back to simulated delivery) |
| Twilio | `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, `TWILIO_FROM` | SMS report delivery (falls back to simulated) |
| OpenAI | `OPENAI_API_KEY` | Optional LLM-powered generation (agents use deterministic engines by default) |

## CI

Recommended minimal pipeline (GitHub Actions, all free):

1. `npm ci`
2. `npm run typecheck`
3. `npm test` (backend BDD — boots the API in-process, no services needed)
4. `npm run build`

The E2E suite (`npm run test:e2e`) needs Chromium and a running backend, so run it as a separate workflow (install Playwright browsers with `npx playwright install --with-deps chromium`, start the backend, then run the suite).
