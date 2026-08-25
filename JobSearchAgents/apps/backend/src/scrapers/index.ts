import type { Job } from '../core/types.js';
import { scrapers } from './portals.js';
import { config } from '../core/config.js';

/**
 * Runs every portal scraper (demo mode = instant sample data; live = Playwright).
 * Individual portal failures don't block the others.
 */
export async function searchAllPortals(query: string, location = '', demo = config.SCRAPER_DEMO_MODE): Promise<Job[]> {
  const results = await Promise.allSettled(
    scrapers.map((s) => s.search(query, location, demo)),
  );
  return results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
}

export async function searchPortal(
  portal: string,
  query: string,
  location = '',
  demo = config.SCRAPER_DEMO_MODE,
): Promise<Job[]> {
  const scraper = scrapers.find((s) => s.name === portal);
  if (!scraper) return [];
  return scraper.search(query, location, demo);
}

export * from './browser.js';
