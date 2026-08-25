import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';

interface AgentInfo {
  name: string;
  description: string;
}

interface RunRecord {
  id: string;
  agent: string;
  status: string;
  summary: string;
  createdAt: string;
}

interface AgentRunResult {
  agent: string;
  status: string;
  summary: string;
  data?: unknown;
}

/** Which context inputs does each agent need? */
const AGENT_CONTEXT: Record<string, { needs: string[]; placeholder?: string }> = {
  'resume-parser': { needs: ['resumeId'] },
  'resume-builder': { needs: ['resumeId', 'jobId'] },
  'resume-optimizer': { needs: ['resumeId', 'jobId'] },
  'job-search': { needs: ['query', 'location'] },
  'job-matching': { needs: ['resumeId', 'jobId'] },
  application: { needs: ['resumeId', 'jobId'] },
  reporting: { needs: ['channel'] },
  feedback: { needs: ['email'], placeholder: 'Paste a recruiter email here, e.g. "Application #abc123: we would like to schedule an interview…"' },
  'cover-letter': { needs: ['resumeId', 'jobId'] },
  'interview-prep': { needs: ['resumeId', 'jobId'] },
  'skill-gap': { needs: ['resumeId', 'jobId'] },
  'multi-resume': { needs: ['resumeId', 'jobId'] },
  'job-tracker': { needs: ['status', 'applicationId'] },
  'career-coach': { needs: ['resumeId'] },
  'fraud-detection': { needs: ['jobId'] },
};

const STATUS_OPTIONS = ['submitted', 'viewed', 'shortlisted', 'interview', 'offer', 'rejected', 'withdrawn'];

interface ContextState {
  resumeId: string;
  jobId: string;
  query: string;
  location: string;
  channel: 'email' | 'sms';
  email: string;
  status: string;
  applicationId: string;
}

const EMPTY_CONTEXT: ContextState = {
  resumeId: '',
  jobId: '',
  query: 'software engineer',
  location: '',
  channel: 'email',
  email: '',
  status: 'interview',
  applicationId: '',
};

