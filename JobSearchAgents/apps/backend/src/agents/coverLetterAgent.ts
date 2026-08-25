import type { Agent, AgentContext, AgentRunResult } from './base.js';
import { jobsRepo, resumesRepo } from '../db/repository.js';
import { generateCoverLetter } from '../services/contentGeneration.js';

/** 10. Cover Letter Generator Agent — AI-style tailored cover letters. */
export const coverLetterAgent: Agent = {
  name: 'cover-letter',
  description: 'Generates a tailored cover letter for a job.',
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
    const letter = generateCoverLetter(job, resume.parsedData);
    return {
      agent: this.name,
      status: 'success',
      summary: `Generated cover letter for ${job.title} @ ${job.company}.`,
      data: { letter, jobTitle: job.title, company: job.company },
    };
  },
};
