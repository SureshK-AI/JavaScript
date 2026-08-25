import crypto from 'node:crypto';
import { config } from './config.js';

/**
 * Password hashing (Argon2id via argon2 package) with a synchronous
 * fallback to scrypt when the native module is unavailable.
 */
export class PasswordHasher {
  private useArgon: boolean;
  private argon2: typeof import('argon2') | null = null;

  constructor() {
    this.useArgon = false;
    try {
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      this.argon2 = require('argon2') as typeof import('argon2');
      this.useArgon = true;
    } catch {
      this.useArgon = false;
    }
  }

  async hash(password: string): Promise<string> {
    if (this.useArgon && this.argon2) {
      return this.argon2.hash(password);
    }
    return new Promise((resolve, reject) => {
      const salt = crypto.randomBytes(16);
      crypto.scrypt(password, salt, 64, { N: 16384 }, (err, derivedKey) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(`scrypt$${salt.toString('hex')}$${derivedKey.toString('hex')}`);
      });
    });
  }

  async verify(password: string, encoded: string): Promise<boolean> {
    if (encoded.startsWith('scrypt$')) {
      const [, saltHex, hashHex] = encoded.split('$');
      if (!saltHex || !hashHex) return false;
      const salt = Buffer.from(saltHex, 'hex');
      const expected = Buffer.from(hashHex, 'hex');
      const derived = (await this.scryptAsync(password, salt)) as Buffer;
      return crypto.timingSafeEqual(derived, expected);
    }
    if (this.argon2) {
      try {
        return await this.argon2.verify(encoded, password);
      } catch {
        return false;
      }
    }
    return false;
  }

  private scryptAsync(password: string, salt: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      crypto.scrypt(password, salt, 64, { N: 16384 }, (err, key) =>
        err ? reject(err) : resolve(key),
      );
    });
  }
}

export const passwordHasher = new PasswordHasher();

/** AES-256-GCM encryption for the credential vault. */
export const vault = {
  encrypt(plaintext: string): string {
    const iv = crypto.randomBytes(12);
    const cipher = crypto.createCipheriv('aes-256-gcm', config.vaultKeyBytes, iv);
    const encrypted = Buffer.concat([cipher.update(plaintext, 'utf8'), cipher.final()]);
    const tag = cipher.getAuthTag();
    return `v1:${iv.toString('base64')}:${tag.toString('base64')}:${encrypted.toString('base64')}`;
  },
  decrypt(payload: string): string {
    const [, ivB64, tagB64, dataB64] = payload.split(':');
    if (!ivB64 || !tagB64 || !dataB64) throw new Error('Invalid vault payload');
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      config.vaultKeyBytes,
      Buffer.from(ivB64, 'base64'),
    );
    decipher.setAuthTag(Buffer.from(tagB64, 'base64'));
    const decrypted = Buffer.concat([
      decipher.update(Buffer.from(dataB64, 'base64')),
      decipher.final(),
    ]);
    return decrypted.toString('utf8');
  },
  /** Masks a secret for logs. */
  mask(value: string): string {
    if (value.length <= 4) return '****';
    return `${value.slice(0, 2)}****${value.slice(-2)}`;
  },
};

/** JWT helpers. */
export const jwt = {
  sign(payload: Record<string, unknown>): string {
    // Local minimal HS256 signer (jsonwebtoken is optional; keeps deps light).
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const body = Buffer.from(
      JSON.stringify({ ...payload, iat: Math.floor(Date.now() / 1000) }),
    ).toString('base64url');
    const sig = crypto
      .createHmac('sha256', config.JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');
    return `${header}.${body}.${sig}`;
  },
  verify(token: string): Record<string, unknown> | null {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, body, sig] = parts as [string, string, string];
    const expected = crypto
      .createHmac('sha256', config.JWT_SECRET)
      .update(`${header}.${body}`)
      .digest('base64url');
    let actual: Buffer;
    try {
      actual = Buffer.from(sig, 'base64url');
    } catch {
      return null;
    }
    const expectedBuf = Buffer.from(expected, 'base64url');
    if (actual.length !== expectedBuf.length || !crypto.timingSafeEqual(actual, expectedBuf)) {
      return null;
    }
    try {
      const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as Record<
        string,
        unknown
      >;
      if (payload.exp && Date.now() >= Number(payload.exp) * 1000) return null;
      return payload;
    } catch {
      return null;
    }
  },
  expiresInSeconds(): number {
    const match = /^(\d+)([smhd])$/.exec(config.JWT_EXPIRES_IN);
    if (!match) return 12 * 3600;
    const n = match[1] ?? '12';
    const unit = (match[2] ?? 'h') as 's' | 'm' | 'h' | 'd';
    const mult = { s: 1, m: 60, h: 3600, d: 86400 }[unit];
    return Number(n) * mult;
  },
};

/** Minimal normalized similarity helpers shared by agents. */
export function tokenize(text: string): Set<string> {
  return new Set(
    text
      .toLowerCase()
      .replace(/[^a-z0-9+#.\s]/g, ' ')
      .split(/\s+/)
      .filter((w) => w.length > 1),
  );
}

export function jaccard(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection += 1;
  }
  return intersection / (a.size + b.size - intersection);
}

export function cosineSimilarity(a: Set<string>, b: Set<string>): number {
  if (a.size === 0 || b.size === 0) return 0;
  let intersection = 0;
  for (const item of a) {
    if (b.has(item)) intersection += 1;
  }
  return intersection / Math.sqrt(a.size * b.size);
}
