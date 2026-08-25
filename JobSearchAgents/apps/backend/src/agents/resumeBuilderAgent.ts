import type { Agent, AgentContext, AgentRunResult } from './base.js';
import { jobsRepo, resumesRepo } from '../db/repository.js';
import { createResumeVersion, type ResumeVersion } from '../services/multiResume.js';

/** 3. Resume Builder Agent — tailors resume versions per job description. */
export const resumeBuilderAgent: Agent = {
  name: 'resume-builder',
  description: 'Creates a tailored resume version for a specific job.',
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
    const version: ResumeVersion = createResumeVersion(parsed, job, resumeId);
    return {
      agent: this.name,
      status: 'success',
      summary: `Built "${version.roleFamily}" version (ATS ${version.atsScore}) targeting ${version.skills.length} keywords.`,
      data: version,
    };
  },
};
