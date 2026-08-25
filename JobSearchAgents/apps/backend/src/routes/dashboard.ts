import { Router } from 'express';
import { statsRepo } from '../db/repository.js';
import { asyncHandler, type AuthedRequest } from '../core/middleware.js';

const router = Router();

/** GET /dashboard/stats — dashboard statistics. */
router.get(
  '/stats',
  asyncHandler(async (req: AuthedRequest, res) => {
    res.json({ stats: statsRepo.dashboard(req.user!.id) });
  }),
);

export default router;
