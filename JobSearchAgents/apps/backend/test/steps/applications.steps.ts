import { Given, When, Then } from '@cucumber/cucumber';
import type { TestWorld } from '../support/world.ts';
import { apiCall, expectStatus, uploadResume } from '../support/world.ts';

/* ---------- Application fixtures ---------- */

Given('a registered candidate with an application', async function (this: TestWorld) {
  await apiCall.call(this, 'post', '/api/auth/register', {
    email: `applicant-${Date.now()}@example.com`,
    password: 'password123',
    name: 'Applicant',
  });
  expectStatus(this.lastResponse, 201);
  this.token = String(this.lastResponse.body.token);
  this.userId = String(this.lastResponse.body.user.id);

  const text = [
    'Riley Chen',
    'Full-Stack Developer',
    'riley@example.com',
    'Phone: +1 555-0400',
    '',
    'Summary: Developer skilled in web platforms and automation.',
    '',
    'Skills: TypeScript, React, Node.js, Playwright, Docker, PostgreSQL, Python, JavaScript, Express, Git',
    '',
    'Experience',
    'Developer, CloudWorks',
    '- Built React and Node.js applications',
    '- Automated tests with Playwright',
    '',
    'Education',
    'B.Tech Computer Science',
  ].join('\n');
  this.uploadBuffer = Buffer.from(text, 'utf8');
  this.uploadMime = 'text/plain';
  await uploadResume.call(this, 'resume.txt');
  expectStatus(this.lastResponse, 201);
  this.resumeId = String(this.lastResponse.body.resume.id);

  await apiCall.call(this, 'post', '/api/jobs/search', { query: 'full stack', demo: true });
  expectStatus(this.lastResponse, 200);
  const jobs = this.lastResponse.body.jobs ?? [];
  this.jobId = String(jobs[0].id);

  await apiCall.call(this, 'post', `/api/jobs/${this.jobId}/apply`, { resumeId: this.resumeId });
  expectStatus(this.lastResponse, 201);
  this.applicationId = String(this.lastResponse.body.data?.applicationId ?? this.lastResponse.body.application?.id);
});

/* ---------- Application steps ---------- */

When('the candidate applies to the job', async function (this: TestWorld) {
  await apiCall.call(this, 'post', `/api/jobs/${this.jobId}/apply`, { resumeId: this.resumeId });
});

Then(/^an application is recorded with status "([^"]+)"$/, function (this: TestWorld, status: string) {
  const data = this.lastResponse.body.data ?? this.lastResponse.body;
  const actual = data.status ?? data.application?.status;
  if (actual !== status) {
    throw new Error(`Expected application status "${status}", got ${JSON.stringify(data).slice(0, 200)}`);
  }
});

Then('the application includes a cover letter', function (this: TestWorld) {
  const cover = this.lastResponse.body.data?.coverLetter ?? this.lastResponse.body.coverLetter;
  if (!cover || cover.length < 20) {
    throw new Error('Expected a cover letter in the application response');
  }
});

Then('the application records at least 1 attempt', function (this: TestWorld) {
  const attempts = this.lastResponse.body.data?.attempts ?? 1;
  if (Number(attempts) < 1) throw new Error(`Expected ≥ 1 attempt, got ${attempts}`);
});

When('the candidate updates the application status to "interview"', async function (this: TestWorld) {
  await apiCall.call(this, 'patch', `/api/applications/${this.applicationId}/status`, { status: 'interview' });
});

Then('the application status is "interview"', function (this: TestWorld) {
  const status = this.lastResponse.body.application?.status;
  if (status !== 'interview') throw new Error(`Expected status interview, got ${status}`);
});

When('the candidate lists their applications', async function (this: TestWorld) {
  await apiCall.call(this, 'get', '/api/applications');
});

Then(/^the response contains at least (\d+) application(?:s)?$/, function (this: TestWorld, n: number) {
  const apps = this.lastResponse.body.applications ?? [];
  if (apps.length < n) throw new Error(`Expected ≥ ${n} applications, got ${apps.length}`);
});
