import { chromium, type Browser, type Page } from 'playwright';
import { config } from '../core/config.js';
import { logger } from '../core/logger.js';

/**
 * Shared Playwright plumbing:
 * - browser launch (headless per config)
 * - stealth-ish context (real user agent, locale, viewport)
 * - captcha detection → wait + retry (best-effort; demo mode avoids portals)
 * - graceful teardown
 */

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

export async function launchBrowser(): Promise<Browser> {
  return chromium.launch({ headless: config.HEADLESS });
}

export async function newPage(browser: Browser): Promise<Page> {
  const context = await browser.newContext({
    userAgent: USER_AGENT,
    locale: 'en-US',
    viewport: { width: 1366, height: 768 },
  });
  return context.newPage();
}

/** Best-effort captcha handling: detect, pause, retry. */
export async function detectCaptcha(page: Page): Promise<boolean> {
  const selectors = [
    'iframe[src*="recaptcha"]',
    'iframe[src*="hcaptcha"]',
    '#captcha',
    '[class*="captcha"]',
    'form[action*="captcha"]',
  ];
  for (const sel of selectors) {
    if (await page.$(sel).catch(() => null)) {
      logger.warn({ sel }, 'Captcha detected — waiting for manual/automated solve');
      // Wait up to 20s for it to disappear; then re-check.
      try {
        await page.waitForSelector(sel, { state: 'detached', timeout: 20_000 });
      } catch {
        /* still present */
      }
      return true;
    }
  }
  return false;
}

/** Runs `fn` with up to `retries` attempts, handling transient failures. */
export async function withRetries<T>(
  fn: () => Promise<T>,
  retries = config.SCRAPER_RETRIES,
  label = 'operation',
): Promise<T> {
  let lastErr: unknown;
  for (let attempt = 1; attempt <= retries + 1; attempt += 1) {
    try {
      return await fn();
    } catch (err) {
      lastErr = err;
      logger.warn({ attempt, label, err }, `Retryable ${label} failed`);
    }
  }
  throw lastErr;
}

export async function closeBrowser(browser: Browser): Promise<void> {
  await browser.close().catch(() => undefined);
}
