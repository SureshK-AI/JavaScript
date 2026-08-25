import { Router } from 'express';
import { z } from 'zod';
import { passwordHasher, jwt, vault } from '../core/security.js';
import { usersRepo, vaultRepo } from '../db/repository.js';
import { parseOrThrow } from '../core/validation.js';
import { asyncHandler, type AuthedRequest } from '../core/middleware.js';
import { config } from '../core/config.js';

const router = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const vaultSchema = z.object({
  portal: z.string().min(1),
  username: z.string().min(1),
  password: z.string().min(1),
});

/** POST /auth/register — candidate onboarding. */
router.post(
  '/register',
  asyncHandler(async (req, res) => {
    const input = parseOrThrow(registerSchema, req.body);
    if (usersRepo.findByEmail(input.email)) {
      res.status(409).json({ error: 'Email already registered' });
      return;
    }
    const passwordHash = await passwordHasher.hash(input.password);
    const user = usersRepo.create({ email: input.email, passwordHash, name: input.name });
    res.status(201).json({
      user,
      token: jwt.sign({ sub: user.id, email: user.email, name: user.name }),
      expiresIn: jwt.expiresInSeconds(),
    });
  }),
);

/** POST /auth/login — JWT login. */
router.post(
  '/login',
  asyncHandler(async (req, res) => {
    const input = parseOrThrow(loginSchema, req.body);
    const user = usersRepo.findByEmail(input.email);
    if (!user || !(await passwordHasher.verify(input.password, user.passwordHash))) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    res.json({
      user: { id: user.id, email: user.email, name: user.name, provider: user.provider },
      token: jwt.sign({ sub: user.id, email: user.email, name: user.name }),
      expiresIn: jwt.expiresInSeconds(),
    });
  }),
);

/** GET /auth/oauth/:provider — OAuth2-style demo provider (no external account needed). */
router.get(
  '/oauth/:provider',
  asyncHandler(async (req, res) => {
    if (!config.OAUTH_ENABLED) {
      res.status(403).json({ error: 'OAuth disabled' });
      return;
    }
    const provider = String(req.params.provider);
    const email = `demo.${provider}@jobsearch.local`;
    let existing: { id: string; email: string; name: string; provider: string } | undefined =
      usersRepo.findByEmail(email);
    if (!existing) {
      const passwordHash = await passwordHasher.hash('oauth-demo-password');
      existing = usersRepo.create({ email, passwordHash, name: `Demo ${provider} User`, provider });
    }
    const user = { id: existing.id, email: existing.email, name: existing.name, provider: existing.provider };
    res.json({
      user,
      token: jwt.sign({ sub: user.id, email: user.email, name: user.name }),
      provider,
    });
  }),
);

/** GET /auth/me — current candidate profile. */
router.get(
  '/me',
  asyncHandler(async (req: AuthedRequest, res) => {
    const user = usersRepo.findById(req.user!.id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }
    res.json({ user });
  }),
);

/** POST /auth/vault — save encrypted portal credentials. */
router.post(
  '/vault',
  asyncHandler(async (req: AuthedRequest, res) => {
    const input = parseOrThrow(vaultSchema, req.body);
    vaultRepo.save(req.user!.id, {
      portal: input.portal as never,
      username: input.username,
      password: vault.encrypt(input.password),
    });
    res.status(201).json({ ok: true, portal: input.portal });
  }),
);

export default router;
