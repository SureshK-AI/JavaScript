import type { FraudReport, Job } from '../core/types.js';

/**
 * Fraud detection via heuristic anomaly scoring.
 * SRS target: fraud detection accuracy ≥ 85%.
 */
const FRAUD_PATTERNS: Array<{ pattern: RegExp; weight: number; label: string }> = [
  { pattern: /\b(click\s*here|apply\s*now\s*to\s*claim|limited\s*time\s*offer)\b/i, weight: 0.3, label: 'urgency pressure' },
  { pattern: /\b(no\s*experience\s*needed|no\s*interview\s*required|guaranteed\s*income)\b/i, weight: 0.4, label: 'too-good-to-be-true' },
  { pattern: /\b(wire\s*money|western\s*union|money\s*gram|advance\s*fee|processing\s*fee)\b/i, weight: 0.6, label: 'payment request' },
  { pattern: /\b(cash\s*app|zelle|paypal\s*me|bitcoin|cryptocurrency)\b/i, weight: 0.5, label: 'unusual payment channel' },
  { pattern: /\b(ssn|social\s*security\s*number|bank\s*account\s*number|credit\s*card)\b/i, weight: 0.5, label: 'sensitive data request' },
  { pattern: /\b(reply\s*to|contact)\s+[^\s@]+@(gmail|yahoo|hotmail|outlook)\.com\b/i, weight: 0.35, label: 'personal email domain' },
  { pattern: /\b(salary\s*\$?[5-9]\d{2,3}\s*(per\s*)?(week|day))\b/i, weight: 0.4, label: 'unrealistic compensation' },
];

export function assessFraud(job: Job): FraudReport {
  const text = `${job.title}\n${job.company}\n${job.description}`.toLowerCase();
  const flags: string[] = [];
  let score = 0;

  for (const { pattern, weight, label } of FRAUD_PATTERNS) {
    if (pattern.test(text)) {
      flags.push(label);
      score += weight;
    }
  }

  // Legitimate postings usually have a real URL + structured description.
  if (!job.url || job.url.length < 10) {
    flags.push('missing posting url');
    score += 0.15;
  }
  if (job.description.length < 120) {
    flags.push('suspiciously short description');
    score += 0.15;
  }

  score = Math.min(1, score);
  const verdict = score >= 0.6 ? 'fraudulent' : score >= 0.3 ? 'suspicious' : 'legitimate';

  return { score: Math.round(score * 100) / 100, flags, verdict };
}
