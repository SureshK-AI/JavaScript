import type { Agent, AgentContext, AgentRunResult } from './base.js';
import { parseFeedbackEmail } from '../services/feedbackParser.js';
import { applicationsRepo } from '../db/repository.js';

/** 9. Feedback Agent — tracks recruiter responses by parsing reply emails. */
export const feedbackAgent: Agent = {
  name: 'feedback',
  description: 'Parses recruiter emails and updates application statuses.',
  async run(context: AgentContext): Promise<AgentRunResult> {
    const rawEmail = String(context.email ?? context.rawEmail ?? '');
    if (!rawEmail) {
      return { agent: this.name, status: 'error', summary: 'No email content provided', error: 'missing_email' };
    }
    const { applicationRef, status } = parseFeedbackEmail(rawEmail);
    if (applicationRef) {
      const app = applicationsRepo.findById(applicationRef);
      if (app) {
        applicationsRepo.updateStatus(app.id, status);
        return {
          agent: this.name,
          status: 'success',
          summary: `Updated application ${applicationRef} to "${status}".`,
          data: { applicationRef, status },
        };
      }
    }
    return {
      agent: this.name,
      status: 'success',
      summary: `Classified recruiter email as "${status}" (no application ref matched).`,
      data: { status },
    };
  },
};
