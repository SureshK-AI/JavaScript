import type { Job, PortalName } from '../core/types.js';
import { sampleJobs } from './sampleJobs.js';

/**
 * Portal-specific scrapers. In demo mode they return sample data instantly;
 * in live mode they drive Playwright against the real portal. The live
 * selectors are best-effort starting points — portals change markup often,
 * and captcha handling is enforced (see browser.ts).
 */

export interface PortalScraper {
  name: PortalName;
  search(query: string, location: string, demo: boolean): Promise<Job[]>;
}

export const naukriScraper: PortalScraper = {
  name: 'naukri',
  async search(query, location, demo) {
    if (demo) return sampleJobs(query, 'naukri');
    const { liveSearch } = await import('./live.js');
    return liveSearch('naukri', query, location, {
      url: (q, loc) =>
        `https://www.naukri.com/${encodeURIComponent(q.replace(/\s+/g, '-'))}-jobs${loc ? `-in-${encodeURIComponent(loc.toLowerCase())}` : ''}`,
      card: '.jobTuple, [class*="jobTuple"]',
      title: '.title, [class*="title"] a',
      company: '.subTitle, [class*="subTitle"]',
      location: '.location, [class*="loc"]',
    });
  },
};

export const linkedinScraper: PortalScraper = {
  name: 'linkedin',
  async search(query, location, demo) {
    if (demo) return sampleJobs(query, 'linkedin');
    const { liveSearch } = await import('./live.js');
    return liveSearch('linkedin', query, location, {
      url: (q, loc) =>
        `https://www.linkedin.com/jobs/search?keywords=${encodeURIComponent(q)}&location=${encodeURIComponent(loc)}`,
      card: '.job-card-container, [data-job-id]',
      title: '.job-card-list__title, .base-search-card__title',
      company: '.job-card-container__company-name, .base-search-card__subtitle',
      location: '.job-card-container__metadata-wrapper, .job-search-card__location',
    });
  },
};

export const indeedScraper: PortalScraper = {
  name: 'indeed',
  async search(query, location, demo) {
    if (demo) return sampleJobs(query, 'indeed');
    const { liveSearch } = await import('./live.js');
    return liveSearch('indeed', query, location, {
      url: (q, loc) =>
        `https://www.indeed.com/jobs?q=${encodeURIComponent(q)}&l=${encodeURIComponent(loc)}`,
      card: '.job_seen_beacon, .result, [data-jk]',
      title: '.jobTitle, .title',
      company: '.companyName, [data-company-name]',
      location: '.companyLocation, .location',
    });
  },
};

export const glassdoorScraper: PortalScraper = {
  name: 'glassdoor',
  async search(query, location, demo) {
    if (demo) return sampleJobs(query, 'glassdoor');
    const { liveSearch } = await import('./live.js');
    return liveSearch('glassdoor', query, location, {
      url: (q, loc) =>
        `https://www.glassdoor.com/Job/jobs.htm?sc.keyword=${encodeURIComponent(q)}&locKeyword=${encodeURIComponent(loc)}`,
      card: 'li.react-job-listing, [data-test="jobListing"]',
      title: 'a.jobTitle, [data-test="job-title"]',
      company: '[data-test="employer-name"], .employer-name',
      location: '[data-test="job-location"], .location',
    });
  },
};

export const scrapers: PortalScraper[] = [
  naukriScraper,
  linkedinScraper,
  indeedScraper,
  glassdoorScraper,
];
