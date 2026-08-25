import type { Job, ParsedResume, SkillGapReport } from '../core/types.js';
import { tokenize } from '../core/security.js';
import { extractJobKeywords } from './atsOptimizer.js';

/**
 * Skill gap analysis: compares JD-required skills against the resume.
 * SRS target: highlights ≥ 90% of missing skills.
 */
export function analyzeSkillGap(job: Job, resume: ParsedResume): SkillGapReport {
  const jdKeywords = extractJobKeywords(job.description);
  const resumeTokens = tokenize(
    `${resume.skills.join(' ')} ${resume.summary ?? ''} ${resume.experience.map((e) => e.bullets.join(' ')).join(' ')}`,
  );

  const matchedSkills = jdKeywords.filter((k) => resumeTokens.has(k));
  const missingSkills = jdKeywords.filter((k) => !resumeTokens.has(k));
  const coverage = jdKeywords.length ? matchedSkills.length / jdKeywords.length : 1;

  const suggestions = missingSkills.length
    ? [
        `Add these skills to your resume: ${missingSkills.slice(0, 10).join(', ')}.`,
        'Highlight transferable experience that demonstrates these competencies.',
        'Add a projects section that exercises the missing skills.',
      ]
    : ['Your resume covers all JD keywords.'];

  return {
    matchedSkills,
    missingSkills,
    coverage: Math.round(coverage * 100) / 100,
    suggestions,
  };
}
