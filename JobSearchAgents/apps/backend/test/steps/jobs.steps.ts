import { Given, When, Then } from '@cucumber/cucumber';
import type { TestWorld } from '../support/world.ts';
import { apiCall, expectStatus, uploadResume } from '../support/world.ts';

/* ---------- Shared candidate + resume setup ---------- */

Given('a registered candidate with a parsed resume', async function (this: TestWorld) {
  await apiCall.call(this, 'post', '/api/auth/register', {
    email: `parsed-${Date.now()}@example.com`,
    password: 'password123',
    name: 'Parsed Candidate',
  });
  expectStatus(this.lastResponse, 201);
  this.token = String(this.lastResponse.body.token);
  this.userId = String(this.lastResponse.body.user.id);

  const text = [
    'Jordan Smith',
    'Full-Stack Developer',
    'jordan@example.com',
    'Phone: +1 555-0200',
    '',
    'Summary: Developer skilled in web platforms, cloud, and automation.',
    '',
    'Skills: TypeScript, React, Node.js, Playwright, Docker, PostgreSQL, Python, JavaScript, HTML, CSS, Git, CI/CD, Jest, Cucumber, Express',
    '',
    'Experience',
    'Full-Stack Developer, TechNova',
    '- Built React frontends with TypeScript and Node.js APIs',
    '- Automated E2E tests with Playwright and Cucumber',
    '- Containerized services with Docker and deployed to AWS',
    '',
    'Education',
    'M.Sc. Computer Science, Tech University',
  ].join('\n');
  this.uploadBuffer = Buffer.from(text, 'utf8');
  this.uploadMime = 'text/plain';

  await uploadResume.call(this, 'resume.txt');
  expectStatus(this.lastResponse, 201);
  this.resumeId = String(this.lastResponse.body.resume.id);
});

Given(/^a registered candidate with a resume missing "([^"]+)"$/, async function (this: TestWorld, missing: string) {
  const missingList = missing.split(',').map((s) => s.trim());
  const present = ['TypeScript', 'React', 'Node.js', 'Playwright', 'Docker', 'PostgreSQL'];
  const text = [
    'Pat Doe',
    'Software Engineer',
    'pat@example.com',
    'Phone: +1 555-0300',
    '',
    'Summary: Engineer focused on web development and testing.',
    '',
    'Skills: ' + present.join(', '),
    '',
    'Experience',
    'Engineer, SomeCorp',
    '- Developed web apps and test automation',
    '',
    'Education',
    'B.E. Computer Engineering',
  ].join('\n');
  this.uploadBuffer = Buffer.from(text, 'utf8');
  this.uploadMime = 'text/plain';

  await apiCall.call(this, 'post', '/api/auth/register', {
    email: `missing-${Date.now()}@example.com`,
    password: 'password123',
    name: 'Missing Skills',
  });
  expectStatus(this.lastResponse, 201);
  this.token = String(this.lastResponse.body.token);
  await uploadResume.call(this, 'resume.txt');
  expectStatus(this.lastResponse, 201);
  this.resumeId = String(this.lastResponse.body.resume.id);
});

/* ---------- Job fixtures ---------- */

Given(/^a (?:stored )?job posting for "([^"]+)" requiring "([^"]+)"$/, async function (this: TestWorld, title: string, required: string) {
  const description = `We are hiring a ${title}. Required skills: ${required}. You will work with modern tools in an agile team. Strong communication and problem solving are essential. Competitive salary and benefits.`;
  const { jobsRepo } = await import('../../src/db/repository.ts');
  const job = jobsRepo.create({
    portal: 'indeed',
    title,
    company: 'Fixture Corp',
    location: 'Remote',
    description,
    url: `https://www.indeed.com/jobs/view/${title.toLowerCase().replace(/\s+/g, '-')}`,
  });
  this.jobId = job.id!;
});

Given(/^a stored job posting for "([^"]+)"$/, async function (this: TestWorld, title: string) {
  const { jobsRepo } = await import('../../src/db/repository.ts');
  const job = jobsRepo.create({
    portal: 'naukri',
    title,
    company: 'Fixture Corp',
    location: 'Remote',
    description: `We are hiring a ${title}. Required skills: TypeScript, React, Node.js. You will work with modern tools in an agile team. Strong communication and problem solving are essential. Competitive salary and benefits.`,
    url: `https://www.naukri.com/jobs/view/${title.toLowerCase().replace(/\s+/g, '-')}`,
  });
  this.jobId = job.id!;
});

