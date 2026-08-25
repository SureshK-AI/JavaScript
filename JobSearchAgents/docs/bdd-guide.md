# BDD Guide

The platform is specified and verified with Gherkin BDD end to end. There are two Cucumber suites:

| Suite | Location | Verifies | Boots |
| --- | --- | --- | --- |
| Backend API | `apps/backend/features/*.feature` + `apps/backend/test/` | HTTP behavior of the Express API | The app in-process on an in-memory SQLite DB |
| Frontend E2E | `apps/frontend/e2e/features/*.feature` + `apps/frontend/e2e/` | Real UI behavior | Vite dev server + Chromium (Playwright) against the live backend on :3001 |

## Running the suites

```bash
# Backend BDD (from the repo root or apps/backend)
npm test

# Frontend E2E (needs the backend running on :3001 and Playwright browsers installed)
npm run dev:backend     # terminal 1
npm run test:e2e        # terminal 2
```

## Backend suite

### Layout

```
apps/backend/
├── cucumber.json            # loader config (tsx, feature paths, step imports)
├── features/                # Gherkin specs
│   ├── auth.feature
│   ├── resume.feature
│   ├── jobs.feature
│   ├── applications.feature
│   ├── ats.feature
│   └── agents.feature
└── test/
    ├── env.ts               # sets NODE_ENV=test + in-memory DB BEFORE any import
    ├── environment.ts       # Cucumber hooks: boots the app, resets DB per scenario
    ├── support/             # shared helpers
    └── steps/               # step definitions (one file per feature area)
```

### How it works

1. `cucumber.json` imports `test/env.ts` **first**. Because ESM evaluates imports before module bodies, the env vars (`DB_FILE=:memory:`, test secrets, silent logging) are set before any `src/` module is loaded.
2. `BeforeAll` calls `createApp()` — the same app factory the real server uses — so the suite tests the actual Express wiring.
3. `Before`/`After` call `resetDb()`, which closes the connection, reopens it, and re-runs migrations. Every scenario starts from a clean slate.
4. Step definitions issue real HTTP requests against the in-process app and assert on status codes and bodies.

### Adding a behavior (backend)

1. Write the behavior as a scenario in the matching `features/*.feature` file:

   ```gherkin
   Scenario: Candidate can retrieve their uploaded resumes
     Given a registered candidate with a parsed resume
     When the candidate lists their resumes
     Then the API returns status 200
     And the response contains at least 1 resume
   ```

2. Implement each new step in `test/steps/` (or reuse an existing one). The world object tracks the last response and authenticated token.
3. Run `npm test` — the scenario must pass.

## Frontend E2E suite

### Layout

```
apps/frontend/e2e/
├── cucumber.json            # feature paths + step/support imports
├── playwright.config.ts     # Chromium project, baseURL :5173
├── features/                # login, resume, jobs, reports
├── steps/                   # step definitions using Playwright
└── support/
    └── world.ts             # launches one Chromium browser; fresh page per scenario
```

### How it works

- `world.ts` launches a single headless Chromium for the whole run and gives each scenario a fresh page (`baseURL: http://localhost:5173`).
- Steps drive the real UI with Playwright (`page.getByLabel`, `getByRole`, `getByTestId`, …) and seed data by calling the backend API directly (`this.apiBase = http://localhost:3001/api`).
- The suite expects a live backend on :3001 — start it with `npm run dev:backend` first.

### Adding an E2E behavior

1. Add a scenario to `apps/frontend/e2e/features/*.feature`.
2. Add step definitions in `e2e/steps/*.ts` using the `E2EWorld` type (`this.page`, `this.apiBase`).
3. Run the backend, then `npm run test:e2e`.

## Convention notes

- **One behavior per scenario** — scenarios read as user stories ("As a candidate, I want… So that…").
- **Tags** group scenarios: `@candidate`, `@authentication`, `@reporting`, `@career`, etc.
- **Assertions live in steps, not features** — feature files stay human-readable; step definitions carry the Playwright `expect` / HTTP assertions.
- **Deterministic data** — E2E scenarios register unique emails (`e2e-${Date.now()}@example.com`) so runs don't collide.
- The backend suite currently passes **29 scenarios / 136 steps** and is the project's primary regression net.
