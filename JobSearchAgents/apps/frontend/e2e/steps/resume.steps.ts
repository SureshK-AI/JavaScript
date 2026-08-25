import { Given, When, Then } from '@cucumber/cucumber';
import type { E2EWorld } from '../support/world.ts';
import { expect } from '@playwright/test';

/* ---------- Resume upload ---------- */

When(/^I upload a text resume with skills "([^"]+)"$/, async function (this: E2EWorld, skills: string) {
  await this.page.getByRole('link', { name: 'Resumes' }).click();
  const text = [
    'Jordan E2E',
    'Full-Stack Developer',
    'jordan.e2e@example.com',
    '',
    'Summary: Developer skilled in web platforms.',
    '',
    `Skills: ${skills}`,
    '',
    'Experience',
    'Developer, E2E Corp',
    '- Built web apps',
    '',
    'Education',
    'B.Tech Computer Science',
  ].join('\n');
  await this.page.getByTestId('resume-upload').setInputFiles({
    name: 'e2e-resume.txt',
    mimeType: 'text/plain',
    buffer: Buffer.from(text, 'utf8'),
  });
});

Then(/^I see a success message mentioning "([^"]+)"$/, async function (this: E2EWorld, keyword: string) {
  const msg = this.page.getByTestId('upload-message');
  await msg.waitFor({ timeout: 15_000 });
  expect(await msg.textContent()).toContain(keyword);
});

Then('I see a resume card with the filename', async function (this: E2EWorld) {
  await this.page.getByTestId('resume-card').waitFor({ timeout: 15_000 });
});

When('I open the dashboard', async function (this: E2EWorld) {
  await this.page.getByRole('link', { name: 'Dashboard' }).click();
  await this.page.getByRole('heading', { name: 'Dashboard' }).waitFor();
});

Then('the resume stat shows at least 1', async function (this: E2EWorld) {
  const stat = this.page.getByTestId('stat-resumes');
  await stat.waitFor({ timeout: 15_000 });
  const value = Number(await stat.locator('.value').textContent());
  expect(value).toBeGreaterThanOrEqual(1);
});
