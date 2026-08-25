import crypto from 'node:crypto';
import type { Job, ParsedResume } from '../core/types.js';
import { optimizeResumeForJob } from './atsOptimizer.js';
import { analyzeSkillGap } from './skillGap.js';

/**
 * Multi-resume strategy — maintains multiple tailored resume versions per role
 * family. Creates a new version for a (role, target keywords) pair.
 */
export interface ResumeVersion {
  id: string;
  baseResumeId: string;
  roleFamily: string;
  version: string;
  skills: string[];
  summary: string;
  content: string;
  atsScore: number;
  createdAt: string;
}

export function createResumeVersion(
  resume: ParsedResume,
  job: Job,
  baseResumeId: string,
): ResumeVersion {
  const { report, tailoredSkills } = optimizeResumeForJob(resume, job);
  const roleFamily = job.title
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .trim()
    .split(/\s+/)
    .slice(0, 3)
    .join(' ') || 'general';

  const summary =
    resume.summary ??
    `Experienced professional skilled in ${tailoredSkills.slice(0, 5).join(', ') || 'software development'}.`;

  const content = [
    `# ${resume.fullName ?? 'Candidate'} — ${job.title} (ATS ${report.score})`,
    ``,
    `**Summary:** ${summary}`,
    ``,
    `**Targeted keywords:** ${tailoredSkills.slice(0, 12).join(', ')}`,
    ``,
    `**Experience highlights:**`,
    ...resume.experience.slice(0, 3).flatMap((e) => [`- ${e.title ?? e.company ?? 'Role'}${e.company ? ` @ ${e.company}` : ''}: ${e.bullets[0] ?? ''}`]),
    ``,
    `**Education:**`,
    ...resume.education.slice(0, 2).map((e) => `- ${e.degree ?? e.institution ?? ''}`),
  ].join('\n');

  return {
    id: crypto.randomUUID(),
    baseResumeId,
    roleFamily,
    version: `v${Math.floor(Math.random() * 900 + 100)}`,
    skills: tailoredSkills,
    summary,
    content,
    atsScore: report.score,
    createdAt: new Date().toISOString(),
  };
}

export function dedupeVersions(versions: ResumeVersion[]): ResumeVersion[] {
  const seen = new Set<string>();
  return versions.filter((v) => {
    const key = `${v.roleFamily}|${v.skills.slice(0, 5).join(',')}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}
