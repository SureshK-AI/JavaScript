import type { Agent, AgentContext, AgentRunResult } from './base.js';
import { jobsRepo, matchesRepo, resumesRepo } from '../db/repository.js';
import { matchJobToResume } from '../services/matcher.js';

/** 6. Job Matching Agent — scores jobs against the resume (cosine similarity). */
export const jobMatchingAgent: Agent = {
  name: 'job-matching',
  description: 'Scores a job against a resume using semantic similarity.',
  async run(context: AgentContext): Promise<AgentRunResult> {
    const resumeId = String(context.resumeId ?? '');
    const jobId = String(context.jobId ?? '');
    const resume = resumesRepo.findById(resumeId);
    const job = jobsRepo.findById(jobId);
    if (!resume?.parsedData || !job) {
      return {
        agent: this.name,
        status: 'error',
        summary: `Missing context (resume: ${!!resume}, job: ${!!job})`,
        error: 'missing_resume_or_job',
      };
    }
    const result = matchJobToResume(job, resume.parsedData);
    matchesRepo.create({ jobId, resumeId, ...result });
    return {
      agent: this.name,
      status: 'success',
      summary: `Match score ${result.score.toFixed(2)} (${result.matchedSkills.length} matched skills).`,
      data: result,
    };
  },
};
