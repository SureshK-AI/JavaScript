import { Given, When, Then } from '@cucumber/cucumber';
import type { TestWorld } from '../support/world.ts';
import { apiCall, expectStatus, uploadResume } from '../support/world.ts';

/* ---------- Resume fixtures ---------- */

function buildResumeText(skillsLine: string, email?: string): string {
  return [
    'Alex Johnson',
    'Senior Software Engineer',
    email ?? 'alex.johnson@example.com',
    'Phone: +1 555-0100',
    '',
    'Summary: Experienced full-stack developer focused on web platforms and cloud.',
    '',
    'Skills: ' + skillsLine,
    '',
    'Experience',
    'Senior Developer, Example Corp',
    '- Built scalable web services used by 2M+ users',
    '- Led a team of 5 engineers',
    '',
    'Education',
    'B.Sc. Computer Science, State University',
    '',
    'Certifications',
    'Certified AWS Solutions Architect',
  ].join('\n');
}

Given(/^a text resume with skills "([^"]+)" and email "([^"]+)"$/, function (this: TestWorld, skills: string, email: string) {
  const text = buildResumeText(skills, email);
  this.uploadBuffer = Buffer.from(text, 'utf8');
  this.uploadMime = 'text/plain';
  this.fixtures.set('text', text);
});

Given(/^a docx resume with skills "([^"]+)"$/, async function (this: TestWorld, skills: string) {
  // Build a real, minimal DOCX (zip) with the resume text in word/document.xml
  // so mammoth can extract it.
  const text = buildResumeText(skills);
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();
  zip.file(
    '[Content_Types].xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
</Types>`,
  );
  zip.file(
    '_rels/.rels',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/>
</Relationships>`,
  );
  zip.file(
    'word/document.xml',
    `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>${text
    .split('\n')
    .map((line) => `<w:p><w:r><w:t xml:space="preserve">${escapeXml(line)}</w:t></w:r></w:p>`)
    .join('')}</w:body>
</w:document>`,
  );
  this.uploadBuffer = await zip.generateAsync({ type: 'nodebuffer' });
  this.uploadMime = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
  this.fixtures.set('docx', text);
});

function escapeXml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

Given(/^a pdf resume with skills "([^"]+)"$/, function (this: TestWorld, skills: string) {
  const text = buildResumeText(skills);
  // Minimal valid PDF with a text object — parseable by pdf-parse.
  const pdf = `%PDF-1.4\n1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n2 0 obj<</Type/Pages/Kids[3 0 R]/Count 1>>endobj\n3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 612 792]/Contents 4 0 R>>endobj\n4 0 obj<</Length ${text.length + 20}>>stream\nBT /F1 12 Tf 72 720 Td (${text.replace(/[()\\]/g, '\\$&')}) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000052 00000 n \n0000000101 00000 n \n0000000178 00000 n \ntrailer<</Size 5/Root 1 0 R>>\nstartxref\n${317 + text.length}\n%%EOF`;
  this.uploadBuffer = Buffer.from(pdf, 'utf8');
  this.uploadMime = 'application/pdf';
  this.fixtures.set('pdf', text);
});

Given('a binary file with invalid extension', function (this: TestWorld) {
  this.uploadBuffer = Buffer.from([0x4d, 0x5a, 0x90, 0x00, 0x03, 0x00, 0x00, 0x00]);
  this.uploadMime = 'application/octet-stream';
});

Given('a registered candidate with an uploaded resume', async function (this: TestWorld) {
  await apiCall.call(this, 'post', '/api/auth/register', {
    email: `uploaded-${Date.now()}@example.com`,
    password: 'password123',
    name: 'Uploader',
  });
  expectStatus(this.lastResponse, 201);
  this.token = String(this.lastResponse.body.token);
  this.uploadBuffer = Buffer.from(buildResumeText('TypeScript, React, Node.js'), 'utf8');
  this.uploadMime = 'text/plain';
  await uploadResume.call(this, 'resume.txt');
  expectStatus(this.lastResponse, 201);
  this.resumeId = String(this.lastResponse.body.resume.id);
});

/* ---------- Upload & parse ---------- */

When(/^the candidate uploads the resume as "([^"]+)"$/, async function (this: TestWorld, filename: string) {
  if (!this.uploadBuffer) throw new Error('No fixture buffer set');
  const res = await import('supertest');
  const req = res.default(this.app)
    .post('/api/resumes')
    .set('Authorization', `Bearer ${this.token}`)
    .attach('file', this.uploadBuffer, { filename, contentType: this.uploadMime });
  this.lastResponse = await req;
});

Then(/^the parsed resume contains the skill "([^"]+)"$/, function (this: TestWorld, skill: string) {
  const parsed = this.lastResponse.body.parsed ?? this.lastResponse.body.resume?.parsedData;
  const skills: string[] = parsed?.skills ?? [];
  if (!skills.includes(skill.toLowerCase())) {
    throw new Error(`Parsed skills [${skills.join(', ')}] do not include "${skill}"`);
  }
});

Then(/^the parsed resume contains the email "([^"]+)"$/, function (this: TestWorld, email: string) {
  const parsed = this.lastResponse.body.parsed ?? this.lastResponse.body.resume?.parsedData;
  if (parsed?.email !== email) {
    throw new Error(`Parsed email "${parsed?.email}" does not match "${email}"`);
  }
});

Then('the resume parse completed in under 5 seconds', function () {
  const ms = Number(this.lastResponse.body.parseTimeMs ?? 0);
  if (ms >= 5000) throw new Error(`Parse took ${ms}ms — expected < 5000ms`);
});

When('the candidate lists their resumes', async function (this: TestWorld) {
  await apiCall.call(this, 'get', '/api/resumes');
});

Then(/^the response contains at least (\d+) resume(?:s)?$/, function (this: TestWorld, n: number) {
  const resumes = this.lastResponse.body.resumes ?? [];
  if (resumes.length < n) throw new Error(`Expected ≥ ${n} resumes, got ${resumes.length}`);
});
