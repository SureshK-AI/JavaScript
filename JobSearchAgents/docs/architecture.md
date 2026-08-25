# Architecture

## System Overview

JobSearchAgents is a multi-agent automated job search and application platform. A candidate uploads a resume, the platform parses it, searches job portals, matches postings against the resume with semantic-style similarity, generates ATS-optimized versions and cover letters, flags fraudulent postings, tracks applications, and delivers daily reports.

The system is a TypeScript monorepo (npm workspaces) with an Express 5 backend, a React 18 + Vite frontend, and a Gherkin/BDD test layer at both the API and UI levels.

```
┌────────────────────┐      HTTP/JSON (JWT)      ┌─────────────────────────┐
│  React candidate    │ ───────────────────────► │  Express 5 API (:3001)  │
│  portal (:5173)     │ ◄─────────────────────── │  apps/backend/src       │
└────────────────────┘                           └────────────┬────────────┘
                                                               │
                            ┌──────────────────────────────────┼──────────────────────────┐
                            ▼                                  ▼                          ▼
                    ┌───────────────┐                 ┌──────────────┐          ┌────────────────────┐
                    │  15 agents +  │                 │  Services    │          │  Scrapers          │
                    │  orchestrator │                 │  (parsing,   │          │  (Naukri, LinkedIn,│
                    │  (src/agents) │                 │  matching,   │          │   Indeed, Glassdoor│
                    └───────┬───────┘                 │  ATS, fraud, │          │   — Playwright or  │
                            │                         │  reporting)  │          │   demo mode)       │
                            ▼                         └──────┬───────┘          └─────────┬──────────┘
                    ┌─────────────────────────────────────────┼────────────────────────────┘
                    ▼                                         ▼
            ┌────────────────┐                      ┌────────────────────┐
            │  node:sqlite   │                      │  AES-256-GCM vault │
            │  (SQLite file, │                      │  (portal creds)    │
            │  or Postgres)  │                      └────────────────────┘
            └────────────────┘
```

## Backend (`apps/backend`)

Express 5 + TypeScript (ESM, NodeNext). The app is built by `createApp()` in `src/app.ts`, which is used both by the standalone server (`src/server.ts`) and by the BDD test harness. Routes are mounted under `/api`; everything except `/auth` and `/health` requires a `Bearer` JWT.

### Directory layout

| Path | Responsibility |
| --- | --- |
| `src/routes/` | Express routers — one file per resource (auth, resumes, jobs, applications, reports, agents, dashboard) |
| `src/agents/` | The 15 specialized agents + `AgentOrchestrator` |
| `src/scrapers/` | Portal scrapers + general-web scraper. `SCRAPER_DEMO_MODE=true` returns instant sample data; live mode drives Playwright / search-engine discovery |
| `src/services/` | Domain logic: resume parsing, ATS optimization, matching, fraud detection, multi-resume, reporting, content generation, skill gap |
| `src/db/` | `node:sqlite` connection + repository layer (all SQL lives here) |
| `src/core/` | Config (zod-validated), security (hashing, JWT, vault), middleware, validation, logging, storage, errors, shared types |

### Request flow

1. `express.json()` parses the body; `pino-http` logs the request.
2. `requireAuth` validates the `Authorization: Bearer <jwt>` header and attaches `req.user`.
3. The route validates input with a zod schema (`parseOrThrow`) and delegates to a repository or agent/service.
4. Errors bubble through `asyncHandler` to the central `errorHandler`.

## Frontend (`apps/frontend`)

React 18 + Vite + TypeScript. A single-page candidate portal with React Router. `src/lib/api.ts` is a thin typed fetch wrapper that attaches the JWT and talks to `VITE_API_URL` (default `/api`). `src/lib/auth.tsx` provides an auth context that gates the app: unauthenticated users see `/login`; authenticated users see the sidebar shell with pages for Dashboard, Resumes, Jobs, Applications, Reports, and Agents.

## The 15 Agents

All agents implement the `Agent` interface from `src/agents/base.ts`:

```ts
interface Agent {
  name: AgentName;
  description: string;
  run(context: AgentContext): Promise<AgentRunResult>;
}
```

Every run is recorded in the `agent_runs` table, so run history is always visible on the Agents page.

