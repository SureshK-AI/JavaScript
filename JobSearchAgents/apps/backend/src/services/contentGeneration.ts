import type { Job, ParsedResume } from '../core/types.js';
import { extractJobKeywords } from './atsOptimizer.js';

/**
 * Template-driven content generation (cover letters, interview questions,
 * career coaching). Stands in for a hosted LLM API while remaining fully offline.
 */
export function generateCoverLetter(job: Job, resume: ParsedResume): string {
  const skills = resume.skills.slice(0, 5).join(', ');
  const company = job.company || 'your team';
  const keywords = extractJobKeywords(job.description).slice(0, 3).join(', ');
  return [
    `Dear Hiring Manager,`,
    ``,
    `I am writing to apply for the ${job.title} position at ${company}. With experience across ${skills || 'relevant technologies'}, I am confident I can contribute from day one.`,
    ``,
    `My background in ${keywords || 'the technologies you need'} aligns closely with the requirements in your job description. I bring a track record of delivering results and collaborating across teams.`,
    ``,
    `I would welcome the opportunity to discuss how my experience can support ${company}'s goals. Thank you for your consideration.`,
    ``,
    `Sincerely,`,
    resume.fullName ?? 'Candidate',
  ].join('\n');
}

export function generateInterviewQuestions(job: Job, resume: ParsedResume): string[] {
  const skills = resume.skills.slice(0, 5);
  const jdKeywords = extractJobKeywords(job.description).slice(0, 5);
  const questions = [
    `Tell me about your experience relevant to the ${job.title} role.`,
    `How have you used ${skills[0] ?? 'your core skills'} in a production environment?`,
    `Describe a challenging project where you applied ${jdKeywords[0] ?? 'your skills'} — what was the outcome?`,
    `How do you stay current with ${jdKeywords.slice(0, 3).join(', ') || 'industry trends'}?`,
    `Give an example of a time you collaborated with a cross-functional team.`,
    `How do you prioritize competing deadlines?`,
    `What would your first 30 days look like in this role at ${job.company || 'our company'}?`,
    `Why are you interested in ${job.company || 'this company'} and this position?`,
    `Describe a failure and what you learned from it.`,
    `Where do you see your career in the next 3-5 years?`,
  ];
  // Guarantee ≥ 10 questions per JD (SRS acceptance criterion).
  while (questions.length < 10) {
    questions.push(`How does your experience with ${skills[questions.length % skills.length] ?? 'technology'} add value here?`);
  }
  return questions.slice(0, 10);
}

export function careerCoaching(resume: ParsedResume): { advice: string[]; benchmark: string } {
  const years = resume.experience.reduce((acc, e) => {
    const m = /(\d{2,3})/.exec(e.years ?? '');
    return acc + (m ? Number(m[1]) : 0);
  }, 0);
  const seniority = years >= 8 ? 'Senior' : years >= 4 ? 'Mid-level' : 'Entry-level';
  return {
    advice: [
      `Target roles matching your top skills: ${resume.skills.slice(0, 4).join(', ') || 'your core stack'}.`,
      'Quantify achievements with metrics (%, $, time saved) to strengthen bullet points.',
      'Add a projects section to demonstrate applied skills.',
      'Keep each resume version focused on one target role family.',
    ],
    benchmark: `${seniority} range benchmark for your stack: $90k–$140k (US market, free-tier data).`,
  };
}
