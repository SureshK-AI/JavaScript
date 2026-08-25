import { ZodError, z } from 'zod';

/** Wraps zod parsing so handlers stay terse. */
export function parseOrThrow<T extends z.ZodTypeAny>(schema: T, data: unknown): z.infer<T> {
  try {
    return schema.parse(data);
  } catch (err) {
    if (err instanceof ZodError) {
      const message = err.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; ');
      const e = new Error(`Validation failed — ${message}`);
      (e as Error & { status?: number }).status = 400;
      throw e;
    }
    throw err;
  }
}
