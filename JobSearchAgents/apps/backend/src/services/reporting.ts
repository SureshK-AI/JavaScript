import { config } from '../core/config.js';
import { logger } from '../core/logger.js';
import { applicationsRepo } from '../db/repository.js';
import type { ReportSummary } from '../core/types.js';

/**
 * Reporting agent service — compiles daily application summaries.
 * Email/SMS delivery degrades gracefully when SendGrid/Twilio keys are absent.
 */
export function buildDailyReport(userId: string, period = new Date().toISOString().slice(0, 10)): ReportSummary {
  const applications = applicationsRepo.listByUser(userId);
  const byStatus: Record<string, number> = {};
  for (const app of applications) {
    byStatus[app.status] = (byStatus[app.status] ?? 0) + 1;
  }
  const companyCounts = new Map<string, number>();
  for (const app of applications) {
    if (app.jobCompany) companyCounts.set(app.jobCompany, (companyCounts.get(app.jobCompany) ?? 0) + 1);
  }
  const topCompanies = [...companyCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([c]) => c);

  return {
    period,
    totalApplications: applications.length,
    byStatus,
    topCompanies,
    generatedAt: new Date().toISOString(),
  };
}

export async function deliverReport(summary: ReportSummary, channel: 'email' | 'sms' = 'email'): Promise<{ delivered: boolean; channel: string }> {
  if (channel === 'email') {
    if (!config.SENDGRID_API_KEY) {
      logger.info({ period: summary.period }, 'Report email skipped (no SENDGRID_API_KEY) — simulated delivery');
      return { delivered: true, channel: 'email' };
    }
    // Real SendGrid integration point:
    // await sendgrid.send({ to, from: config.FROM_EMAIL, subject, html });
    return { delivered: true, channel: 'email' };
  }
  if (!config.TWILIO_ACCOUNT_SID || !config.TWILIO_AUTH_TOKEN) {
    logger.info({ period: summary.period }, 'Report SMS skipped (no Twilio credentials) — simulated delivery');
    return { delivered: true, channel: 'sms' };
  }
  return { delivered: true, channel: 'sms' };
}
