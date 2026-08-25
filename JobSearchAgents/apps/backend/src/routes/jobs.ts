import { Router } from 'express';
import { z } from 'zod';
import { jobsRepo, matchesRepo, resumesRepo } from '../db/repository.js';
import { searchAllPortals, searchPortal, SEARCH_SOURCES } from '../scrapers/index.js';
import { matchJobToResume } from '../services/matcher.js';
import { assessFraud } from '../services/fraudDetection.js';
import { parseOrThrow } from '../core/validation.js';
import { asyncHandler, type AuthedRequest } from '../core/middleware.js';
import { config } from '../core/config.js';

const router = Router();

const searchSchema = z.object({
  query: z.string().min(1).default('software engineer'),
  location: z.string().optional().default(''),
  portal: z.enum(SEARCH_SOURCES).optional(),
  demo: z.boolean().optional(),
});

const matchSchema = z.object({
  resumeId: z.string().min(1),
});

/** POST /jobs/search — search all (or one) portals. */
router.post(
  '/search',
  asyncHandler(async (req: AuthedRequest, res) => {
    const input = parseOrThrow(searchSchema, req.body);
    const demo = input.demo ?? config.SCRAPER_DEMO_MODE;
    const startedAt = Date.now();
    const jobs = input.portal
      ? await searchPortal(input.portal, input.query, input.location, demo)
      : await searchAllPortals(input.query, input.location, demo);

    // Enrich with fraud scores and persist.
    const storedJobs: ReturnType<typeof jobsRepo.findById>[] = [];
    for (const job of jobs) {
      if (!job.title || !job.company) continue;
      const fraud = assessFraud(job);
      storedJobs.push(jobsRepo.create({ ...job, fraudFlags: fraud.flags, fraudScore: fraud.score }));
    }
    res.json({
      jobs: storedJobs,
      stored: storedJobs.length,
      demoMode: demo,
      elapsedMs: Date.now() - startedAt,
    });
  }),
);

/** GET /jobs — list collected jobs (optionally filter by portal/query). */
router.get(
  '/',
  asyncHandler(async (req: AuthedRequest, res) => {
    const { portal, q } = req.query as { portal?: string; q?: string };
    res.json({ jobs: jobsRepo.list({ portal, query: q }) });
  }),
);

/** GET /jobs/:id — job detail. */
router.get(
  '/:id',
  asyncHandler(async (req: AuthedRequest, res) => {
    const job = jobsRepo.findById(String(req.params.id));
    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }
    res.json({ job });
  }),
);

/** POST /jobs/:id/match — match against a resume. */
router.post(
  '/:id/match',
  asyncHandler(async (req: AuthedRequest, res) => {
    const job = jobsRepo.findById(String(req.params.id));
    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }
    const { resumeId } = parseOrThrow(matchSchema, req.body);
    const resume = resumesRepo.findById(resumeId);
    if (!resume?.parsedData) {
      res.status(404).json({ error: 'Resume not found or not parsed' });
      return;
    }
    const result = matchJobToResume(job, resume.parsedData);
    matchesRepo.create({ jobId: job.id!, resumeId, ...result });
    res.json({ match: { jobId: job.id, resumeId, ...result } });
  }),
);

export default router;
