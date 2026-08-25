import { Router } from 'express';
import { z } from 'zod';
import { reportsRepo } from '../db/repository.js';
import { buildDailyReport, deliverReport } from '../services/reporting.js';
import { parseOrThrow } from '../core/validation.js';
import { asyncHandler, type AuthedRequest } from '../core/middleware.js';

const router = Router();

const reportSchema = z.object({
  period: z.string().optional(),
  channel: z.enum(['email', 'sms']).optional().default('email'),
});

/** POST /reports/daily — generate + deliver the daily report. */
router.post(
  '/daily',
  asyncHandler(async (req: AuthedRequest, res) => {
    const input = parseOrThrow(reportSchema, req.body);
    const period = input.period ?? new Date().toISOString().slice(0, 10);
    const summary = buildDailyReport(req.user!.id, period);
    const delivery = await deliverReport(summary, input.channel);
    const record = reportsRepo.create({
      userId: req.user!.id,
      period,
      summary: JSON.stringify(summary),
      channel: input.channel,
    });
    res.status(201).json({ report: record, summary, delivery });
  }),
);

/** GET /reports — report history. */
router.get(
  '/',
  asyncHandler(async (req: AuthedRequest, res) => {
    res.json({ reports: reportsRepo.listByUser(req.user!.id) });
  }),
);

export default router;
