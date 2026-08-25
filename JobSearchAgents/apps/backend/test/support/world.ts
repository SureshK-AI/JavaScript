import { Before } from '@cucumber/cucumber';
import request from 'supertest';
import type { Response } from 'supertest';
import type { Express } from 'express';

/**
 * Shared per-scenario state — attach to the cucumber World so every step can
 * read/write the API client, latest response, and test fixtures.
 */
export interface TestWorld {
  app: Express;
  token: string;
  userId: string;
  lastResponse: Response;
  resumeId: string;
  jobId: string;
  applicationId: string;
  fixtures: Map<string, string>;
  uploadBuffer: Buffer | null;
  uploadMime: string;
  uploadFilename: string;
}

Before(function (this: TestWorld) {
  const g = globalThis as Record<string, unknown>;
  Object.assign(this, {
    app: g.__app as Express,
    token: '',
    userId: '',
    lastResponse: undefined,
    resumeId: '',
    jobId: '',
    applicationId: '',
    fixtures: new Map<string, string>(),
    uploadBuffer: null,
    uploadMime: '',
    uploadFilename: '',
  });
});

export async function apiCall(
  this: TestWorld,
  method: 'get' | 'post' | 'patch' | 'put' | 'delete',
  path: string,
  body?: unknown,
  token?: string,
): Promise<Response> {
  const req = request(this.app)[method](path);
  if (token ?? this.token) {
    req.set('Authorization', `Bearer ${token ?? this.token}`);
  }
  if (body !== undefined) {
    req.send(body as Record<string, unknown>);
  }
  this.lastResponse = await req;
  return this.lastResponse;
}

/** Uploads the current fixture buffer as the resume file. */
export async function uploadResume(this: TestWorld, filename = 'resume.txt'): Promise<Response> {
  if (!this.uploadBuffer) throw new Error('No fixture buffer set — set uploadBuffer first');
  const req = request(this.app)
    .post('/api/resumes')
    .set('Authorization', `Bearer ${this.token}`)
    .attach('file', this.uploadBuffer, { filename, contentType: this.uploadMime });
  this.lastResponse = await req;
  return this.lastResponse;
}

export function expectStatus(res: Response, status: number): void {
  if (res.status !== status) {
    throw new Error(`Expected status ${status}, got ${res.status}: ${JSON.stringify(res.body).slice(0, 500)}`);
  }
}

export function expectToken(res: Response): void {
  if (!res.body?.token || typeof res.body.token !== 'string') {
    throw new Error(`Expected a JWT token in response body: ${JSON.stringify(res.body)}`);
  }
}
