import { Before, After, BeforeAll, AfterAll } from '@cucumber/cucumber';
import { chromium, type Browser, type Page } from '@playwright/test';

/**
 * E2E world — one Chromium browser for the whole run; a fresh page per scenario.
 * The backend must be running on :3001 (npm run dev:backend).
 */

let browser: Browser;

export interface E2EWorld {
  page: Page;
  apiBase: string;
}

BeforeAll({ timeout: 60_000 }, async () => {
  browser = await chromium.launch({ headless: true });
});

AfterAll(async () => {
  await browser.close();
});

Before({ timeout: 30_000 }, async function (this: E2EWorld) {
  this.page = await browser.newPage({ baseURL: 'http://localhost:5173' });
  this.apiBase = 'http://localhost:3001/api';
});

After(async function (this: E2EWorld) {
  await this.page.close();
});
