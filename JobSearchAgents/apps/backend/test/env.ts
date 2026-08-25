/**
 * Test environment bootstrap.
 *
 * MUST have zero imports — ESM evaluates a module's imports BEFORE its body,
 * so this file runs first and sets env vars before any src module is evaluated.
 */
process.env.NODE_ENV = 'test';
process.env.DB_FILE = ':memory:';
process.env.DATABASE_URL = 'sqlite://:memory:';
process.env.SCRAPER_DEMO_MODE = 'true';
process.env.JWT_SECRET = 'test-jwt-secret';
process.env.VAULT_KEY = 'test-vault-key-0123456789abcdef';
process.env.LOG_LEVEL = 'silent';
