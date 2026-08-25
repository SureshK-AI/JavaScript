import 'dotenv/config';
import { z } from 'zod';
import crypto from 'node:crypto';

/**
 * Centralized, validated configuration.
 * All values may be overridden via environment variables (.env).
 */
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().default(3001),
  API_BASE_URL: z.string().default('http://localhost:3001/api'),
  FRONTEND_URL: z.string().default('http://localhost:5173'),

  JWT_SECRET: z.string().default('dev-only-jwt-secret-change-me'),
  JWT_EXPIRES_IN: z.string().default('12h'),
  VAULT_KEY: z.string().default('dev-only-vault-key-change-me'),
  OAUTH_ENABLED: z.coerce.boolean().default(true),

  DATABASE_URL: z.string().default('sqlite://./data/jobsearch.db'),
  DB_FILE: z.string().default('./data/jobsearch.db'),

  HEADLESS: z.coerce.boolean().default(true),
  SCRAPER_TIMEOUT_MS: z.coerce.number().default(30_000),
  SCRAPER_RETRIES: z.coerce.number().default(2),
  SCRAPER_DEMO_MODE: z.coerce.boolean().default(true),
  AUTOMATION_ENABLED: z.coerce.boolean().default(false),
  WEB_SEARCH_ENGINE: z.string().default('duckduckgo'),
  WEB_SEARCH_MAX_RESULTS: z.coerce.number().default(8),
  WEB_SEARCH_FOLLOW_DETAIL: z.coerce.boolean().default(true),

  OPENAI_API_KEY: z.string().optional().default(''),
  SENDGRID_API_KEY: z.string().optional().default(''),
  FROM_EMAIL: z.string().default('reports@jobsearch.local'),
  TWILIO_ACCOUNT_SID: z.string().optional().default(''),
  TWILIO_AUTH_TOKEN: z.string().optional().default(''),
  TWILIO_FROM: z.string().optional().default(''),
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  // eslint-disable-next-line no-console
  console.error('Invalid environment configuration', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = {
  ...parsed.data,
  /** True when the app runs under the Cucumber BDD suite. */
  isTest: parsed.data.NODE_ENV === 'test',
  vaultKeyBytes: Buffer.from(parsed.data.VAULT_KEY.padEnd(32, '0').slice(0, 32), 'utf8'),
} as const;

export type AppConfig = typeof config;

export function isProduction(): boolean {
  return config.NODE_ENV === 'production';
}
