import { Given, When, Then } from '@cucumber/cucumber';
import type { TestWorld } from '../support/world.ts';
import { apiCall, expectStatus } from '../support/world.ts';

/* ---------- Reporting ---------- */

When('the candidate generates a daily report', async function (this: TestWorld) {
  await apiCall.call(this, 'post', '/api/reports/daily', {});
});

When(/^the candidate requests a report via "([^"]+)"$/, async function (this: TestWorld, channel: string) {
  await apiCall.call(this, 'post', '/api/reports/daily', { channel });
});

Then(/^the report summarizes at least (\d+) application(?:s)?$/, function (this: TestWorld, n: number) {
  const total = this.lastResponse.body.summary?.totalApplications ?? 0;
  if (Number(total) < n) throw new Error(`Expected report to cover ≥ ${n} applications, got ${total}`);
});

Then(/^the report is marked as delivered via "([^"]+)"$/, function (this: TestWorld, channel: string) {
  const delivered = this.lastResponse.body.delivery?.channel ?? this.lastResponse.body.report?.channel;
  if (delivered !== channel) throw new Error(`Expected delivery channel ${channel}, got ${delivered}`);
});

/* ---------- Agents ---------- */

When(/^the candidate runs the "([^"]+)" agent$/, async function (this: TestWorld, agent: string) {
  const body: Record<string, unknown> = {};
  if (this.resumeId) body.resumeId = this.resumeId;
  if (this.jobId) body.jobId = this.jobId;
  await apiCall.call(this, 'post', `/api/agents/${agent}/run`, body);
});

When(/^the candidate runs the "([^"]+)" agent on the job$/, async function (this: TestWorld, agent: string) {
  await apiCall.call(this, 'post', `/api/agents/${agent}/run`, { jobId: this.jobId });
});

Then(/^the agent response contains at least (\d+) interview questions$/, function (this: TestWorld, n: number) {
  const questions = this.lastResponse.body.data?.questions ?? [];
  if (questions.length < n) throw new Error(`Expected ≥ ${n} questions, got ${questions.length}`);
});

Then('the agent response contains missing skills', function (this: TestWorld) {
  const missing = this.lastResponse.body.data?.missingSkills ?? [];
  if (!missing.length) throw new Error('Expected missing skills in skill-gap response');
});

Then(/^the fraud verdict is "([^"]+)"$/, function (this: TestWorld, verdict: string) {
  const actual = this.lastResponse.body.data?.verdict;
  if (actual !== verdict) throw new Error(`Expected fraud verdict "${verdict}", got ${actual}`);
});

Then('the agent response contains salary benchmark', function (this: TestWorld) {
  const benchmark = this.lastResponse.body.data?.benchmark;
  if (!benchmark || !/benchmark/i.test(String(benchmark))) {
    throw new Error('Expected salary benchmark in career-coach response');
  }
});

Then(/^the agent response contains a cover letter mentioning the job title$/, function (this: TestWorld) {
  const letter = String(this.lastResponse.body.data?.letter ?? '');
  if (!letter || letter.length < 50) throw new Error('Expected a cover letter');
  const title = this.lastResponse.body.data?.jobTitle ?? '';
  if (title && !letter.includes(title.split(' ')[0] ?? '')) {
    throw new Error('Cover letter does not mention the job title');
  }
});

When('the candidate runs the full agent pipeline', async function (this: TestWorld) {
  await apiCall.call(this, 'post', '/api/agents/pipeline', {
    resumeId: this.resumeId,
    jobId: this.jobId,
  });
});

Then(/^the pipeline reports at least (\d+) successful agents$/, function (this: TestWorld, n: number) {
  const successCount = this.lastResponse.body.successCount ?? 0;
  if (successCount < n) throw new Error(`Expected ≥ ${n} successful agents, got ${successCount}`);
});

Then(/^the agent run history contains the "([^"]+)" agent$/, async function (this: TestWorld, agent: string) {
  await apiCall.call(this, 'get', '/api/agents/runs');
  const runs = this.lastResponse.body.runs ?? [];
  if (!runs.some((r: { agent: string }) => r.agent === agent)) {
    throw new Error(`Agent run history does not contain "${agent}"`);
  }
});
