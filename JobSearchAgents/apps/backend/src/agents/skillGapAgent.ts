import type { Agent, AgentContext, AgentRunResult } from './base.js';
import { jobsRepo, resumesRepo } from '../db/repository.js';
import { analyzeSkillGap } from '../services/skillGap.js';

/** 12. Skill Gap Analyzer Agent — compares JD vs resume skills. */
export const skillGapAgent: Agent = {
  name: 'skill-gap',
  description: 'Highlights skills missing from the resume versus the job description.',
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
    const report = analyzeSkillGap(job, resume.parsedData);
    return {
      agent: this.name,
      status: 'success',
      summary: `Coverage ${(report.coverage * 100).toFixed(0)}% — ${report.missingSkills.length} missing skills.`,
      data: report,
    };
  },
};
