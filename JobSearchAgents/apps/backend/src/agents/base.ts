import type { AgentName, AgentRunResult } from '../core/types.js';

export type { AgentName, AgentRunResult };

export interface AgentContext {
  userId?: string;
  resumeId?: string;
  jobId?: string;
  applicationId?: string;
  [key: string]: unknown;
}

export interface Agent {
  name: AgentName;
  description: string;
  run(context: AgentContext): Promise<AgentRunResult>;
}
