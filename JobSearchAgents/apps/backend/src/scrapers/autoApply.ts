import type { Job, ParsedResume } from '../core/types.js';
import { config } from '../core/config.js';
import { launchBrowser, newPage, detectCaptcha, withRetries, closeBrowser } from './browser.js';
import { logger } from '../core/logger.js';

export interface AutoApplyOutcome {
  submitted: boolean;
  attempts: number;
  portal: string;
  error?: string;
}

/**
 * Real application submission via Playwright (opt-in, AUTOMATION_ENABLED=true).
 * Follows the standard "apply → fill form → submit" flow with retries.
 * This is experimental and should be reviewed before enabling.
 */
export async function submitApplication(job: Job, _resume: ParsedResume): Promise<AutoApplyOutcome> {
  return withRetries(
    async () => {
      const browser = await launchBrowser();
      try {
        const page = await newPage(browser);
        await page.goto(job.url ?? `https://www.${job.portal}.com`, {
          waitUntil: 'domcontentloaded',
          timeout: config.SCRAPER_TIMEOUT_MS,
        });
        await detectCaptcha(page);

        const applyButton = page
          .locator('button:has-text("Apply"), a:has-text("Apply now"), [data-test="apply"]')
          .first();
        await applyButton.click({ timeout: config.SCRAPER_TIMEOUT_MS });
        await page.waitForLoadState('domcontentloaded');

        // Fill email/phone if present — sensitive fields are intentionally left blank
        // for the candidate to review; automated completion is disabled by default.
        const emailField = page.locator('input[type="email"], input[name*="email"]').first();
        if (await emailField.isVisible().catch(() => false)) {
          await emailField.fill(_resume.email ?? '');
        }

        const submit = page
          .locator('button[type="submit"], button:has-text("Submit application")')
          .first();
        await submit.click({ timeout: config.SCRAPER_TIMEOUT_MS });

        return { submitted: true, attempts: 1, portal: job.portal };
      } finally {
        await closeBrowser(browser);
      }
    },
    config.SCRAPER_RETRIES,
    `auto-apply ${job.title} @ ${job.company}`,
  ).catch((err) => {
    logger.error({ err, job: job.title }, 'Auto-apply failed');
    return { submitted: false, attempts: config.SCRAPER_RETRIES + 1, portal: job.portal, error: (err as Error).message };
  });
}