| # | Agent | Purpose |
| --- | --- | --- |
| 1 | `resume-parser` | Extracts structured data (skills, education, experience) from uploaded resumes |
| 2 | `resume-builder` | Creates tailored resume versions for a target job |
| 3 | `resume-optimizer` | ATS-optimizes against a JD; targets a score of 90+ |
| 4 | `job-search` | Searches all portals + the general web and persists jobs |
| 5 | `job-matching` | Scores a job against a resume with cosine similarity (target ≥ 0.75) |
| 6 | `application` | Auto-applies (safety-gated by `AUTOMATION_ENABLED`) |
| 7 | `reporting` | Compiles and delivers the daily report |
| 8 | `feedback` | Parses feedback (e.g. from rejections) into actionable items |
| 9 | `cover-letter` | Generates a tailored cover letter for a job |
| 10 | `interview-prep` | Generates at least 10 interview questions from a resume + JD |
| 11 | `skill-gap` | Highlights missing skills and suggests learning paths |
| 12 | `multi-resume` | Manages multiple resume versions for different targets |
| 13 | `job-tracker` | Tracks application status through the pipeline |
| 14 | `career-coach` | Advice + salary benchmarking |
| 15 | `fraud-detection` | Scores postings for fraud risk and sets verdicts |

### Orchestrator

`AgentOrchestrator` (`src/agents/orchestrator.ts`) runs:

- **Single agent** — `POST /agents/:name/run`.
- **Pipeline** — `POST /agents/pipeline`, the happy path:
  `resume-parser → resume-builder → resume-optimizer → job-search → job-matching → application → reporting`.
  Individual steps may be skipped without failing the run.
- **All agents** — `runAll()` iterates every registered agent.

## Data flow: a resume becomes an application

1. **Upload** — `POST /resumes` (multipart). `multer` buffers the file (5 MB limit), `extractTextFromBuffer` pulls raw text (PDF via `pdf-parse`, DOCX via `mammoth`, TXT direct), `parseResumeText` produces a `ParsedResume`, and the file is stored under `apps/backend/data/uploads/`.
2. **Search** — `POST /jobs/search` runs every portal scraper plus the general-web scraper. The web scraper discovers postings on any site (via DuckDuckGo's HTML endpoint, with Bing fallback) and extracts requirements (skills, experience, education, responsibilities, salary) from each page. Each job is passed through `assessFraud` and persisted with fraud flags/score.
3. **Match** — `POST /jobs/:id/match` compares the job description against the resume using keyword extraction + cosine similarity over token sets. The blended score is stored in the `matches` table.
4. **Optimize / tailor** — `POST /resumes/:id/optimize` returns an ATS report and tailored skills; `POST /resumes/:id/tailor` creates a new resume version for the job.
5. **Apply** — `POST /jobs/:id/apply` runs the Application Agent. In demo/safety mode this records the application with a generated cover letter and ATS score; with `AUTOMATION_ENABLED=true` it drives the portal flow with Playwright and retries up to 3 times.
6. **Report** — `POST /reports/daily` compiles a `ReportSummary` (totals, status breakdown, top companies) and "delivers" it via email/SMS (simulated unless SendGrid/Twilio keys are set).

## Security model

- **Passwords** — Argon2id via the `argon2` package, with a synchronous scrypt fallback (constant-time compare) if the native module is unavailable.
- **JWT** — Minimal local HS256 signer/verifier in `src/core/security.ts` (timing-safe signature comparison, `exp` honored). No external dependency needed.
- **Credential vault** — Portal credentials encrypted with AES-256-GCM; the key is derived from `VAULT_KEY` (32 bytes, hex).
- **Auth** — `/auth/oauth/:provider` is an OAuth2-style demo provider: it provisions a `demo.<provider>@jobsearch.local` user and issues a token without any external account.

## Availability & failure handling

- `searchAllPortals` uses `Promise.allSettled`, so one portal's failure never blocks the others.
- Scrapers fall back to demo data whenever `SCRAPER_DEMO_MODE=true` (default).
- Report delivery degrades gracefully: no SendGrid/Twilio keys → delivery is simulated and still recorded as `delivered`.
- PDF/DOCX extraction has embedded text-stream fallbacks when the primary engines fail.

## BDD test architecture

Two Cucumber suites cover the system:

| Suite | Where | Runs against | Command |
| --- | --- | --- | --- |
| Backend API | `apps/backend/features` + `test/steps` | In-process Express app on an ephemeral in-memory SQLite DB | `npm test` (root or backend) |
| Frontend E2E | `apps/frontend/e2e/features` + `e2e/steps` | Real Chromium via Playwright, against Vite dev server + live backend on :3001 | `npm run test:e2e` |

The backend harness boots the app once (`BeforeAll`) and resets the DB between scenarios (`Before`/`After`). See [bdd-guide.md](bdd-guide.md) for the workflow.
