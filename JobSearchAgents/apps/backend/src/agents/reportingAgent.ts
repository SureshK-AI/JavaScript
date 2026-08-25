import type { Agent, AgentContext, AgentRunResult } from './base.js';
import { buildDailyReport, deliverReport } from '../services/reporting.js';
import { reportsRepo } from '../db/repository.js';

/** 8. Reporting Agent — generates and delivers the daily report. */
export const reportingAgent: Agent = {
  name: 'reporting',
  description: 'Generates and delivers the daily application report.',
  async run(context: AgentContext): Promise<AgentRunResult> {
    const userId = String(context.userId ?? '');
    if (!userId) {
      return { agent: this.name, status: 'error', summary: 'Missing userId', error: 'missing_user' };
    }
    const period = String(context.period ?? new Date().toISOString().slice(0, 10));
    const channel = (context.channel as 'email' | 'sms') ?? 'email';
    const summary = buildDailyReport(userId, period);
    const delivery = await deliverReport(summary, channel);
    const record = reportsRepo.create({ userId, period, summary: JSON.stringify(summary), channel });
    return {
      agent: this.name,
      status: 'success',
      summary: `Report for ${period}: ${summary.totalApplications} applications, delivered via ${delivery.channel}.`,
      data: { reportId: record?.id ?? period, ...summary, delivery },
    };
  },
};
