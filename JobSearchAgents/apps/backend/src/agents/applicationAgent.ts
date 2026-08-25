import type { Agent, AgentContext, AgentRunResult } from './base.js';
import { applicationsRepo, jobsRepo, resumesRepo } from '../db/repository.js';
import { generateCoverLetter } from '../services/contentGeneration.js';
import { optimizeResumeForJob } from '../services/atsOptimizer.js';
import { config } from '../core/config.js';

/**
 * 7. Application Agent — auto-applies with the tailored resume + cover letter.
 * Disabled unless AUTOMATION_ENABLED=true. Real submissions would drive the
 * portal flow with Playwright (see scrapers/autoApply.ts); the safe default
 * records the application locally with full audit data.
 */
export const applicationAgent: Agent = {
  name: 'application',
  description: 'Submits applications with tailored resume and cover letter.',
  async run(context: AgentContext): Promise<AgentRunResult> {
    const userId = String(context.userId ?? '');
    const jobId = String(context.jobId ?? '');
    const resumeId = String(context.resumeId ?? '');
    if (!userId || !jobId || !resumeId) {
      return {
        agent: this.name,
        status: 'error',
        summary: 'Missing userId/jobId/resumeId',
        error: 'missing_context',
      };
    }
    const job = jobsRepo.findById(jobId);
    const resume = resumesRepo.findById(resumeId);
    if (!job || !resume?.parsedData) {
      return {
        agent: this.name,
        status: 'error',
        summary: `Job or parsed resume missing (job: ${!!job}, resume: ${!!resume})`,
        error: 'missing_job_or_resume',
      };
    }

    const { report } = optimizeResumeForJob(resume.parsedData, job);
    const coverLetter = generateCoverLetter(job, resume.parsedData);
    const attempts = Number(context.attempts ?? 1);

    // Playwright real-submission path (opt-in).
    if (config.AUTOMATION_ENABLED) {
      const { submitApplication } = await import('../scrapers/autoApply.js');
      const outcome = await submitApplication(job, resume.parsedData);
      if (!outcome.submitted) {
        return {
          agent: this.name,
          status: 'error',
          summary: `Portal submission failed after ${outcome.attempts} attempts`,
          error: 'submission_failed',
          data: outcome,
        };
      }
    }

    const application = applicationsRepo.create({
      userId,
      jobId,
      resumeId,
      status: 'submitted',
      coverLetter,
      atsScore: report.score,
    });
    const applicationId = application?.id ?? jobId;

    return {
      agent: this.name,
      status: 'success',
      summary: `Applied to ${job.company} — ${job.title} (ATS ${report.score}, attempt ${attempts}).`,
      data: {
        applicationId,
        status: 'submitted',
        atsScore: report.score,
        attempts,
        coverLetter,
        jobTitle: job.title,
        company: job.company,
      },
    };
  },
};
