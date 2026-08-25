import type { NextFunction, Request, Response } from 'express';
import { jwt } from './security.js';

export interface AuthedRequest extends Request {
  user?: { id: string; email: string; name: string };
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction): void {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Missing bearer token' });
    return;
  }
  const payload = jwt.verify(header.slice(7));
  if (!payload || !payload.sub || typeof payload.sub !== 'string') {
    res.status(401).json({ error: 'Invalid or expired token' });
    return;
  }
  req.user = {
    id: payload.sub,
    email: String(payload.email ?? ''),
    name: String(payload.name ?? ''),
  };
  next();
}

/** Async route wrapper so thrown errors reach the error handler. */
export function asyncHandler(
  fn: (req: AuthedRequest, res: Response, next: NextFunction) => Promise<unknown>,
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req as AuthedRequest, res, next)).catch(next);
  };
}
