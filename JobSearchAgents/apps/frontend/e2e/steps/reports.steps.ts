import { When, Then } from '@cucumber/cucumber';
import type { E2EWorld } from '../support/world.ts';
import { expect } from '@playwright/test';

/* ---------- Reports & agents ---------- */

When('I open the reports page and generate a daily report', async function (this: E2EWorld) {
  await this.page.getByRole('link', { name: 'Reports' }).click();
  await this.page.getByRole('heading', { name: 'Daily Reports' }).waitFor();
  await this.page.getByTestId('generate-report').click();
});

Then('I see the report summary', async function (this: E2EWorld) {
  await this.page.getByTestId('report-summary').waitFor({ timeout: 15_000 });
});

When('I open the agents page and run the pipeline', async function (this: E2EWorld) {
  await this.page.getByRole('link', { name: 'Agents' }).click();
  await this.page.getByRole('heading', { name: 'Agents', exact: true }).waitFor();
  await this.page.getByTestId('run-pipeline').click();
});

Then('I see the pipeline success count', async function (this: E2EWorld) {
  const result = this.page.getByTestId('pipeline-result');
  await result.waitFor({ timeout: 30_000 });
  const text = await result.textContent();
  expect(text).toMatch(/agents succeeded/);
});
