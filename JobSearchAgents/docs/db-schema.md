# Database Schema

The default database is SQLite via `node:sqlite` (`DatabaseSync`), stored at `apps/backend/data/jobsearch.db` with WAL mode and foreign keys enabled. The connection and migrations live in `src/db/database.ts`; **all SQL access** goes through the repository layer in `src/db/repository.ts`.

Setting `DATABASE_URL` to a Postgres DSN is supported by config but the Postgres adapter is **not bundled** — the app throws a clear error at startup. To use Postgres, implement the adapter in `getDb()`.

## Migrations

Migrations are idempotent `CREATE TABLE IF NOT EXISTS` statements run on every app boot (and on every `resetDb()` between BDD scenarios).

## Tables

### `users`

Candidate accounts.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | TEXT PK | UUID |
| `email` | TEXT UNIQUE NOT NULL | Login identifier |
| `password_hash` | TEXT NOT NULL | Argon2id (`argon2$...`) or `scrypt$salt$hash` fallback |
| `name` | TEXT NOT NULL | Display name |
| `provider` | TEXT NOT NULL | `'local'` or OAuth provider (e.g. `'linkedin'`) |
| `created_at` | TEXT NOT NULL | `datetime('now')` |

### `credentials`

Encrypted portal credentials (credential vault).

| Column | Type | Notes |
| --- | --- | --- |
| `id` | TEXT PK | UUID |
| `user_id` | TEXT NOT NULL | FK → `users.id` ON DELETE CASCADE |
| `portal` | TEXT NOT NULL | e.g. `naukri`, `linkedin` |
| `username` | TEXT NOT NULL | Plaintext portal username |
| `password_enc` | TEXT NOT NULL | AES-256-GCM payload (`v1:iv:tag:ciphertext`, base64) |
| `created_at` | TEXT NOT NULL | `datetime('now')` |

Unique constraint: `(user_id, portal)` — upsert on save.

### `resumes`

Uploaded resumes and their parse results.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | TEXT PK | UUID |
| `user_id` | TEXT NOT NULL | FK → `users.id` ON DELETE CASCADE |
| `filename` | TEXT NOT NULL | Original filename |
| `mime_type` | TEXT NOT NULL | e.g. `application/pdf`, `text/plain` |
| `version` | TEXT NOT NULL | Default `'v1'` (multi-resume versions) |
| `raw_text` | TEXT | Extracted plain text |
| `parsed_data` | TEXT | JSON-encoded `ParsedResume` |
| `storage_path` | TEXT | Upload file path under `data/uploads/` |
| `created_at` | TEXT NOT NULL | `datetime('now')` |

### `jobs`

Job postings collected from portals.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | TEXT PK | UUID |
| `portal` | TEXT NOT NULL | `naukri` / `linkedin` / `indeed` / `glassdoor` |
| `title` | TEXT NOT NULL | |
| `company` | TEXT NOT NULL | |
| `location` | TEXT NOT NULL | Default `''` |
| `description` | TEXT NOT NULL | JD text (ATS/matching input) |
| `url` | TEXT | Original posting URL |
| `salary` | TEXT | Raw salary string |
| `posted_at` | TEXT | Portal-provided date |
| `skills` | TEXT | JSON array of skills |
| `search_query` | TEXT | Query that collected the job |
| `fraud_flags` | TEXT | JSON array of flag strings |
| `fraud_score` | REAL | 0..1 risk score, default 0 |
| `created_at` | TEXT NOT NULL | `datetime('now')` |

### `applications`

Application history. The list endpoint joins `jobs` to surface `job_title`, `job_company`, `job_portal`.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | TEXT PK | UUID |
| `user_id` | TEXT NOT NULL | FK → `users.id` ON DELETE CASCADE |
| `job_id` | TEXT NOT NULL | FK → `jobs.id` ON DELETE CASCADE |
| `resume_id` | TEXT | FK → `resumes.id` ON DELETE SET NULL |
| `status` | TEXT NOT NULL | `submitted` / `viewed` / `shortlisted` / `interview` / `offer` / `rejected` / `withdrawn` |
| `cover_letter` | TEXT | Generated cover letter |
| `ats_score` | INTEGER | 0..100 from the ATS optimizer |
| `attempts` | INTEGER NOT NULL | Auto-apply retry count, default 1 |
| `applied_at` | TEXT NOT NULL | `datetime('now')` |
| `updated_at` | TEXT NOT NULL | `datetime('now')` |

### `reports`

Daily report history.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | TEXT PK | UUID |
| `user_id` | TEXT NOT NULL | FK → `users.id` ON DELETE CASCADE |
| `period` | TEXT NOT NULL | YYYY-MM-DD |
| `summary` | TEXT | JSON-encoded `ReportSummary` |
| `channel` | TEXT NOT NULL | `email` / `sms`, default `email` |
| `sent_at` | TEXT NOT NULL | `datetime('now')` |

### `matches`

Job ↔ resume matching results.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | TEXT PK | UUID |
| `job_id` | TEXT NOT NULL | FK → `jobs.id` ON DELETE CASCADE |
| `resume_id` | TEXT NOT NULL | FK → `resumes.id` ON DELETE CASCADE |
| `score` | REAL NOT NULL | 0..1 blended similarity |
| `matched_skills` | TEXT | JSON array |
| `missing_skills` | TEXT | JSON array |
| `explanation` | TEXT | Human-readable match rationale |
| `created_at` | TEXT NOT NULL | `datetime('now')` |

### `agent_runs`

Run history for the 15 agents and the orchestrator.

| Column | Type | Notes |
| --- | --- | --- |
| `id` | TEXT PK | UUID |
| `agent` | TEXT NOT NULL | Agent name, e.g. `job-search` |
| `status` | TEXT NOT NULL | `success` / `skipped` / `error` |
| `summary` | TEXT | Human-readable outcome |
| `data` | TEXT | JSON-encoded agent result payload |
| `error` | TEXT | Error message when status is `error` |
| `created_at` | TEXT NOT NULL | `datetime('now')` |

## Relationships

```
users 1───* credentials
users 1───* resumes
users 1───* applications *───1 jobs
resumes 1───* applications
resumes 1───* matches *───1 jobs
users 1───* reports
agent_runs (standalone audit log)
```

## Test isolation

The BDD harness (`apps/backend/test/env.ts`) overrides `DB_FILE`/`DATABASE_URL` to `:memory:` and `resetDb()` closes + recreates the connection and re-runs migrations before/after every scenario, so the suite never touches the real `data/jobsearch.db`.
