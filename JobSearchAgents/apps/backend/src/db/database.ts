/** Central database layer built on node:sqlite (or PostgreSQL via DATABASE_URL). */

import { DatabaseSync } from 'node:sqlite';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config } from '../core/config.js';
import { logger } from '../core/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export type Db = DatabaseSync;

let singleton: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (singleton) return singleton;
  const isPostgres = config.DATABASE_URL.startsWith('postgres');
  if (isPostgres) {
    throw new Error(
      'PostgreSQL adapter not bundled — set DATABASE_URL to sqlite:// (default) or implement the pg adapter.',
    );
  }
  // `:memory:` must not be resolved to a real path — keep it in RAM.
  const dbPath = config.DB_FILE.trim() === ':memory:' ? ':memory:' : path.resolve(config.DB_FILE);
  if (dbPath !== ':memory:') {
    fs.mkdirSync(path.dirname(dbPath), { recursive: true });
  }
  const db = new DatabaseSync(dbPath);
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');
  singleton = db;
  return db;
}

/** Resets the database (used by the BDD test harness between scenarios). */
export function resetDb(): void {
  if (singleton) {
    try {
      singleton.close();
    } catch {
      /* ignore */
    }
    singleton = null;
  }
  getDb();
  runMigrations();
}

export function runMigrations(): void {
  const db = getDb();
  const migrations = [
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      provider TEXT NOT NULL DEFAULT 'local',
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS credentials (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      portal TEXT NOT NULL,
      username TEXT NOT NULL,
      password_enc TEXT NOT NULL,
      created_at TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(user_id, portal)
    );`,
    `CREATE TABLE IF NOT EXISTS resumes (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      filename TEXT NOT NULL,
      mime_type TEXT NOT NULL,
      version TEXT NOT NULL DEFAULT 'v1',
      raw_text TEXT,
      parsed_data TEXT,
      storage_path TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS jobs (
      id TEXT PRIMARY KEY,
      portal TEXT NOT NULL,
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT NOT NULL DEFAULT '',
      description TEXT NOT NULL DEFAULT '',
      url TEXT,
      salary TEXT,
      posted_at TEXT,
      skills TEXT DEFAULT '[]',
      search_query TEXT,
      fraud_flags TEXT DEFAULT '[]',
      fraud_score REAL DEFAULT 0,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS applications (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      resume_id TEXT REFERENCES resumes(id) ON DELETE SET NULL,
      status TEXT NOT NULL DEFAULT 'submitted',
      cover_letter TEXT,
      ats_score INTEGER,
      attempts INTEGER NOT NULL DEFAULT 1,
      applied_at TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS reports (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      period TEXT NOT NULL,
      summary TEXT,
      channel TEXT NOT NULL DEFAULT 'email',
      sent_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS matches (
      id TEXT PRIMARY KEY,
      job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      resume_id TEXT NOT NULL REFERENCES resumes(id) ON DELETE CASCADE,
      score REAL NOT NULL,
      matched_skills TEXT DEFAULT '[]',
      missing_skills TEXT DEFAULT '[]',
      explanation TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`,
    `CREATE TABLE IF NOT EXISTS agent_runs (
      id TEXT PRIMARY KEY,
      agent TEXT NOT NULL,
      status TEXT NOT NULL,
      summary TEXT,
      data TEXT,
      error TEXT,
      created_at TEXT NOT NULL DEFAULT (datetime('now'))
    );`,
  ];
  for (const sql of migrations) {
    db.exec(sql);
  }
  logger.debug('Database migrations applied');
}
