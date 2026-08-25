import type { Agent, AgentContext, AgentRunResult } from './base.js';
import { jobsRepo, resumesRepo } from '../db/repository.js';
import { optimizeResumeForJob } from '../services/atsOptimizer.js';

/** 4. Resume Optimizer Agent — ensures ATS compliance and 90+ scores. */
export const resumeOptimizerAgent: Agent = {
  name: 'resume-optimizer',
  description: 'ATS-optimizes a resume against a job description.',
  async run(context: AgentContext): Promise<AgentRunResult> {
    const resumeId = String(context.resumeId ?? '');
    const jobId = String(context.jobId ?? '');
    const resume = resumesRepo.findById(resumeId);
    const job = jobsRepo.findById(jobId);
    if (!resume || !job) {
      return {
        agent: this.name,
        status: 'error',
        summary: `Missing context (resume: ${!!resume}, job: ${!!job})`,
        error: 'missing_resume_or_job',
      };
    }
    const parsed = resume.parsedData;
    if (!parsed) {
      return { agent: this.name, status: 'error', summary: 'Resume not parsed yet', error: 'not_parsed' };
    }
    const { report, tailoredSkills } = optimizeResumeForJob(parsed, job);
    return {
      agent: this.name,
      status: 'success',
      summary: `ATS score ${report.score} (${report.atsCompliant ? 'compliant ≥90' : 'needs work'}). ${report.missingKeywords.length} missing keywords.`,
      data: { report, tailoredSkills },
    };
  },
};
