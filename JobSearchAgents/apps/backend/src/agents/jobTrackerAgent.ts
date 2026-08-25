import type { Agent, AgentContext, AgentRunResult } from './base.js';
import { applicationsRepo, jobsRepo } from '../db/repository.js';
import type { ApplicationStatus } from '../core/types.js';

/** 14. Job Tracker Agent — tracks application statuses. */
export const jobTrackerAgent: Agent = {
  name: 'job-tracker',
  description: 'Tracks application statuses and reports the pipeline.',
  async run(context: AgentContext): Promise<AgentRunResult> {
    const userId = String(context.userId ?? '');
    if (!userId) {
      return { agent: this.name, status: 'error', summary: 'Missing userId', error: 'missing_user' };
    }
    const applications = applicationsRepo.listByUser(userId);
    const byStatus: Record<string, number> = {};
    for (const app of applications) byStatus[app.status] = (byStatus[app.status] ?? 0) + 1;
    const newStatus = context.status as ApplicationStatus | undefined;
    let updated: unknown = null;
    if (newStatus && context.applicationId) {
      updated = applicationsRepo.updateStatus(String(context.applicationId), newStatus);
    }
    return {
      agent: this.name,
      status: 'success',
      summary: `Tracking ${applications.length} applications (${Object.entries(byStatus).map(([k, v]) => `${k}: ${v}`).join(', ')}).`,
      data: { applications, byStatus, updated },
    };
  },
};
