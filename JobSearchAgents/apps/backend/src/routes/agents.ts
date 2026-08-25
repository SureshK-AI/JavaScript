import { Router } from 'express';
import { z } from 'zod';
import { orchestrator } from '../agents/orchestrator.js';
import { listAgents } from '../agents/registry.js';
import { agentRunsRepo } from '../db/repository.js';
import { parseOrThrow } from '../core/validation.js';
import { asyncHandler, type AuthedRequest } from '../core/middleware.js';

const router = Router();

const runSchema = z.object({
  resumeId: z.string().optional(),
  jobId: z.string().optional(),
  query: z.string().optional(),
  location: z.string().optional(),
  email: z.string().optional(),
  period: z.string().optional(),
  channel: z.enum(['email', 'sms']).optional(),
  status: z.string().optional(),
  applicationId: z.string().optional(),
  attempts: z.number().optional(),
});

/** GET /agents — list all agents. */
router.get(
  '/',
  asyncHandler(async (_req, res) => {
    res.json({ agents: listAgents() });
  }),
);

/** POST /agents/:name/run — run a single agent. */
router.post(
  '/:name/run',
  asyncHandler(async (req: AuthedRequest, res) => {
    const name = String(req.params.name);
    const input = parseOrThrow(runSchema, req.body ?? {});
    const result = await orchestrator.runAgent(name, { userId: req.user!.id, ...input });
    res.status(result.status === 'error' ? 502 : 200).json(result);
  }),
);

/** POST /agents/pipeline — full orchestrated pipeline. */
router.post(
  '/pipeline',
  asyncHandler(async (req: AuthedRequest, res) => {
    const input = parseOrThrow(runSchema, req.body ?? {});
    const result = await orchestrator.runPipeline({ userId: req.user!.id, ...input });
    res.json(result);
  }),
);

/** GET /agents/runs — recent agent run history. */
router.get(
  '/runs',
  asyncHandler(async (_req, res) => {
    res.json({ runs: agentRunsRepo.list() });
  }),
);

export default router;
