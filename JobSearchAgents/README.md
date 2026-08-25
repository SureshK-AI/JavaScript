# JobSearchAgents — Multi-Agent Automated Job Search & Application Platform

A **TypeScript** implementation of the multi-agent job search platform from the DRD/SRS. It uploads and parses resumes, tailors and ATS-optimizes them, searches jobs across portals with **Playwright**, matches jobs with semantic similarity, auto-generates cover letters and interview questions, detects fraudulent postings, tracks applications, and delivers daily reports — all behind a React dashboard.

> **BDD from the ground up:** every behavior is specified in Gherkin `.feature` files. Backend behaviors are verified with **Cucumber (TS)**, frontend behaviors with **Playwright + Cucumber** end-to-end tests.

## Tech Stack (TypeScript-only)

| Layer | Technology |
| --- | --- |
| Language | TypeScript (Node 20+, ESM) |
| Backend | Express 5, modular router architecture |
| Database | `node:sqlite` (zero native deps; swap to PostgreSQL via `DATABASE_URL`) |
| Automation | **Playwright** for job portal scraping + auto-apply |
| Auth | OAuth2-style demo provider + JWT, AES-256 encrypted credential vault |
| Frontend | React 18 + Vite + TypeScript |
| Testing | **Cucumber (Gherkin BDD)** + `tsx` for backend; **Playwright + Cucumber** for E2E |
| Hosting | Render/Railway/Fly free tiers (API), Vercel free tier (frontend) |

## Repository Layout

```
JobSearchAgents/
├── apps/
│   ├── backend/
│   │   ├── features/            # Gherkin feature files (BDD specs)
│   │   ├── src/
│   │   │   ├── agents/          # 15 specialized agents + orchestrator
│   │   │   ├── scrapers/        # Playwright portal scrapers (Naukri, LinkedIn, Indeed, Glassdoor)
│   │   │   ├── services/        # Parsing, optimization, matching, fraud, reports, email
│   │   │   ├── routes/          # Express API routes
│   │   │   ├── db/              # SQLite/Postgres data layer + migrations
│   │   │   ├── core/            # config, security, logging, validation
│   │   │   └── app.ts           # Express app factory
│   │   └── test/                # Cucumber step definitions
│   └── frontend/
│       ├── src/                 # React candidate portal
│       └── e2e/                 # Playwright + Cucumber BDD E2E tests
├── docs/                        # Architecture, API, DB schema, deployment, BDD guide
└── package.json                 # npm workspaces root
```

## Quick Start

```bash
# 1. Install all workspace dependencies (backend + frontend)
npm install

# 2. Copy environment and generate secrets
cp .env.example .env        # Windows: copy .env.example .env
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"  # → JWT_SECRET + VAULT_KEY

# 3. Run backend BDD test suite (spins up the API and verifies all behaviors)
npm test

# 4. Start the backend API (default http://localhost:3001)
npm run dev:backend

# 5. In a second terminal, start the React dashboard (http://localhost:5173)
npm run dev:frontend

# 6. Run frontend E2E BDD suite (requires backend running + Playwright browsers)
npm run test:e2e
```

## Demo Mode & Safety

- **`SCRAPER_DEMO_MODE=true`** (default): scrapers return realistic sample jobs without touching live portals — fully offline-testable.
- **`AUTOMATION_ENABLED=false`** (default): automated application submission is disabled. Set it to `true` only when you have reviewed the auto-apply flow and accept the risk; the Application Agent then drives real portal flows with Playwright and retries failed submissions up to 3 times.
- Credentials for portals are stored encrypted (AES-256-GCM) in the **credential vault**.

## The 15 Agents

Resume Parser, Resume Builder, Resume Optimizer (ATS 90+), Job Search, Job Matching, Application, Reporting, Feedback, Cover Letter Generator, Interview Prep, Skill Gap Analyzer, Multi Resume Strategy, Job Tracker, Career Coach, Fraud Detection — orchestrated by the `AgentOrchestrator`.

See [docs/architecture.md](docs/architecture.md) for the full design and [docs/bdd-guide.md](docs/bdd-guide.md) for how features map to specs.
