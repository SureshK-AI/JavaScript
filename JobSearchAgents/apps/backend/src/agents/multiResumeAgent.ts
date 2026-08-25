import type { Agent, AgentContext, AgentRunResult } from './base.js';
import { resumesRepo, jobsRepo } from '../db/repository.js';
import { createResumeVersion, dedupeVersions } from '../services/multiResume.js';

/** 13. Multi Resume Strategy Agent — maintains multiple resume versions. */
export const multiResumeAgent: Agent = {
  name: 'multi-resume',
  description: 'Builds and dedupes multiple tailored resume versions.',
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
    const version = createResumeVersion(resume.parsedData, job, resumeId);
    const allVersions = dedupeVersions([version]);
    return {
      agent: this.name,
      status: 'success',
      summary: `Maintained ${allVersions.length} resume version(s) for role family "${version.roleFamily}".`,
      data: { versions: allVersions, current: version },
    };
  },
};
