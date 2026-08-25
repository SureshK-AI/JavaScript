# Testing the 15 Agents

This guide tells you exactly how to exercise every agent, from the **UI** and from the **API**, and what output to expect. All 15 agents have been verified working end to end (see the smoke script referenced below).

## 0. Prerequisites

```bash
cd JobSearchAgents
npm install
npm run dev:backend    # terminal 1 → API on http://localhost:3001
npm run dev:frontend   # terminal 2 → UI on http://localhost:5173
```

Then in the UI (http://localhost:5173):

1. **Login / Register** — create an account (or use the LinkedIn demo OAuth button).
2. **Resumes** → upload a resume (use a `.txt` — the `e2e-resume.txt` style file works great; PDF/DOCX also supported).
3. **Jobs** → click **Search jobs** (demo mode returns 4 portals × 4 sample jobs instantly). This seeds the jobs the agents need.

The **Agents** page has a **Context** panel at the top (resume dropdown, job dropdown, search query, report channel, application dropdown, status, and a recruiter-email box). Pick the resume/job there, then click **Run** on any agent. Agents that need a missing context show a red "missing: …" hint instead of erroring.

The **output** panel under the grid shows the full JSON result, and **Recent runs** records every run.

---

## The agents, grouped by what they need

### Group A — Resume-only agents (need a parsed resume)

| Agent | What it does | Expect |
| --- | --- | --- |
| `resume-parser` | Extracts skills/education/experience from the uploaded resume | `9 skills extracted`, parsed JSON |
| `career-coach` | Career advice + salary benchmark based on your stack | `4 coaching tips` + benchmark string |

**UI:** pick a resume in Context → Run.

**API:**
```bash
TOKEN=<your-jwt>
RESUME=<resume-id from GET /api/resumes>
curl -X POST http://localhost:3001/api/agents/resume-parser/run \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"resumeId\":\"$RESUME\"}"
curl -X POST http://localhost:3001/api/agents/career-coach/run \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"resumeId\":\"$RESUME\"}"
```

---

### Group B — Resume + job agents (need a parsed resume AND a job)

| Agent | What it does | Expect |
| --- | --- | --- |
| `resume-builder` | Builds a tailored resume version for the job | `Built "<role family>" version (ATS n)` + markdown content |
| `resume-optimizer` | ATS score + missing keywords + suggestions | `ATS score n (needs work / compliant ≥90)` + report |
| `job-matching` | Cosine-similarity match score vs the JD | `Match score 0.xx (n matched skills)` |
| `cover-letter` | Generates a tailored cover letter | Letter mentioning the job title & company |
| `interview-prep` | Generates practice questions | `Generated 10 practice questions` |
| `skill-gap` | Missing skills vs the JD | `Coverage xx% — n missing skills` + suggestions |
| `multi-resume` | Maintains/dedupes tailored versions | `Maintained n resume version(s) for role family "…"` |
| `application` | Auto-apply: generates cover letter + ATS score, records the application | `Applied to <company> — <title> (ATS n, attempt 1)` |

**UI:** pick a resume **and** a job in Context → Run.

**API:**
```bash
JOB=<job-id from GET /api/jobs>
curl -X POST http://localhost:3001/api/agents/resume-optimizer/run \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"resumeId\":\"$RESUME\",\"jobId\":\"$JOB\"}"
# same body works for resume-builder, job-matching, cover-letter,
# interview-prep, skill-gap, multi-resume, application
```

---

### Group C — No context / light context agents

| Agent | What it does | Expect |
| --- | --- | --- |
| `job-search` | Searches all portals (demo = sample jobs) | `Collected 16 jobs from 4 portals in Nms` |
| `reporting` | Builds + "delivers" the daily report | `Report for <date>: n applications, delivered via email` |
| `job-tracker` | Lists applications + optional status update | `Tracking n applications (submitted: n)` |
| `feedback` | Classifies a recruiter email into a status | `Classified recruiter email as "interview"` |
| `fraud-detection` | Scores a job for fraud indicators | `Verdict: legitimate (score 0) — 0 flag(s)` |

**`job-search`** — set the **Search query** (and optionally Location) in Context → Run.
```bash
curl -X POST http://localhost:3001/api/agents/job-search/run \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"query":"qa automation","location":""}'
```

**`reporting`** — set **Report channel** (email/sms) in Context → Run. Requires ≥1 application first (run `application` or the pipeline once).
```bash
curl -X POST http://localhost:3001/api/agents/reporting/run \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"channel":"email"}'
```

**`job-tracker`** — pick an **Application** in Context (optional: a new **Status**) → Run. Expect `Tracking n applications` and, if you picked a status, an `updated` object showing the status change.
```bash
curl -X POST http://localhost:3001/api/agents/job-tracker/run \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"applicationId":"<app-id>","status":"interview"}'
```

**`feedback`** — paste a recruiter email into the **Recruiter email** box → Run. It classifies by keywords and, if the email contains an `Application #<id>` reference, updates that application's status. Test emails:
```
Application #abc123: we would like to schedule an interview with you.
→ "interview"

We regret to inform you that we will not be moving forward with your application.
→ "rejected"

Congratulations, welcome to the team! Please sign the offer.
→ "offer"
```
```bash
curl -X POST http://localhost:3001/api/agents/feedback/run \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"email":"Application #abc123: we would like to schedule an interview with you."}'
```

**`fraud-detection`** — pick a **Job** in Context → Run. Legitimate sample jobs return `legitimate`. To see a real `fraudulent` verdict, insert a shady posting into SQLite:
```bash
# with the backend stopped
node -e "
const { DatabaseSync } = require('node:sqlite');
const db = new DatabaseSync('apps/data/jobsearch.db');
db.prepare(\"INSERT INTO jobs (id, portal, title, company, location, description, url) VALUES (?, ?, ?, ?, ?, ?, ?)\")
  .run('fraud-test', 'naukri', 'Easy Money Clerk', 'Unknown LLC', 'Remote',
       'No experience needed. Guaranteed income $900 per week. Wire money via Western Union to start. Reply to scam@gmail.com',
       'http://short.url/x');
"
# restart backend, then run the agent with jobId "fraud-test"
```
Expect: `Verdict: fraudulent (score 0.85+) — n flag(s)`.

---

## The full pipeline

The **Orchestrated pipeline** card runs `resume-parser → resume-builder → resume-optimizer → job-search → job-matching → application → reporting` in one pass using the Context (resume + job + query). Expect all 7 to succeed:
```bash
curl -X POST http://localhost:3001/api/agents/pipeline \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d "{\"resumeId\":\"$RESUME\",\"jobId\":\"$JOB\",\"query\":\"software engineer\"}"
```
Response: `results[]` (one per agent) + `successCount: 7, failedCount: 0`.

---

## Automated smoke test (all 15 agents)

A script exercising every agent with the correct context lives in the session scratchpad; the important part is the **expected output table** above. To run the full BDD suite that already covers most agents:

```bash
npm test          # backend BDD — 29 scenarios, includes agents.feature
```

## Troubleshooting

| Symptom | Cause / fix |
| --- | --- |
| Agent returns `missing_resume_or_job` / `missing_resume` / `missing_job` | You didn't pick a resume/job in the Context panel (or the resume isn't parsed — upload one). |
| `Missing userId` | `job-tracker`/`reporting` run outside the pipeline need an authenticated call — the UI sends your JWT automatically; via API ensure the `Bearer` header is present. |
| `No email content provided` | `feedback` needs text in the Recruiter email box / `email` body field. |
| `Job not found` / `Resume not found` | The id doesn't exist — re-search jobs or re-upload the resume, then refresh the Context dropdowns. |
| ATS score below 90 | Expected — the sample resume is generic. The optimizer tells you which keywords to add; add them to the resume text and re-upload to watch the score climb. |
