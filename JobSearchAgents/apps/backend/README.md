# JobSearchAgents — Backend

FastAPI-free, dependency-light **TypeScript** backend for the multi-agent job search platform.

## Stack

- Express 5 + TypeScript (ESM, NodeNext)
- `node:sqlite` database (zero native dependencies) — PostgreSQL supported via `DATABASE_URL`
- JWT auth + OAuth2-style demo provider + AES-256-GCM credential vault
- Playwright for portal scraping (demo mode by default)
- **Cucumber (Gherkin BDD)** test suite — specs live in [`features/`](features/), steps in [`test/`](test/)

## Scripts

```bash
npm run dev        # tsx watch src/server.ts
npm run build      # tsc → dist/
npm run start      # node dist/server.js
npm run typecheck  # tsc --noEmit
npm test           # cucumber-js (BDD suite, auto-builds + boots API)
```

## API

Base URL: `http://localhost:3001/api`. See [`docs/api.md`](../../docs/api.md) for the full contract and [`docs/architecture.md`](../../docs/architecture.md) for the system design.

Key endpoints:

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/auth/register` | Register candidate |
| POST | `/auth/login` | JWT login |
| GET | `/auth/oauth/:provider` | OAuth-style demo provider login |
| POST | `/resumes` | Upload resume (PDF/DOCX/TXT) → parses + stores |
| GET | `/resumes` / `/resumes/:id` | List / get resume |
| POST | `/resumes/:id/tailor` | Tailor resume for a job |
| POST | `/resumes/:id/optimize` | ATS-optimize for a job → returns ATS score |
| POST | `/jobs/search` | Search all portals (Playwright or demo) |
| GET | `/jobs` / `/jobs/:id` | List / get jobs |
| POST | `/jobs/:id/match` | Match job against a resume (similarity score) |
| POST | `/jobs/:id/apply` | Auto-apply (disabled unless automation enabled) |
| GET | `/applications` | Candidate application history |
| POST | `/reports/daily` | Generate + send daily report |
| GET | `/reports` | Report history |
| POST | `/agents/:name/run` | Run any agent directly |
| POST | `/agents/pipeline` | Run the full orchestrated pipeline |
| GET | `/dashboard/stats` | Dashboard statistics |

## BDD Testing

```bash
npm test   # runs cucumber-js against features/*.feature
```

The suite boots the Express app in-process (ephemeral test DB), exercises the API end to end, and tears down afterward. Add a behavior → write a `.feature` → implement the step in `test/steps/`.
