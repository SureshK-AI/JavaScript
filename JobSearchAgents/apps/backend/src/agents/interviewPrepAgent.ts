import type { Agent, AgentContext, AgentRunResult } from './base.js';
import { jobsRepo, resumesRepo } from '../db/repository.js';
import { generateInterviewQuestions } from '../services/contentGeneration.js';

/** 11. Interview Prep Agent — generates practice questions per JD. */
export const interviewPrepAgent: Agent = {
  name: 'interview-prep',
  description: 'Generates practice interview questions for a job.',
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
    const questions = generateInterviewQuestions(job, resume.parsedData);
    return {
      agent: this.name,
      status: 'success',
      summary: `Generated ${questions.length} practice questions for ${job.title}.`,
      data: { questions, jobTitle: job.title },
    };
  },
};
