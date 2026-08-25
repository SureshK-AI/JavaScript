import type { Agent, AgentContext } from './base.js';
import { resumeParserAgent } from './resumeParserAgent.js';
import { resumeBuilderAgent } from './resumeBuilderAgent.js';
import { resumeOptimizerAgent } from './resumeOptimizerAgent.js';
import { jobSearchAgent } from './jobSearchAgent.js';
import { jobMatchingAgent } from './jobMatchingAgent.js';
import { applicationAgent } from './applicationAgent.js';
import { reportingAgent } from './reportingAgent.js';
import { feedbackAgent } from './feedbackAgent.js';
import { coverLetterAgent } from './coverLetterAgent.js';
import { interviewPrepAgent } from './interviewPrepAgent.js';
import { skillGapAgent } from './skillGapAgent.js';
import { multiResumeAgent } from './multiResumeAgent.js';
import { jobTrackerAgent } from './jobTrackerAgent.js';
import { careerCoachAgent } from './careerCoachAgent.js';
import { fraudDetectionAgent } from './fraudDetectionAgent.js';

export const agents: Agent[] = [
  resumeParserAgent,
  resumeBuilderAgent,
  resumeOptimizerAgent,
  jobSearchAgent,
  jobMatchingAgent,
  applicationAgent,
  reportingAgent,
  feedbackAgent,
  coverLetterAgent,
  interviewPrepAgent,
  skillGapAgent,
  multiResumeAgent,
  jobTrackerAgent,
  careerCoachAgent,
  fraudDetectionAgent,
];

const registry = new Map<string, Agent>(agents.map((a) => [a.name, a]));

export function getAgent(name: string): Agent | undefined {
  return registry.get(name);
}

export function listAgents(): Array<{ name: string; description: string }> {
  return agents.map((a) => ({ name: a.name, description: a.description }));
}
