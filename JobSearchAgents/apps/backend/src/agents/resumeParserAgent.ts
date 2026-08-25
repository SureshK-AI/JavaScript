import type { Agent, AgentContext, AgentRunResult } from './base.js';
import { parseResumeText } from '../services/resumeParser.js';
import { resumesRepo } from '../db/repository.js';

/** 1. Resume Parser Agent — extracts structured data from uploaded resumes. */
export const resumeParserAgent: Agent = {
  name: 'resume-parser',
  description: 'Parses a resume into structured data (skills, education, experience).',
  async run(context: AgentContext): Promise<AgentRunResult> {
    const resumeId = String(context.resumeId ?? '');
    const resume = resumesRepo.findById(resumeId);
    if (!resume) {
      return { agent: this.name, status: 'error', summary: 'Resume not found', error: 'resume_not_found' };
    }
    if (resume.parsedData) {
      return {
        agent: this.name,
        status: 'success',
        summary: `Resume already parsed (${resume.parsedData.skills.length} skills extracted).`,
        data: resume.parsedData,
      };
    }
    if (!resume.rawText) {
      return { agent: this.name, status: 'error', summary: 'Resume has no extractable text', error: 'empty_raw_text' };
    }
    const parsed = parseResumeText(resume.rawText);
    resumesRepo.create({
      userId: resume.userId,
      filename: resume.filename,
      mimeType: resume.mimeType,
      rawText: resume.rawText,
      parsedData: parsed,
    });
    return {
      agent: this.name,
      status: 'success',
      summary: `Parsed ${parsed.skills.length} skills, ${parsed.experience.length} roles, ${parsed.education.length} entries.`,
      data: parsed,
    };
  },
};
