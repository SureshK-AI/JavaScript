import type { Agent, AgentContext, AgentRunResult } from './base.js';
import { resumesRepo } from '../db/repository.js';
import { careerCoaching } from '../services/contentGeneration.js';

/** 15. Career Coach Agent — advice + salary benchmarking. */
export const careerCoachAgent: Agent = {
  name: 'career-coach',
  description: 'Provides career advice and salary benchmarks.',
  async run(context: AgentContext): Promise<AgentRunResult> {
    const resumeId = String(context.resumeId ?? '');
    const resume = resumesRepo.findById(resumeId);
    if (!resume?.parsedData) {
      return {
        agent: this.name,
        status: 'error',
        summary: 'Resume not found or not parsed',
        error: 'missing_resume',
      };
    }
    const { advice, benchmark } = careerCoaching(resume.parsedData);
    return {
      agent: this.name,
      status: 'success',
      summary: `Delivered ${advice.length} coaching tips and a salary benchmark.`,
      data: { advice, benchmark },
    };
  },
};
