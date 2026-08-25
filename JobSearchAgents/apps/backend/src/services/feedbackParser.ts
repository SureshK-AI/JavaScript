/** Parses recruiter reply emails into application status updates (Feedback Agent). */

import type { ApplicationStatus } from '../core/types.js';

const STATUS_KEYWORDS: Array<{ status: ApplicationStatus; patterns: RegExp[] }> = [
  {
    status: 'interview',
    patterns: [/interview/i, /schedule a call/i, /meet the team/i, /next round/i],
  },
  {
    status: 'offer',
    patterns: [/offer/i, /congratulations.*(join|hire)/i, /welcome to the team/i, /sign the offer/i],
  },
  {
    status: 'rejected',
    patterns: [/unfortunately/i, /not moving forward/i, /other candidates/i, /regret to inform/i],
  },
  {
    status: 'shortlisted',
    patterns: [/shortlist/i, /moving to the next stage/i, /advance/i],
  },
  {
    status: 'viewed',
    patterns: [/received your application/i, /reviewing your/i, /under review/i],
  },
];

export function classifyRecruiterEmail(subject: string, body: string): ApplicationStatus {
  const text = `${subject}\n${body}`;
  const scores = STATUS_KEYWORDS.map(({ status, patterns }) => ({
    status,
    score: patterns.filter((p) => p.test(text)).length,
  })).sort((a, b) => b.score - a.score);
  return scores[0] && scores[0].score > 0 ? scores[0].status : 'submitted';
}

export function parseFeedbackEmail(rawEmail: string): { applicationRef?: string; status: ApplicationStatus } {
  const ref = /(?:application|ref)[:\s#]*([A-Za-z0-9-]{8,})/i.exec(rawEmail)?.[1];
  const status = classifyRecruiterEmail('', rawEmail);
  return { applicationRef: ref, status };
}
