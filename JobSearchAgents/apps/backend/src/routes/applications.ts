import { Router } from 'express';
import { z } from 'zod';
import { applicationsRepo, jobsRepo, resumesRepo } from '../db/repository.js';
import { optimizeResumeForJob } from '../services/atsOptimizer.js';
import { generateCoverLetter } from '../services/contentGeneration.js';
import { config } from '../core/config.js';
import { parseOrThrow } from '../core/validation.js';
import { asyncHandler, type AuthedRequest } from '../core/middleware.js';
import { applicationAgent } from '../agents/applicationAgent.js';

const router = Router();

const applySchema = z.object({
  resumeId: z.string().min(1),
});

const statusSchema = z.object({
  status: z.enum(['submitted', 'viewed', 'shortlisted', 'interview', 'offer', 'rejected', 'withdrawn']),
});

/** POST /jobs/:jobId/apply — auto-apply (safety-gated). */
router.post(
  '/jobs/:jobId/apply',
  asyncHandler(async (req: AuthedRequest, res) => {
    const job = jobsRepo.findById(String(req.params.jobId));
    if (!job) {
      res.status(404).json({ error: 'Job not found' });
      return;
    }
    const { resumeId } = parseOrThrow(applySchema, req.body);
    const resume = resumesRepo.findById(resumeId);
    if (!resume?.parsedData) {
      res.status(404).json({ error: 'Resume not found or not parsed' });
      return;
    }

    const result = await applicationAgent.run({
      userId: req.user!.id,
      jobId: job.id!,
      resumeId,
      attempts: 1,
    });
    if (result.status === 'error') {
      res.status(502).json({ error: result.error ?? 'Application failed', summary: result.summary });
      return;
    }
    res.status(201).json(result);
  }),
);

/** GET /applications — candidate application history. */
router.get(
  '/applications',
  asyncHandler(async (req: AuthedRequest, res) => {
    res.json({ applications: applicationsRepo.listByUser(req.user!.id) });
  }),
);

/** PATCH /applications/:id/status — update application status (Job Tracker / Feedback). */
router.patch(
  '/applications/:id/status',
  asyncHandler(async (req: AuthedRequest, res) => {
    const app = applicationsRepo.findById(String(req.params.id));
    if (!app || app.userId !== req.user!.id) {
      res.status(404).json({ error: 'Application not found' });
      return;
    }
    const { status } = parseOrThrow(statusSchema, req.body);
    res.json({ application: applicationsRepo.updateStatus(app.id, status) });
  }),
);

export default router;
