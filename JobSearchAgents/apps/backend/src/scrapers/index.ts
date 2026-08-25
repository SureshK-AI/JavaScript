import type { Job, PortalName } from '../core/types.js';
import { scrapers } from './portals.js';
import { searchWebJobs } from './webSearch.js';
import { config } from '../core/config.js';

/**
 * Runs every scraper — the four job portals plus the general-web scraper
 * (demo mode = instant sample data; live = Playwright). Individual failures
 * don't block the others.
 */
export async function searchAllPortals(query: string, location = '', demo = config.SCRAPER_DEMO_MODE): Promise<Job[]> {
  const results = await Promise.allSettled([
    ...scrapers.map((s) => s.search(query, location, demo)),
    searchWebJobs(query, location, demo),
  ]);
  return results.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));
}

export async function searchPortal(
  portal: string,
  query: string,
  location = '',
  demo = config.SCRAPER_DEMO_MODE,
): Promise<Job[]> {
  if (portal === 'web') return searchWebJobs(query, location, demo);
  const scraper = scrapers.find((s) => s.name === portal);
  if (!scraper) return [];
  return scraper.search(query, location, demo);
}

export { searchWebJobs, sampleWebJobs, extractRequirements } from './webSearch.js';
export * from './browser.js';

/** Sources understood by /jobs/search (portals + web). */
export const SEARCH_SOURCES = ['naukri', 'linkedin', 'indeed', 'glassdoor', 'web'] as const;
