import type { Agent, AgentContext, AgentRunResult } from './base.js';
import { getAgent, agents } from './registry.js';
import { agentRunsRepo } from '../db/repository.js';
import { logger } from '../core/logger.js';

export interface PipelineResult {
  results: AgentRunResult[];
  successCount: number;
  failedCount: number;
}

/**
 * Orchestrates the multi-agent pipeline:
 * parse → build → optimize → search → match → apply → report.
 * Individual agents may be skipped (e.g. missing context) without failing the run.
 */
export class AgentOrchestrator {
  async runAgent(name: string, context: AgentContext): Promise<AgentRunResult> {
    const agent = getAgent(name);
    if (!agent) {
      return { agent: name as Agent['name'], status: 'error', summary: `Unknown agent: ${name}`, error: 'unknown_agent' };
    }
    try {
      const result = await agent.run(context);
      agentRunsRepo.record({
        agent: name,
        status: result.status,
        summary: result.summary,
        data: result.data,
        error: result.error,
      });
      return result;
    } catch (err) {
      logger.error({ err, agent: name }, 'Agent crashed');
      const result: AgentRunResult = {
        agent: name as Agent['name'],
        status: 'error',
        summary: `Agent crashed: ${(err as Error).message}`,
        error: (err as Error).message,
      };
      agentRunsRepo.record({ agent: name, status: 'error', summary: result.summary, error: result.error });
      return result;
    }
  }

  /** Runs the full happy-path pipeline and returns each agent's result. */
  async runPipeline(context: AgentContext): Promise<PipelineResult> {
    const steps = [
      ['resume-parser', context],
      ['resume-builder', context],
      ['resume-optimizer', context],
      ['job-search', { ...context, query: context.query ?? 'software engineer' }],
      ['job-matching', context],
      ['application', context],
      ['reporting', context],
    ] as const;

    const results: AgentRunResult[] = [];
    for (const [name, ctx] of steps) {
      const result = await this.runAgent(name, { ...ctx });
      results.push(result);
      logger.info({ agent: name, status: result.status }, 'Pipeline step finished');
    }

    return {
      results,
      successCount: results.filter((r) => r.status === 'success').length,
      failedCount: results.filter((r) => r.status === 'error').length,
    };
  }

  async runAll(context: AgentContext): Promise<PipelineResult> {
    const results: AgentRunResult[] = [];
    for (const agent of agents) {
      results.push(await this.runAgent(agent.name, context));
    }
    return {
      results,
      successCount: results.filter((r) => r.status === 'success').length,
      failedCount: results.filter((r) => r.status === 'error').length,
    };
  }
}

export const orchestrator = new AgentOrchestrator();
