import { Given, When, Then } from '@cucumber/cucumber';
import type { E2EWorld } from '../support/world.ts';
import { expect } from '@playwright/test';

/* ---------- Job search & application ---------- */

When(/^I search for "([^"]+)" jobs$/, async function (this: E2EWorld, query: string) {
  await this.page.getByRole('link', { name: 'Jobs' }).click();
  await this.page.getByLabel('Query').fill(query);
  await this.page.getByRole('button', { name: 'Search jobs' }).click();
});

Then('I see job cards from multiple portals', async function (this: E2EWorld) {
  await this.page.getByTestId('job-card').first().waitFor({ timeout: 20_000 });
  const portals = new Set<string>();
  const badges = this.page.getByTestId('job-card').locator('.badge');
  const count = await badges.count();
  for (let i = 0; i < Math.min(count, 10); i += 1) {
    portals.add((await badges.nth(i).textContent())?.trim() ?? '');
  }
  expect(portals.size).toBeGreaterThanOrEqual(2);
});

When('I click Match on the first job', async function (this: E2EWorld) {
  const firstCard = this.page.getByTestId('job-card').first();
  await firstCard.getByRole('button', { name: 'Match' }).click();
});

Then('I see a match score result', async function (this: E2EWorld) {
  await this.page.getByTestId('match-result').waitFor({ timeout: 15_000 });
});

When('I click Apply on the first job', async function (this: E2EWorld) {
  const firstCard = this.page.getByTestId('job-card').first();
  await firstCard.getByRole('button', { name: 'Apply' }).click();
});

Then('I see an application result for the job', async function (this: E2EWorld) {
  await this.page.getByTestId('apply-result').waitFor({ timeout: 15_000 });
});

When('I open the applications page', async function (this: E2EWorld) {
  await this.page.getByRole('link', { name: 'Applications' }).click();
  await this.page.getByRole('heading', { name: 'Applications' }).waitFor();
});

Then('I see at least 1 application row', async function (this: E2EWorld) {
  await this.page.getByTestId('application-row').first().waitFor({ timeout: 15_000 });
});
