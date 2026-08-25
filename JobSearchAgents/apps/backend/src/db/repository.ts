/** Repository layer — all SQL access lives here. */

import crypto from 'node:crypto';
import { getDb } from './database.js';
import type {
  ApplicationStatus,
  Credentials,
  Job,
  ParsedResume,
  PortalName,
} from '../core/types.js';

function uuid(): string {
  return crypto.randomUUID();
}

type Row = Record<string, unknown>;

function rowToUser(row: Row) {
  return {
    id: String(row.id),
    email: String(row.email),
    name: String(row.name),
    provider: String(row.provider),
    createdAt: String(row.created_at),
  };
}

export const usersRepo = {
  create(input: { email: string; passwordHash: string; name: string; provider?: string }) {
    const db = getDb();
    const id = uuid();
    db.prepare(
      `INSERT INTO users (id, email, password_hash, name, provider) VALUES (?, ?, ?, ?, ?)`,
    ).run(id, input.email, input.passwordHash, input.name, input.provider ?? 'local');
    const row = db.prepare(`SELECT * FROM users WHERE id = ?`).get(id) as Row;
    return rowToUser(row);
  },
  findByEmail(email: string) {
    const row = getDb().prepare(`SELECT * FROM users WHERE email = ?`).get(email) as Row | undefined;
    return row ? { ...rowToUser(row), passwordHash: String(row.password_hash) } : undefined;
  },
  findById(id: string) {
    const row = getDb().prepare(`SELECT * FROM users WHERE id = ?`).get(id) as Row | undefined;
    return row ? rowToUser(row) : undefined;
  },
};

export const vaultRepo = {
  save(userId: string, creds: Credentials) {
    const db = getDb();
    db.prepare(
      `INSERT INTO credentials (id, user_id, portal, username, password_enc)
       VALUES (?, ?, ?, ?, ?)
       ON CONFLICT(user_id, portal) DO UPDATE SET username = excluded.username, password_enc = excluded.password_enc`,
    ).run(uuid(), userId, creds.portal ?? 'generic', creds.username, creds.password);
  },
  findByUser(userId: string) {
    const rows = getDb()
      .prepare(`SELECT portal, username, password_enc FROM credentials WHERE user_id = ?`)
      .all(userId) as Row[];
    return rows.map((r) => ({
      portal: String(r.portal),
      username: String(r.username),
      passwordEnc: String(r.password_enc),
    }));
  },
};

export const resumesRepo = {
  create(input: {
    userId: string;
    filename: string;
    mimeType: string;
    rawText?: string;
    parsedData?: ParsedResume;
    storagePath?: string;
  }) {
    const db = getDb();
    const id = uuid();
    db.prepare(
      `INSERT INTO resumes (id, user_id, filename, mime_type, raw_text, parsed_data, storage_path)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      input.userId,
      input.filename,
      input.mimeType,
      input.rawText ?? null,
      input.parsedData ? JSON.stringify(input.parsedData) : null,
      input.storagePath ?? null,
    );
    return this.findById(id);
  },
  findById(id: string) {
    const row = getDb().prepare(`SELECT * FROM resumes WHERE id = ?`).get(id) as Row | undefined;
    return row ? this.mapRow(row) : undefined;
  },
  listByUser(userId: string) {
    const rows = getDb()
      .prepare(`SELECT * FROM resumes WHERE user_id = ? ORDER BY created_at DESC`)
      .all(userId) as Row[];
    return rows.map((r) => this.mapRow(r));
  },
  mapRow(row: Row) {
    return {
      id: String(row.id),
      userId: String(row.user_id),
      filename: String(row.filename),
      mimeType: String(row.mime_type),
      version: String(row.version),
      rawText: row.raw_text ? String(row.raw_text) : undefined,
      parsedData: row.parsed_data ? (JSON.parse(String(row.parsed_data)) as ParsedResume) : undefined,
      storagePath: row.storage_path ? String(row.storage_path) : undefined,
      createdAt: String(row.created_at),
    };
  },
};

export const jobsRepo = {
  create(input: Job) {
    const db = getDb();
    const id = input.id ?? uuid();
    db.prepare(
      `INSERT INTO jobs (id, portal, title, company, location, description, url, salary, posted_at, skills, search_query, fraud_flags, fraud_score)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      input.portal,
      input.title,
      input.company,
      input.location ?? '',
      input.description ?? '',
      input.url ?? null,
      input.salary ?? null,
      input.postedAt ?? null,
      JSON.stringify(input.skills ?? []),
      input.searchQuery ?? null,
      JSON.stringify(input.fraudFlags ?? []),
      input.fraudScore ?? 0,
    );
    return this.findById(id);
  },
  findById(id: string) {
    const row = getDb().prepare(`SELECT * FROM jobs WHERE id = ?`).get(id) as Row | undefined;
    return row ? this.mapRow(row) : undefined;
  },
  list(opts?: { limit?: number; portal?: string; query?: string }) {
    const db = getDb();
    const clauses: string[] = [];
    const params: unknown[] = [];
    if (opts?.portal) {
      clauses.push('portal = ?');
      params.push(opts.portal);
    }
    if (opts?.query) {
      clauses.push('(title LIKE ? OR company LIKE ? OR description LIKE ?)');
      const like = `%${opts.query}%`;
      params.push(like, like, like);
    }
    const where = clauses.length ? `WHERE ${clauses.join(' AND ')}` : '';
    const limit = opts?.limit ?? 100;
    const rows = db
      .prepare(`SELECT * FROM jobs ${where} ORDER BY created_at DESC LIMIT ?`)
      .all(...params, limit) as Row[];
    return rows.map((r) => this.mapRow(r));
  },
  mapRow(row: Row): Job {
    return {
      id: String(row.id),
      portal: String(row.portal) as PortalName,
      title: String(row.title),
      company: String(row.company),
      location: String(row.location),
      description: String(row.description),
      url: row.url ? String(row.url) : undefined,
      salary: row.salary ? String(row.salary) : undefined,
      postedAt: row.posted_at ? String(row.posted_at) : undefined,
      skills: JSON.parse(String(row.skills ?? '[]')) as string[],
      searchQuery: row.search_query ? String(row.search_query) : undefined,
      fraudFlags: JSON.parse(String(row.fraud_flags ?? '[]')) as string[],
      fraudScore: Number(row.fraud_score),
      collectedAt: String(row.created_at),
    };
  },
};

