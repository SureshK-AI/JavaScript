import type { Job, MatchResult, ParsedResume } from '../core/types.js';
import { cosineSimilarity, tokenize } from '../core/security.js';
import { extractJobKeywords } from './atsOptimizer.js';

/**
 * Job matching via cosine similarity over keyword sets (Sentence-BERT stand-in).
 * The SRS target: relevant jobs score ≥ 0.75.
 */
export function matchJobToResume(job: Job, resume: ParsedResume): Omit<MatchResult, 'jobId' | 'resumeId'> {
  const jdTokens = tokenize(job.description);
  const resumeTokens = tokenize(
    `${resume.skills.join(' ')} ${resume.summary ?? ''} ${resume.experience.map((e) => `${e.title ?? ''} ${e.bullets.join(' ')}`).join(' ')}`,
  );
  const resumeRaw = resume.rawText.toLowerCase();

  const jdKeywords = extractJobKeywords(job.description);
  const hasKeyword = (k: string): boolean => resumeTokens.has(k) || resumeRaw.includes(k.toLowerCase());
  const matchedSkills = jdKeywords.filter(hasKeyword);
  const missingSkills = jdKeywords.filter((k) => !hasKeyword(k));

  const base = cosineSimilarity(jdTokens, resumeTokens);
  const coverage = jdKeywords.length ? matchedSkills.length / jdKeywords.length : 0;
  // Blend token similarity (semantic stand-in) with explicit skill coverage.
  const score = Math.min(1, Math.round((base * 0.35 + coverage * 0.65) * 100) / 100);

  const explanation =
    score >= 0.75
      ? `Strong match: ${matchedSkills.length} JD keywords present in resume (score ${score.toFixed(2)}).`
      : `Moderate match: resume covers ${matchedSkills.length}/${jdKeywords.length} JD keywords (score ${score.toFixed(2)}).`;

  return { score, matchedSkills, missingSkills, explanation };
}

/** Cosine similarity for two raw texts (used by reports/tests). */
export function similarityBetween(a: string, b: string): number {
  return cosineSimilarity(tokenize(a), tokenize(b));
}
