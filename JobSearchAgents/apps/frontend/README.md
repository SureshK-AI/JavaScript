# JobSearchAgents — Frontend

React 18 + Vite + TypeScript candidate portal. Talks to the backend API at `VITE_API_URL` (default `http://localhost:3001/api`).

## Scripts

```bash
npm run dev        # Vite dev server (http://localhost:5173)
npm run build      # tsc + vite build
npm run preview    # serve the production build
npm run typecheck  # tsc --noEmit
npm run test:e2e   # Playwright + Cucumber BDD E2E suite (needs backend on :3001)
```

## Pages

- `/login` — candidate login/register + OAuth demo
- `/` — dashboard (stats: resumes, jobs, applications, ATS, interviews, offers)
- `/resumes` — upload (PDF/DOCX/TXT), parse result, tailor/optimize
- `/jobs` — search portals (Naukri/LinkedIn/Indeed/Glassdoor), match against resume, apply
- `/applications` — application history + status updates
- `/reports` — daily report generation + history
- `/agents` — run the 15 agents / full pipeline, view run history

## BDD E2E

The E2E suite lives in `e2e/`: Gherkin features in `e2e/features/*.feature`, step definitions in `e2e/steps/*.ts`, wired through `e2e/cucumber.json` and `e2e/playwright.config.ts`. It boots the Vite dev server, drives the real UI with Playwright, and asserts against the live backend (run `npm run dev:backend` first).
