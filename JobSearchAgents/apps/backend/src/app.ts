import express from 'express';
import cors from 'cors';
import { pinoHttp } from 'pino-http';
import { config } from './core/config.js';
import { logger } from './core/logger.js';
import { runMigrations } from './db/database.js';
import { requireAuth } from './core/middleware.js';
import { errorHandler, notFoundHandler } from './core/errors.js';
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resumes.js';
import jobRoutes from './routes/jobs.js';
import applicationRoutes from './routes/applications.js';
import reportRoutes from './routes/reports.js';
import agentRoutes from './routes/agents.js';
import dashboardRoutes from './routes/dashboard.js';

/** Express app factory — used by the server and the BDD test harness. */
export function createApp() {
  runMigrations();

  const app = express();
  app.use(cors({ origin: config.FRONTEND_URL, credentials: true }));
  app.use(express.json({ limit: '2mb' }));
  app.use(
    pinoHttp({
      logger,
      autoLogging: config.isTest ? false : true,
    }),
  );

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'jobsearch-agents', time: new Date().toISOString() });
  });

  app.use('/api/auth', authRoutes);
  app.use('/api/resumes', requireAuth, resumeRoutes);
  app.use('/api/jobs', requireAuth, jobRoutes);
  app.use('/api', requireAuth, applicationRoutes);
  app.use('/api/reports', requireAuth, reportRoutes);
  app.use('/api/agents', requireAuth, agentRoutes);
  app.use('/api/dashboard', requireAuth, dashboardRoutes);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
