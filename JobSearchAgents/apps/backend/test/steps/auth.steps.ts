import { Given, When, Then } from '@cucumber/cucumber';
import type { TestWorld } from '../support/world.ts';
import { apiCall, expectStatus, expectToken } from '../support/world.ts';

/* ---------- Registration / login ---------- */

Given(/^a candidate registers with email "([^"]+)", password "([^"]+)", and name "([^"]+)"$/, async function (this: TestWorld, email: string, password: string, name: string) {
  await apiCall.call(this, 'post', '/api/auth/register', { email, password, name });
  expectStatus(this.lastResponse, 201);
});

Given(/^a candidate with email "([^"]+)" already exists$/, async function (this: TestWorld, email: string) {
  await apiCall.call(this, 'post', '/api/auth/register', { email, password: 'password123', name: 'Existing' });
  expectStatus(this.lastResponse, 201);
});

Given(/^a candidate with email "([^"]+)" and password "([^"]+)" exists$/, async function (this: TestWorld, email: string, password: string) {
  await apiCall.call(this, 'post', '/api/auth/register', { email, password, name: 'Candidate' });
  expectStatus(this.lastResponse, 201);
});

Given('a registered candidate', async function (this: TestWorld) {
  await apiCall.call(this, 'post', '/api/auth/register', {
    email: `candidate-${Date.now()}@example.com`,
    password: 'password123',
    name: 'Test Candidate',
  });
  expectStatus(this.lastResponse, 201);
  this.token = String(this.lastResponse.body.token);
  this.userId = String(this.lastResponse.body.user.id);
});

When(/^the candidate registers with email "([^"]+)", password "([^"]+)", and name "([^"]+)"$/, async function (this: TestWorld, email: string, password: string, name: string) {
  await apiCall.call(this, 'post', '/api/auth/register', { email, password, name });
});

When(/^the candidate logs in with email "([^"]+)" and password "([^"]+)"$/, async function (this: TestWorld, email: string, password: string) {
  await apiCall.call(this, 'post', '/api/auth/login', { email, password });
});

When(/^the candidate authenticates with OAuth provider "([^"]+)"$/, async function (this: TestWorld, provider: string) {
  await apiCall.call(this, 'get', `/api/auth/oauth/${provider}`);
  if (this.lastResponse.status === 200) {
    this.token = String(this.lastResponse.body.token);
  }
});

Then(/^the API returns status (\d+)$/, function (this: TestWorld, status: number) {
  expectStatus(this.lastResponse, status);
});

Then('the response contains a JWT token', function (this: TestWorld) {
  expectToken(this.lastResponse);
});

Then(/^the response contains the candidate profile with email "([^"]+)"$/, function (this: TestWorld, email: string) {
  const userEmail = this.lastResponse.body.user?.email ?? this.lastResponse.body.email;
  if (userEmail !== email) {
    throw new Error(`Expected email ${email}, got ${userEmail}`);
  }
});

Then(/^the response identifies the provider as "([^"]+)"$/, function (this: TestWorld, provider: string) {
  const actual = this.lastResponse.body.provider;
  if (actual !== provider) {
    throw new Error(`Expected provider ${provider}, got ${actual}`);
  }
});
