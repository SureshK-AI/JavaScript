const API_BASE = import.meta.env.VITE_API_URL ?? '/api';

let authToken: string | null = localStorage.getItem('token');

export function setToken(token: string | null): void {
  authToken = token;
  if (token) localStorage.setItem('token', token);
  else localStorage.removeItem('token');
}

export function getToken(): string | null {
  return authToken;
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { error?: string };
    throw new Error(body.error ?? `Request failed: ${res.status}`);
  }
  return res.json() as Promise<T>;
}

export async function api<T = unknown>(
  path: string,
  options: { method?: string; body?: unknown; isForm?: boolean } = {},
): Promise<T> {
  const headers: Record<string, string> = {};
  if (!options.isForm && options.body !== undefined) {
    headers['Content-Type'] = 'application/json';
  }
  if (authToken) headers['Authorization'] = `Bearer ${authToken}`;
  const res = await fetch(`${API_BASE}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: options.isForm ? (options.body as FormData) : options.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
  return handle<T>(res);
}

export const apiClient = {
  register: (email: string, password: string, name: string) =>
    api<{ user: { id: string; email: string; name: string }; token: string }>('/auth/register', {
      method: 'POST',
      body: { email, password, name },
    }),
  login: (email: string, password: string) =>
    api<{ user: { id: string; email: string; name: string }; token: string }>('/auth/login', {
      method: 'POST',
      body: { email, password },
    }),
  oauth: (provider: string) =>
    api<{ user: { id: string; email: string; name: string }; token: string; provider: string }>(`/auth/oauth/${provider}`),
  me: () => api<{ user: { id: string; email: string; name: string } }>('/auth/me'),
  uploadResume: (file: File) => {
    const form = new FormData();
    form.append('file', file);
    return api<{ resume: { id: string }; parsed: { skills: string[]; email?: string }; parseTimeMs: number }>(
      '/resumes',
      { method: 'POST', body: form, isForm: true },
    );
  },
  listResumes: () => api<{ resumes: Array<{ id: string; filename: string; createdAt: string }> }>('/resumes'),
  searchJobs: (query: string, location = '', portal = '') =>
    api<{ jobs: Array<Record<string, unknown>> }>('/jobs/search', {
      method: 'POST',
      body: { query, location, portal: portal || undefined, demo: true },
    }),
  listJobs: () => api<{ jobs: Array<{ id: string; title: string; company: string; location: string; portal: string; salary?: string }> }>('/jobs'),
  matchJob: (jobId: string, resumeId: string) =>
    api<{ match: { score: number; matchedSkills: string[]; missingSkills: string[] } }>(`/jobs/${jobId}/match`, {
      method: 'POST',
      body: { resumeId },
    }),
  apply: (jobId: string, resumeId: string) =>
    api<{ status: string; data?: { applicationId: string; atsScore: number; coverLetter: string } }>(
      `/jobs/${jobId}/apply`,
      { method: 'POST', body: { resumeId } },
    ),
  listApplications: () =>
    api<{ applications: Array<{ id: string; jobTitle?: string; jobCompany?: string; status: string; appliedAt: string; atsScore?: number }> }>('/applications'),
  updateApplicationStatus: (id: string, status: string) =>
    api(`/applications/${id}/status`, { method: 'PATCH', body: { status } }),
  dailyReport: (channel = 'email') =>
    api<{ report: { id: string }; summary: { totalApplications: number; byStatus: Record<string, number> } }>('/reports/daily', {
      method: 'POST',
      body: { channel },
    }),
  listReports: () => api<{ reports: Array<{ id: string; period: string; channel: string }> }>('/reports'),
  runAgent: (name: string, body: Record<string, unknown> = {}) =>
    api<{ agent: string; status: string; summary: string; data?: unknown }>(`/agents/${name}/run`, { method: 'POST', body }),
  runPipeline: (body: Record<string, unknown> = {}) =>
    api<{ results: Array<{ agent: string; status: string; summary: string }>; successCount: number; failedCount: number }>('/agents/pipeline', {
      method: 'POST',
      body,
    }),
  listAgents: () => api<{ agents: Array<{ name: string; description: string }> }>('/agents'),
  listRuns: () => api<{ runs: Array<{ id: string; agent: string; status: string; summary: string; createdAt: string }> }>('/agents/runs'),
  dashboardStats: () =>
    api<{ stats: { totalResumes: number; totalJobs: number; totalApplications: number; avgAtsScore: number; interviews: number; offers: number; applicationsByStatus: Record<string, number>; topCompanies: string[] } }>('/dashboard/stats'),
};