export const applicationsRepo = {
  create(input: {
    userId: string;
    jobId: string;
    resumeId?: string;
    status?: ApplicationStatus;
    coverLetter?: string;
    atsScore?: number;
  }) {
    const db = getDb();
    const id = uuid();
    db.prepare(
      `INSERT INTO applications (id, user_id, job_id, resume_id, status, cover_letter, ats_score)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
    ).run(
      id,
      input.userId,
      input.jobId,
      input.resumeId ?? null,
      input.status ?? 'submitted',
      input.coverLetter ?? null,
      input.atsScore ?? null,
    );
    return this.findById(id);
  },
  findById(id: string) {
    const row = getDb().prepare(`SELECT * FROM applications WHERE id = ?`).get(id) as Row | undefined;
    return row ? this.mapRow(row) : undefined;
  },
  listByUser(userId: string) {
    const rows = getDb()
      .prepare(
        `SELECT a.*, j.title AS job_title, j.company AS job_company, j.portal AS job_portal
         FROM applications a JOIN jobs j ON j.id = a.job_id
         WHERE a.user_id = ? ORDER BY a.applied_at DESC`,
      )
      .all(userId) as Row[];
    return rows.map((r) => this.mapRow(r));
  },
  updateStatus(id: string, status: ApplicationStatus) {
    getDb()
      .prepare(`UPDATE applications SET status = ?, updated_at = datetime('now') WHERE id = ?`)
      .run(status, id);
    return this.findById(id);
  },
  countByUser(userId: string): number {
    const row = getDb()
      .prepare(`SELECT COUNT(*) AS n FROM applications WHERE user_id = ?`)
      .get(userId) as Row;
    return Number(row.n);
  },
  mapRow(row: Row) {
    return {
      id: String(row.id),
      userId: String(row.user_id),
      jobId: String(row.job_id),
      resumeId: row.resume_id ? String(row.resume_id) : undefined,
      status: String(row.status) as ApplicationStatus,
      coverLetter: row.cover_letter ? String(row.cover_letter) : undefined,
      atsScore: row.ats_score != null ? Number(row.ats_score) : undefined,
      attempts: Number(row.attempts),
      appliedAt: String(row.applied_at),
      updatedAt: String(row.updated_at),
      jobTitle: row.job_title ? String(row.job_title) : undefined,
      jobCompany: row.job_company ? String(row.job_company) : undefined,
      jobPortal: row.job_portal ? String(row.job_portal) : undefined,
    };
  },
};

export const reportsRepo = {
  create(input: { userId: string; period: string; summary: string; channel?: string }) {
    const db = getDb();
    const id = uuid();
    db.prepare(`INSERT INTO reports (id, user_id, period, summary, channel) VALUES (?, ?, ?, ?, ?)`).run(
      id,
      input.userId,
      input.period,
      input.summary,
      input.channel ?? 'email',
    );
    return this.findById(id);
  },
  findById(id: string) {
    const row = getDb().prepare(`SELECT * FROM reports WHERE id = ?`).get(id) as Row | undefined;
    return row
      ? {
          id: String(row.id),
          userId: String(row.user_id),
          period: String(row.period),
          summary: row.summary ? JSON.parse(String(row.summary)) : undefined,
          channel: String(row.channel),
          sentAt: String(row.sent_at),
        }
      : undefined;
  },
  listByUser(userId: string) {
    const rows = getDb()
      .prepare(`SELECT * FROM reports WHERE user_id = ? ORDER BY sent_at DESC`)
      .all(userId) as Row[];
    return rows.map((r) => ({
      id: String(r.id),
      period: String(r.period),
      channel: String(r.channel),
      sentAt: String(r.sent_at),
    }));
  },
};

export const matchesRepo = {
  create(input: {
    jobId: string;
    resumeId: string;
    score: number;
    matchedSkills: string[];
    missingSkills: string[];
    explanation: string;
  }) {
    getDb()
      .prepare(
        `INSERT INTO matches (id, job_id, resume_id, score, matched_skills, missing_skills, explanation)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        uuid(),
        input.jobId,
        input.resumeId,
        input.score,
        JSON.stringify(input.matchedSkills),
        JSON.stringify(input.missingSkills),
        input.explanation,
      );
  },
};