Given('a stored job posting that is fraudulent', async function (this: TestWorld) {
  const res = await import('supertest');
  const req = res.default(this.app)
    .post('/api/jobs/search')
    .set('Authorization', `Bearer ${this.token}`)
    .send({
      query: 'freelance',
      demo: true,
    });
  this.lastResponse = await req;
  expectStatus(this.lastResponse, 200);
  // Override with a fraudulent job directly via repository so the agent has a target.
  const { jobsRepo } = await import('../../src/db/repository.ts');
  const job = jobsRepo.create({
    portal: 'indeed',
    title: 'Make Money Fast',
    company: 'Unknown Ltd',
    location: 'Remote',
    description:
      'Click here to claim your payment. Wire money via Western Union. No experience needed, guaranteed income. Send your SSN to applynow@gmail.com.',
    url: '',
  });
  this.jobId = job.id!;
});

/* ---------- ATS optimization ---------- */

When('the candidate optimizes the resume for the job', async function (this: TestWorld) {
  const { resumeOptimizerAgent } = await import('../../src/agents/resumeOptimizerAgent.ts');
  const result = await resumeOptimizerAgent.run({
    resumeId: this.resumeId,
    jobId: this.jobId,
  });
  this.lastResponse = { status: 200, body: result } as never;
});

Then('the ATS score is at least 90', function (this: TestWorld) {
  const score = this.lastResponse.body.data?.report?.score ?? this.lastResponse.body.data?.score;
  if (typeof score !== 'number' || score < 90) {
    throw new Error(`ATS score ${score} < 90`);
  }
});

Then('the ATS report lists the missing keywords', function (this: TestWorld) {
  const report = this.lastResponse.body.data?.report;
  if (!Array.isArray(report?.missingKeywords)) {
    throw new Error('Missing keywords array in ATS report');
  }
});

Then('the ATS report contains suggestions to add missing keywords', function (this: TestWorld) {
  const report = this.lastResponse.body.data?.report;
  const joined = (report?.suggestions ?? []).join(' ');
  if (!/missing keyword/i.test(joined)) {
    throw new Error(`Expected "missing keyword" suggestion, got: ${joined}`);
  }
});

/* ---------- Job search & matching ---------- */

When(/^the candidate searches for "([^"]+)" jobs$/, async function (this: TestWorld, query: string) {
  const startedAt = Date.now();
  await apiCall.call(this, 'post', '/api/jobs/search', { query, demo: true });
  (this as unknown as { searchElapsedMs: number }).searchElapsedMs = Date.now() - startedAt;
});

When(/^the candidate searches for "([^"]+)" jobs on the "([^"]+)" portal$/, async function (this: TestWorld, query: string, portal: string) {
  await apiCall.call(this, 'post', '/api/jobs/search', { query, portal, demo: true });
});

Then(/^the response contains jobs from the "([^"]+)" portal$/, function (this: TestWorld, portal: string) {
  const jobs = this.lastResponse.body.jobs ?? [];
  if (!jobs.some((j: { portal: string }) => j.portal === portal)) {
    throw new Error(`No jobs from portal "${portal}" in response`);
  }
});

Then(/^every job in the response is from the "([^"]+)" portal$/, function (this: TestWorld, portal: string) {
  const jobs = this.lastResponse.body.jobs ?? [];
  if (jobs.length && jobs.some((j: { portal: string }) => j.portal !== portal)) {
    throw new Error(`Found jobs from other portals`);
  }
});

Then('the search completed in under 30 seconds', function (this: TestWorld) {
  const ms = (this as unknown as { searchElapsedMs: number }).searchElapsedMs ?? 0;
  if (ms >= 30_000) throw new Error(`Search took ${ms}ms — expected < 30s`);
});

Given('a registered candidate with stored jobs', async function (this: TestWorld) {
  await apiCall.call(this, 'post', '/api/auth/register', {
    email: `storedjobs-${Date.now()}@example.com`,
    password: 'password123',
    name: 'Job Hunter',
  });
  expectStatus(this.lastResponse, 201);
  this.token = String(this.lastResponse.body.token);
  await apiCall.call(this, 'post', '/api/jobs/search', { query: 'software engineer', demo: true });
  expectStatus(this.lastResponse, 200);
});

When('the candidate lists jobs', async function (this: TestWorld) {
  await apiCall.call(this, 'get', '/api/jobs');
});

Then(/^the response contains at least (\d+) job(?:s)?$/, function (this: TestWorld, n: number) {
  const jobs = this.lastResponse.body.jobs ?? [];
  if (jobs.length < n) throw new Error(`Expected ≥ ${n} jobs, got ${jobs.length}`);
});

When('the candidate matches the job against the resume', async function (this: TestWorld) {
  await apiCall.call(this, 'post', `/api/jobs/${this.jobId}/match`, { resumeId: this.resumeId });
});

Then('the match score is at least 0.5', function (this: TestWorld) {
  const score = this.lastResponse.body.match?.score;
  if (typeof score !== 'number' || score < 0.5) {
    throw new Error(`Match score ${score} < 0.5`);
  }
});
