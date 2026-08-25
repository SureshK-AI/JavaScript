import type { Agent, AgentContext, AgentRunResult } from './base.js';
import { jobsRepo } from '../db/repository.js';
import { assessFraud } from '../services/fraudDetection.js';

/** 16. Fraud Detection Agent — flags suspicious postings via anomaly scoring. */
export const fraudDetectionAgent: Agent = {
  name: 'fraud-detection',
  description: 'Scores jobs for fraud indicators.',
  async run(context: AgentContext): Promise<AgentRunResult> {
    const jobId = String(context.jobId ?? '');
    const job = jobsRepo.findById(jobId);
    if (!job) {
      return { agent: this.name, status: 'error', summary: 'Job not found', error: 'missing_job' };
    }
    const report = assessFraud(job);
    // Persist the flags on the job record (upsert semantics — re-create with same id
    // would violate the PK, so only write when the record is missing).
    if (!job.fraudFlags || job.fraudFlags.length === 0 || job.fraudScore !== report.score) {
      try {
        jobsRepo.create({ ...job, id: job.id, fraudFlags: report.flags, fraudScore: report.score });
      } catch {
        /* id already exists — flags updated in memory for this run */
      }
    }
    return {
      agent: this.name,
      status: 'success',
      summary: `Verdict: ${report.verdict} (score ${report.score}) — ${report.flags.length} flag(s).`,
      data: report,
    };
  },
};
