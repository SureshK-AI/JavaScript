import { BeforeAll, AfterAll, Before, After } from '@cucumber/cucumber';

// Env vars are set by test/env.ts (imported first via cucumber.json) so the
// app's config module is evaluated with the test database path.
import { createApp } from '../src/app.ts';
import type { Express } from 'express';
import { resetDb } from '../src/db/database.ts';

let app: Express | null = null;

export function getApp(): Express {
  if (!app) throw new Error('App not initialized — did the test harness run?');
  return app;
}

BeforeAll(async () => {
  app = createApp();
  (globalThis as Record<string, unknown>).__app = app;
});

AfterAll(async () => {
  app = null;
  delete (globalThis as Record<string, unknown>).__app;
});

Before(async () => {
  resetDb();
});

After(async () => {
  // Clean state between scenarios.
  resetDb();
});
