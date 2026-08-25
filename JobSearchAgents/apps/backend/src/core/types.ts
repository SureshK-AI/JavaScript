/** Shared domain types for the multi-agent job search platform. */

export type PortalName = 'naukri' | 'linkedin' | 'indeed' | 'glassdoor';

export type ApplicationStatus =
  | 'submitted'
  | 'viewed'
  | 'shortlisted'
  | 'interview'
  | 'offer'
  | 'rejected'
  | 'withdrawn';

export type AgentName =
  | 'resume-parser'
  | 'resume-builder'
  | 'resume-optimizer'
  | 'job-search'
  | 'job-matching'
  | 'application'
  | 'reporting'
  | 'feedback'
  | 'cover-letter'
  | 'interview-prep'
  | 'skill-gap'
  | 'multi-resume'
  | 'job-tracker'
  | 'career-coach'
  | 'fraud-detection';

export interface ParsedResume {
  fullName?: string;
  email?: string;
  phone?: string;
  location?: string;
  summary?: string;
  skills: string[];
  education: EducationEntry[];
  experience: ExperienceEntry[];
  certifications: string[];
  languages: string[];
  rawText: string;
  parsedAt: string;
}

export interface EducationEntry {
  degree?: string;
  institution?: string;
  year?: string;
}

export interface ExperienceEntry {
  title?: string;
  company?: string;
  years?: string;
  bullets: string[];
}

export interface Job {
  id?: string;
  portal: PortalName;
  title: string;
  company: string;
  location: string;
  description: string;
  url?: string;
  salary?: string;
  postedAt?: string;
  skills?: string[];
  searchQuery?: string;
  fraudFlags?: string[];
  fraudScore?: number;
  collectedAt?: string;
}

export interface MatchResult {
  jobId: string;
  resumeId: string;
  score: number; // 0..1 cosine-style similarity
  matchedSkills: string[];
  missingSkills: string[];
  explanation: string;
}

export interface AtsReport {
  score: number; // 0..100
  missingKeywords: string[];
  presentKeywords: string[];
  suggestions: string[];
  atsCompliant: boolean;
}

export interface SkillGapReport {
  matchedSkills: string[];
  missingSkills: string[];
  coverage: number; // 0..1
  suggestions: string[];
}

export interface FraudReport {
  score: number; // 0..1
  flags: string[];
  verdict: 'legitimate' | 'suspicious' | 'fraudulent';
}

export interface ReportSummary {
  period: string;
  totalApplications: number;
  byStatus: Record<string, number>;
  topCompanies: string[];
  generatedAt: string;
}

export interface DashboardStats {
  totalResumes: number;
  totalJobs: number;
  totalApplications: number;
  avgAtsScore: number;
  interviews: number;
  offers: number;
  applicationsByStatus: Record<string, number>;
  topCompanies: string[];
}

export interface AgentRunResult {
  agent: AgentName;
  status: 'success' | 'skipped' | 'error';
  summary: string;
  data?: unknown;
  error?: string;
}

export interface Credentials {
  username: string;
  password: string;
  portal?: PortalName;
}
