import type { Agent, AgentContext, AgentRunResult } from './base.js';
import { searchAllPortals } from '../scrapers/index.js';
import { jobsRepo } from '../db/repository.js';
import { config } from '../core/config.js';

/** 5. Job Search Agent — searches all portals plus the general web via Playwright (or demo). */
export const jobSearchAgent: Agent = {
  name: 'job-search',
  description: 'Searches Naukri, LinkedIn, Indeed, Glassdoor and the web for jobs.',
  async run(context: AgentContext): Promise<AgentRunResult> {
    const query = String(context.query ?? context.q ?? 'software engineer');
    const location = String(context.location ?? '');
    const startedAt = Date.now();
    try {
      const jobs = await searchAllPortals(query, location, config.SCRAPER_DEMO_MODE);
      let stored = 0;
      for (const job of jobs) {
        if (job.title && job.company) {
          jobsRepo.create({ ...job, searchQuery: query });
          stored += 1;
        }
      }
      const elapsed = Date.now() - startedAt;
      return {
        agent: this.name,
        status: 'success',
        summary: `Collected ${stored} jobs from ${new Set(jobs.map((j) => j.portal)).size} portals in ${elapsed}ms.`,
        data: { stored, elapsed, demoMode: config.SCRAPER_DEMO_MODE },
      };
    } catch (err) {
      return {
        agent: this.name,
        status: 'error',
        summary: `Search failed: ${(err as Error).message}`,
        error: (err as Error).message,
      };
    }
  },
};
