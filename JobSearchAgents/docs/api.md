# API Contract

Base URL: `http://localhost:3001/api` (configurable via `API_BASE_URL`).

All endpoints except `/auth/*` and `/health` require an `Authorization: Bearer <jwt>` header. Errors are returned as JSON: `{ "error": "message" }` with an appropriate HTTP status.

## Conventions

- Request bodies are JSON (`Content-Type: application/json`), except resume upload which is `multipart/form-data`.
- Validation is done with zod; invalid input returns `400` with the field errors.
- IDs are UUIDs generated server-side.
- Timestamps are ISO-8601 strings (SQLite `datetime('now')`, UTC).

## Health

### `GET /health`

No auth required.

```json
{ "status": "ok", "service": "jobsearch-agents", "time": "2026-08-25T00:00:00.000Z" }
```

## Auth

### `POST /auth/register`

Create a candidate account.

Body: `{ "email": string, "password": string (min 8), "name": string }`

- `201` — `{ "user": { id, email, name }, "token": string, "expiresIn": number }`
- `409` — email already registered

### `POST /auth/login`

Body: `{ "email": string, "password": string }`

- `200` — `{ "user": { id, email, name, provider }, "token": string, "expiresIn": number }`
- `401` — invalid credentials

### `GET /auth/oauth/:provider`

OAuth2-style demo provider. Creates (or reuses) a `demo.<provider>@jobsearch.local` user and returns a JWT. `provider` is any string, e.g. `linkedin`.

- `200` — `{ "user": { id, email, name, provider }, "token": string, "provider": string }`
- `403` — OAuth disabled (`OAUTH_ENABLED=false`)

### `GET /auth/me`

Current candidate profile. Requires auth.

- `200` — `{ "user": { id, email, name, provider, createdAt } }`
- `404` — user no longer exists

### `POST /auth/vault`

Save encrypted portal credentials (AES-256-GCM).

Body: `{ "portal": string, "username": string, "password": string }`

- `201` — `{ "ok": true, "portal": string }`

## Resumes

### `POST /resumes`

Upload and parse a resume. `multipart/form-data`, field `file`. Accepted: PDF, DOCX, TXT (max 5 MB).

- `201` — `{ "resume": { id, filename, mimeType, ... }, "parsed": ParsedResume, "parseTimeMs": number }`
- `400` — no file in field `file`
- `415` — unsupported file type

### `GET /resumes`

List the candidate's resumes (newest first).

- `200` — `{ "resumes": Resume[] }`

### `GET /resumes/:id`

- `200` — `{ "resume": Resume }`
- `404` — not found or not owned by the caller

### `POST /resumes/:id/tailor`

Create a tailored resume version for a job (Multi Resume Agent).

Body: `{ "jobId": string }`

- `200` — `{ "version": { ... } }`
- `404` — resume or job not found
- `422` — resume has no parsed data

## Jobs

### `POST /jobs/search`

Search all portals (or one). Each job is fraud-scored and persisted. Demo mode (`demo: true` or `SCRAPER_DEMO_MODE=true`) returns sample data instantly.

Body: `{ "query"?: string (default "software engineer"), "location"?: string, "portal"?: "naukri"|"linkedin"|"indeed"|"glassdoor", "demo"?: boolean }`

- `200` — `{ "jobs": Job[], "stored": number, "demoMode": boolean, "elapsedMs": number }`

### `GET /jobs`

List stored jobs. Optional query params: `portal`, `q` (matches title/company/description).

- `200` — `{ "jobs": Job[] }`

### `GET /jobs/:id`

- `200` — `{ "job": Job }`
- `404` — not found

### `POST /jobs/:id/match`

Match a job against a resume (cosine similarity over keyword sets; target ≥ 0.75).

Body: `{ "resumeId": string }`

- `200` — `{ "match": { jobId, resumeId, score, matchedSkills: string[], missingSkills: string[], explanation } }`
- `404` — job or resume not found / not parsed

## Applications

### `POST /jobs/:jobId/apply`

Auto-apply to a job. Runs the Application Agent; records the application with a generated cover letter and ATS score. Actual portal submission happens only when `AUTOMATION_ENABLED=true`.

Body: `{ "resumeId": string }`

- `201` — Application Agent result
- `404` — job or resume not found
- `502` — agent run failed

### `GET /applications`

Candidate application history (joins job title/company/portal).

- `200` — `{ "applications": Application[] }`

### `PATCH /applications/:id/status`

Update application status.

Body: `{ "status": "submitted"|"viewed"|"shortlisted"|"interview"|"offer"|"rejected"|"withdrawn" }`

- `200` — `{ "application": Application }`
- `404` — not found or not owned by the caller

## Reports

### `POST /reports/daily`

Generate and deliver the daily report. Delivery is simulated unless SendGrid/Twilio keys are configured.

Body: `{ "period"?: string (YYYY-MM-DD, default today), "channel"?: "email"|"sms" (default "email") }`

- `201` — `{ "report": { id, period, channel, sentAt }, "summary": ReportSummary, "delivery": { delivered, channel } }`

### `GET /reports`

Report history (newest first).

- `200` — `{ "reports": [{ id, period, channel, sentAt }] }`

## Agents

### `GET /agents`

List all registered agents.

- `200` — `{ "agents": [{ name, description }] }`

### `POST /agents/:name/run`

Run one agent. Accepts optional context: `resumeId`, `jobId`, `query`, `location`, `email`, `period`, `channel`, `status`, `applicationId`, `attempts`.

- `200` — `{ agent, status: "success"|"skipped"|"error", summary, data? }`
- `502` — agent returned an error status

### `POST /agents/pipeline`

Run the full orchestrated pipeline: `resume-parser → resume-builder → resume-optimizer → job-search → job-matching → application → reporting`.

- `200` — `{ results: AgentRunResult[], successCount, failedCount }`

### `GET /agents/runs`

Recent agent run history (max 50, newest first).

- `200` — `{ "runs": [{ id, agent, status, summary, data?, error?, createdAt }] }`

## Dashboard

### `GET /dashboard/stats`

Aggregate statistics for the candidate.

- `200` — `{ "stats": { totalResumes, totalJobs, totalApplications, avgAtsScore, applicationsByStatus, topCompanies: string[], interviews, offers } }`

## Error format

```json
{ "error": "Human-readable message" }
```

Common statuses: `400` validation, `401` missing/invalid token, `404` not found, `409` conflict, `415` unsupported media type, `422` unprocessable, `502` agent failure.
