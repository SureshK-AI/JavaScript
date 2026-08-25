import type { AtsReport, Job, ParsedResume } from '../core/types.js';
import { tokenize } from '../core/security.js';

/**
 * ATS optimization engine — keyword extraction from the JD, matching against the
 * resume, and actionable suggestions to push the score to 90+.
 */

/** Tech/skill terms that ATS tools actually scan for. */
const TECH_LEXICON = new Set([
  'typescript', 'javascript', 'react', 'angular', 'vue', 'node', 'node.js', 'express', 'next.js',
  'python', 'java', 'c#', 'c++', 'go', 'rust', 'ruby', 'php', 'kotlin', 'swift', 'scala',
  'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'graphql', 'rest', 'apollo', 'grpc',
  'docker', 'kubernetes', 'k8s', 'terraform', 'ansible', 'jenkins', 'ci/cd', 'github actions',
  'aws', 'azure', 'gcp', 's3', 'lambda', 'serverless', 'ec2', 'cloud', 'microservices',
  'playwright', 'selenium', 'cypress', 'jest', 'mocha', 'pytest', 'cucumber', 'bdd', 'tdd',
  'html', 'css', 'sass', 'tailwind', 'bootstrap', 'webpack', 'vite',
  'git', 'github', 'gitlab', 'bitbucket', 'agile', 'scrum', 'kanban', 'jira',
  'machine learning', 'deep learning', 'nlp', 'pytorch', 'tensorflow', 'scikit-learn', 'pandas', 'numpy',
  'data analysis', 'data engineering', 'etl', 'spark', 'hadoop', 'airflow', 'dbt',
  'excel', 'power bi', 'tableau', 'looker', 'google analytics',
  'rest api', 'api', 'oauth', 'jwt', 'websocket', 'redis', 'rabbitmq', 'kafka',
  'linux', 'bash', 'shell', 'windows', 'networking', 'security', 'testing', 'unit testing',
  'communication', 'leadership', 'mentoring', 'problem solving', 'teamwork', 'collaboration',
]);

/** Extracts the "Required skills: X, Y, Z" list if present in the JD. */
function extractRequiredSkills(description: string): string[] {
  const m = /required(?:\s+skills?)?\s*[::\-–]\s*([^.\n]+)/i.exec(description);
  const list = m?.[1];
  if (!list) return [];
  return list
    .split(/[,;]/)
    .map((s) => s.trim().toLowerCase().replace(/\.$/, ''))
    .filter((s) => s.length > 1);
}

export function extractJobKeywords(jobDescription: string): string[] {
  const required = extractRequiredSkills(jobDescription);
  const tokens = tokenize(jobDescription);
  const stop = new Set([
    'the', 'and', 'for', 'are', 'with', 'you', 'will', 'have', 'our', 'your', 'that',
    'this', 'from', 'into', 'work', 'role', 'team', 'candidate', 'job', 'experience',
    'years', 'year', 'plus', 'etc', 'including', 'such', 'ability', 'skills', 'skill',
    'required', 'requirements', 'responsibilities', 'preferred', 'must', 'strong', 'good',
    'knowledge', 'using', 'within', 'across', 'also', 'we', 'hiring', 'looking', 'seek',
    'modern', 'essential', 'competitive', 'salary', 'benefits', 'join', 'company',
    'develop', 'build', 'design', 'implement', 'manage', 'support', 'opportunity',
    'permanent', 'full', 'time', 'location', 'based', 'senior', 'junior', 'mid', 'level',
    'great', 'excellent', 'best', 'tools', 'agile', 'communication', 'problem', 'solving',
    'you', 'will', 'work', 'team', 'required', 'strong',
  ]);
  const keywords = new Set<string>();
  for (const r of required) keywords.add(r);
  for (const t of tokens) {
    if (!stop.has(t) && TECH_LEXICON.has(t)) keywords.add(t);
  }
  // Re-add multi-word phrases that the tokenizer splits.
  for (const phrase of TECH_LEXICON) {
    if (phrase.includes(' ') && jobDescription.toLowerCase().includes(phrase)) {
      keywords.add(phrase);
    }
  }
  return [...keywords].slice(0, 20);
}

export function optimizeResumeForJob(
  resume: ParsedResume,
  job: Job,
): { report: AtsReport; tailoredSkills: string[] } {
  const jdKeywords = extractJobKeywords(job.description);
  const required = extractRequiredSkills(job.description);
  const resumeTokens = tokenize(`${resume.skills.join(' ')} ${resume.summary ?? ''} ${resume.experience.map((e) => `${e.title ?? ''} ${e.bullets.join(' ')}`).join(' ')}`);
  const resumeRaw = resume.rawText.toLowerCase();

  const hasKeyword = (k: string): boolean => resumeTokens.has(k) || resumeRaw.includes(k);
  const missingKeywords = jdKeywords.filter((k) => !hasKeyword(k));
  const presentKeywords = jdKeywords.filter((k) => hasKeyword(k));

  // Required-skill coverage is the dominant ATS signal; overall keyword coverage
  // rounds it out.
  const requiredCoverage = required.length
    ? required.filter(hasKeyword).length / required.length
    : presentKeywords.length / Math.max(jdKeywords.length, 1);
  const overallCoverage = jdKeywords.length ? presentKeywords.length / jdKeywords.length : 1;

  let score = 25; // base structure
  score += Math.round(requiredCoverage * 55);
  score += Math.round(overallCoverage * 15);
  score += Math.min(presentKeywords.length, 4);
  if (resume.experience.length > 0) score += 1;
  score = Math.min(99, Math.round(score));

  const atsCompliant = score >= 90;

  const suggestions: string[] = [];
  if (missingKeywords.length) {
    suggestions.push(`Add missing keywords to your summary/experience: ${missingKeywords.slice(0, 8).join(', ')}.`);
  }
  if (resume.experience.length === 0) {
    suggestions.push('Add quantified work experience bullets (e.g. "Led a 5-person team").');
  }
  if (!resume.summary) {
    suggestions.push('Add a professional summary containing the top JD keywords.');
  }
  if (!resume.phone) {
    suggestions.push('Ensure contact details (email/phone) are in the header for ATS parsing.');
  }
  if (atsCompliant) {
    suggestions.push('Score is at or above the 90% ATS target.');
  } else {
    suggestions.push(`Target ${Math.max(0, missingKeywords.length)} missing keyword(s) to reach 90+.`);
  }

  const report: AtsReport = {
    score,
    missingKeywords,
    presentKeywords,
    suggestions,
    atsCompliant,
  };
  const tailoredSkills = [...new Set([...resume.skills, ...presentKeywords])];
  return { report, tailoredSkills };
}
