import type { Job, PortalName } from '../core/types.js';
import { config } from '../core/config.js';
import { launchBrowser, newPage, detectCaptcha, closeBrowser } from './browser.js';

interface LiveSelectorSet {
  url: (query: string, location: string) => string;
  card: string;
  title: string;
  company: string;
  location: string;
}

/**
 * Generic live portal search using the configured selectors. Best-effort:
 * portals change their markup; failures are caught and reported rather than
 * crashing the pipeline.
 */
export async function liveSearch(
  portal: PortalName,
  query: string,
  location: string,
  selectors: LiveSelectorSet,
): Promise<Job[]> {
  const browser = await launchBrowser();
  try {
    const page = await newPage(browser);
    await page.goto(selectors.url(query, location), {
      waitUntil: 'domcontentloaded',
      timeout: config.SCRAPER_TIMEOUT_MS,
    });
    await detectCaptcha(page);
    await page.waitForSelector(selectors.card, { timeout: config.SCRAPER_TIMEOUT_MS });

    const jobs = (await page.$$eval(
      selectors.card,
      (cards, sels) => {
        const map = (el: Element, sel: string) =>
          el.querySelector(sel)?.textContent?.trim() ?? '';
        return cards.slice(0, 10).map((card) => ({
          title: map(card, sels.title),
          company: map(card, sels.company),
          location: map(card, sels.location),
          description: map(card, sels.title),
          url: card.querySelector('a')?.getAttribute('href') ?? undefined,
        }));
      },
      selectors,
    )) as Array<{
      title: string;
      company: string;
      location: string;
      description: string;
      url?: string;
    }>;

    return jobs
      .filter((j) => j.title && j.company)
      .map((j) => ({ ...j, portal, searchQuery: query }));
  } finally {
    await closeBrowser(browser);
  }
}
