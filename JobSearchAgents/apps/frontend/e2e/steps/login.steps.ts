import { Given, When, Then } from '@cucumber/cucumber';
import type { E2EWorld } from '../support/world.ts';
import { expect } from '@playwright/test';

/* ---------- Navigation & auth ---------- */

Given('I am on the login page', async function (this: E2EWorld) {
  await this.page.goto('/login');
  await this.page.getByRole('heading', { name: /JobSearch Agents/ }).waitFor();
});

Given(/^a candidate with email "([^"]+)" and password "([^"]+)" exists$/, async function (this: E2EWorld, email: string, password: string) {
  const res = await fetch(`${this.apiBase}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name: 'E2E Candidate' }),
  });
  if (!res.ok && res.status !== 409) {
    throw new Error(`Failed to seed candidate: ${res.status} ${await res.text()}`);
  }
});

Given('I am logged in', async function (this: E2EWorld) {
  const email = `e2e-${Date.now()}@example.com`;
  await fetch(`${this.apiBase}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'password123', name: 'E2E User' }),
  });
  await this.page.goto('/login');
  await this.page.getByLabel('Email').fill(email);
  await this.page.getByLabel('Password').fill('password123');
  await this.page.getByTestId('submit-auth').click();
  await this.page.getByRole('heading', { name: 'Dashboard' }).waitFor();
});

Given('I am logged in with an uploaded resume', async function (this: E2EWorld) {
  const email = `e2e-resume-${Date.now()}@example.com`;
  const register = await fetch(`${this.apiBase}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'password123', name: 'E2E Resume User' }),
  });
  const { token } = (await register.json()) as { token: string };

  const text = [
    'Alex E2E',
    'Full-Stack Developer',
    'alex.e2e@example.com',
    '',
    'Summary: Developer skilled in web platforms and automation.',
    '',
    'Skills: TypeScript, React, Node.js, Playwright, Docker, PostgreSQL, Python',
    '',
    'Experience',
    'Developer, E2E Corp',
    '- Built web apps with React and Node.js',
    '',
    'Education',
    'B.Tech Computer Science',
  ].join('\n');

  const form = new FormData();
  form.append('file', new Blob([text], { type: 'text/plain' }), 'e2e-resume.txt');
  await fetch(`${this.apiBase}/resumes`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });

  await this.page.goto('/login');
  await this.page.getByLabel('Email').fill(email);
  await this.page.getByLabel('Password').fill('password123');
  await this.page.getByTestId('submit-auth').click();
  await this.page.getByRole('heading', { name: 'Dashboard' }).waitFor();
});

Given('I am logged in with an application', async function (this: E2EWorld) {
  const email = `e2e-app-${Date.now()}@example.com`;
  const register = await fetch(`${this.apiBase}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password: 'password123', name: 'E2E App User' }),
  });
  const { token } = (await register.json()) as { token: string };

  const text = 'Alex App\nFull-Stack Developer\nalex.app@example.com\n\nSkills: TypeScript, React, Node.js\n\nExperience\nDeveloper, E2E Corp\n- Built web apps\n\nEducation\nB.Tech CS';
  const form = new FormData();
  form.append('file', new Blob([text], { type: 'text/plain' }), 'app-resume.txt');
  const upload = await fetch(`${this.apiBase}/resumes`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}` },
    body: form,
  });
  const { resume } = (await upload.json()) as { resume: { id: string } };

  const search = await fetch(`${this.apiBase}/jobs/search`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: 'full stack', demo: true }),
  });
  const { jobs } = (await search.json()) as { jobs: Array<{ id: string }> };

  await fetch(`${this.apiBase}/jobs/${jobs[0].id}/apply`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ resumeId: resume.id }),
  });

  await this.page.goto('/login');
  await this.page.getByLabel('Email').fill(email);
  await this.page.getByLabel('Password').fill('password123');
  await this.page.getByTestId('submit-auth').click();
  await this.page.getByRole('heading', { name: 'Dashboard' }).waitFor();
});

/* ---------- Register / login / oauth actions ---------- */

When(
  /^I register with name "([^"]+)", email "([^"]+)", and password "([^"]+)"$/,
  async function (this: E2EWorld, name: string, email: string, password: string) {
    const uniqueEmail = email.replace('@', `-${Date.now()}@`);
    await this.page.getByRole('button', { name: 'Register' }).click();
    await this.page.getByLabel('Name').fill(name);
    await this.page.getByLabel('Email').fill(uniqueEmail);
    await this.page.getByLabel('Password').fill(password);
    await this.page.getByTestId('submit-auth').click();
  },
);

When(/^I log in with email "([^"]+)" and password "([^"]+)"$/, { timeout: 30_000 }, async function (this: E2EWorld, email: string, password: string) {
  await this.page.goto('/login');
  await this.page.getByRole('heading', { name: /JobSearch Agents/ }).waitFor();
  await this.page.getByLabel('Email').fill(email);
  await this.page.getByLabel('Password').fill(password);
  await this.page.getByTestId('submit-auth').click();
});

When(/^I log in with the OAuth provider "([^"]+)"$/, { timeout: 30_000 }, async function (this: E2EWorld, provider: string) {
  await this.page.getByRole('button', { name: new RegExp(provider, 'i') }).click();
});

Then(/^I see the dashboard with the heading "([^"]+)"$/, { timeout: 30_000 }, async function (this: E2EWorld, heading: string) {
  await this.page.getByRole('heading', { name: heading }).waitFor({ timeout: 20_000 });
});