export default function Agents() {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [resumes, setResumes] = useState<Array<{ id: string; filename: string }>>([]);
  const [jobs, setJobs] = useState<Array<{ id: string; title: string; company: string }>>([]);
  const [applications, setApplications] = useState<Array<{ id: string; jobTitle?: string; status: string }>>([]);
  const [ctx, setCtx] = useState<ContextState>(EMPTY_CONTEXT);
  const [output, setOutput] = useState<AgentRunResult | null>(null);
  const [pipeline, setPipeline] = useState<{ successCount: number; failedCount: number } | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState('');

  const load = () => {
    apiClient.listAgents().then(({ agents }) => setAgents(agents)).catch(() => undefined);
    apiClient.listRuns().then(({ runs }) => setRuns(runs)).catch(() => undefined);
    apiClient.listResumes().then(({ resumes }) => setResumes(resumes)).catch(() => undefined);
    apiClient.listJobs().then(({ jobs }) => setJobs(jobs.map((j) => ({ id: String(j.id), title: String(j.title), company: String(j.company) })))).catch(() => undefined);
    apiClient.listApplications().then(({ applications }) => setApplications(applications)).catch(() => undefined);
  };

  useEffect(load, []);

  const run = async (name: string, extra: Record<string, unknown> = {}) => {
    setError('');
    setOutput(null);
    setBusy(name);
    try {
      const body: Record<string, unknown> = { ...extra };
      if (ctx.resumeId) body.resumeId = ctx.resumeId;
      if (ctx.jobId) body.jobId = ctx.jobId;
      if (ctx.query) body.query = ctx.query;
      if (ctx.location) body.location = ctx.location;
      if (ctx.channel) body.channel = ctx.channel;
      if (ctx.email) body.email = ctx.email;
      if (ctx.status) body.status = ctx.status;
      if (ctx.applicationId) body.applicationId = ctx.applicationId;
      const res = await apiClient.runAgent(name, body);
      setOutput(res);
      load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const runPipeline = async () => {
    setError('');
    setBusy('pipeline');
    try {
      const res = await apiClient.runPipeline({
        resumeId: ctx.resumeId || undefined,
        jobId: ctx.jobId || undefined,
        query: ctx.query || undefined,
        location: ctx.location || undefined,
      });
      setPipeline(res);
      load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const set = (k: keyof ContextState, v: string) => setCtx((c) => ({ ...c, [k]: v }));

  const pick = (needs: string[], key: 'resumeId' | 'jobId' | 'applicationId'): boolean => needs.includes(key);
  const show = (need: string): boolean => Object.values(AGENT_CONTEXT).some((c) => c.needs.includes(need));

  return (
    <>
      <h2>Agents</h2>

      <div className="card">
        <h3>Context</h3>
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
          Pick a resume / job / application and query — every agent below uses these. Agents that need them will error otherwise.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label htmlFor="ctx-resume">Resume</label>
            <select id="ctx-resume" value={ctx.resumeId} onChange={(e) => set('resumeId', e.target.value)}>
              <option value="">— none —</option>
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.filename}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ctx-job">Job</label>
            <select id="ctx-job" value={ctx.jobId} onChange={(e) => set('jobId', e.target.value)}>
              <option value="">— none —</option>
              {jobs.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.title} @ {j.company}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ctx-query">Search query</label>
            <input id="ctx-query" value={ctx.query} onChange={(e) => set('query', e.target.value)} />
          </div>
          <div>
            <label htmlFor="ctx-location">Location</label>
            <input id="ctx-location" value={ctx.location} onChange={(e) => set('location', e.target.value)} placeholder="Remote" />
          </div>
          <div>
            <label htmlFor="ctx-channel">Report channel</label>
            <select id="ctx-channel" value={ctx.channel} onChange={(e) => set('channel', e.target.value)}>
              <option value="email">email</option>
              <option value="sms">sms</option>
            </select>
          </div>
          <div>
            <label htmlFor="ctx-app">Application (job tracker)</label>
            <select id="ctx-app" value={ctx.applicationId} onChange={(e) => set('applicationId', e.target.value)}>
              <option value="">— none —</option>
              {applications.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.jobTitle ?? a.id} · {a.status}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="ctx-status">Status (job tracker)</label>
            <select id="ctx-status" value={ctx.status} onChange={(e) => set('status', e.target.value)}>
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div style={{ gridColumn: '1 / -1' }}>
            <label htmlFor="ctx-email">Recruiter email (feedback agent)</label>
            <textarea
              id="ctx-email"
              rows={3}
              value={ctx.email}
              onChange={(e) => set('email', e.target.value)}
              placeholder={AGENT_CONTEXT['feedback']?.placeholder}
            />
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Orchestrated pipeline</h3>
        <p>Runs parse → build → optimize → search → match → apply → report in one pass using the context above.</p>
        <button className="primary" onClick={runPipeline} disabled={busy !== null} data-testid="run-pipeline">
          {busy === 'pipeline' ? 'Running…' : 'Run full pipeline'}
        </button>
        {pipeline && (
          <p data-testid="pipeline-result">
            {pipeline.successCount} agents succeeded, {pipeline.failedCount} failed.
          </p>
        )}
      </div>

      <div className="card">
        <h3>All agents ({agents.length})</h3>
        <div className="grid">
          {agents.map((a) => {
            const needs = AGENT_CONTEXT[a.name]?.needs ?? [];
            const disabled = busy !== null;
            const missing = needs
              .filter((n) => n !== 'channel' && n !== 'query' && n !== 'status' && n !== 'email' && n !== 'location' && n !== 'applicationId')
              .filter((n) => (n === 'resumeId' ? !ctx.resumeId : n === 'jobId' ? !ctx.jobId : false));
            return (
              <div className="card" key={a.name} style={{ marginBottom: 0 }}>
                <h4 style={{ margin: '0 0 0.25rem' }}>{a.name}</h4>
                <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{a.description}</p>
                <p style={{ fontSize: '0.75rem', color: 'var(--muted)' }}>
                  needs: {needs.length ? needs.join(', ') : 'no context'}
                </p>
                <button
                  className="secondary"
                  disabled={disabled}
                  onClick={() => run(a.name)}
                  data-testid={`run-${a.name}`}
                >
                  {busy === a.name ? 'Running…' : 'Run'}
                </button>
                {missing.length > 0 && (
                  <p style={{ fontSize: '0.72rem', color: 'var(--warn)' }}>missing: {missing.join(', ')}</p>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {output && (
        <div className="card" data-testid="agent-output">
          <p>
            <span className={`badge ${output.status === 'success' ? 'good' : 'bad'}`}>{output.status}</span>{' '}
            <strong>{output.agent}</strong>: {output.summary}
          </p>
          {output.data !== undefined && (
            <pre style={{ fontSize: '0.8rem', overflow: 'auto' }}>{JSON.stringify(output.data, null, 2)}</pre>
          )}
        </div>
      )}

      {error && <p className="error">{error}</p>}

      <div className="card">
        <h3>Recent runs</h3>
        <table>
          <thead>
            <tr>
              <th>Agent</th>
              <th>Status</th>
              <th>Summary</th>
              <th>When</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((r) => (
              <tr key={r.id}>
                <td>{r.agent}</td>
                <td>{r.status}</td>
                <td>{r.summary}</td>
                <td>{r.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
