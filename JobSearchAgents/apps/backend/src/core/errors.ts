import type { ErrorRequestHandler } from 'express';
import { logger } from '../core/logger.js';

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const status = (err as Error & { status?: number }).status ?? 500;
  if (status >= 500) {
    logger.error({ err, path: req.path }, 'Unhandled error');
  }
  res.status(status).json({
    error: status >= 500 ? 'Internal server error' : err.message,
  });
};

export const notFoundHandler = (req: import('express').Request, res: import('express').Response): void => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
};