export const agentRunsRepo = {
  record(input: { agent: string; status: string; summary: string; data?: unknown; error?: string }) {
    getDb()
      .prepare(
        `INSERT INTO agent_runs (id, agent, status, summary, data, error) VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .run(
        uuid(),
        input.agent,
        input.status,
        input.summary,
        input.data ? JSON.stringify(input.data) : null,
        input.error ?? null,
      );
  },
  list(opts?: { limit?: number }) {
    const limit = opts?.limit ?? 50;
    const rows = getDb()
      .prepare(`SELECT * FROM agent_runs ORDER BY created_at DESC LIMIT ?`)
      .all(limit) as Row[];
    return rows.map((r) => ({
      id: String(r.id),
      agent: String(r.agent),
      status: String(r.status),
      summary: String(r.summary),
      data: r.data ? JSON.parse(String(r.data)) : undefined,
      error: r.error ? String(r.error) : undefined,
      createdAt: String(r.created_at),
    }));
  },
};

export const statsRepo = {
  dashboard(userId: string) {
    const db = getDb();
    const resumes = db
      .prepare(`SELECT COUNT(*) AS n FROM resumes WHERE user_id = ?`)
      .get(userId) as Row;
    const jobs = db.prepare(`SELECT COUNT(*) AS n FROM jobs`).get() as Row;
    const applications = db
      .prepare(`SELECT COUNT(*) AS n FROM applications WHERE user_id = ?`)
      .get(userId) as Row;
    const avgAts = db
      .prepare(`SELECT AVG(ats_score) AS avg FROM applications WHERE user_id = ? AND ats_score IS NOT NULL`)
      .get(userId) as Row;
    const byStatus = db
      .prepare(`SELECT status, COUNT(*) AS n FROM applications WHERE user_id = ? GROUP BY status`)
      .all(userId) as Row[];
    const topCompanies = db
      .prepare(
        `SELECT j.company, COUNT(*) AS n FROM applications a JOIN jobs j ON j.id = a.job_id
         WHERE a.user_id = ? GROUP BY j.company ORDER BY n DESC LIMIT 5`,
      )
      .all(userId) as Row[];
    return {
      totalResumes: Number(resumes.n),
      totalJobs: Number(jobs.n),
      totalApplications: Number(applications.n),
      avgAtsScore: avgAts.avg != null ? Math.round(Number(avgAts.avg)) : 0,
      applicationsByStatus: Object.fromEntries(byStatus.map((r) => [String(r.status), Number(r.n)])),
      topCompanies: topCompanies.map((r) => String(r.company)),
      interviews: Number(
        (byStatus.find((r) => String(r.status) === 'interview') as Row | undefined)?.n ?? 0,
      ),
      offers: Number((byStatus.find((r) => String(r.status) === 'offer') as Row | undefined)?.n ?? 0),
    };
  },
};
