import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';

interface Job {
  id: string;
  portal: string;
  title: string;
  company: string;
  location: string;
  salary?: string;
  description?: string;
  fraudFlags?: string[];
  fraudScore?: number;
}

export default function Jobs() {
  const [query, setQuery] = useState('software engineer');
  const [location, setLocation] = useState('');
  const [portal, setPortal] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [resumes, setResumes] = useState<Array<{ id: string; filename: string }>>([]);
  const [selectedResume, setSelectedResume] = useState('');
  const [searching, setSearching] = useState(false);
  const [matchResult, setMatchResult] = useState<Record<string, unknown> | null>(null);
  const [applyResult, setApplyResult] = useState<{ jobId: string; message: string; status: string } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    apiClient.listResumes().then(({ resumes }) => {
      setResumes(resumes);
      if (resumes[0]) setSelectedResume(resumes[0].id);
    }).catch(() => undefined);
  }, []);

  const search = async () => {
    setSearching(true);
    setError('');
    setJobs([]);
    try {
      const { jobs } = await apiClient.searchJobs(query, location, portal);
      setJobs(jobs as unknown as Job[]);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSearching(false);
    }
  };

  const match = async (jobId: string) => {
    if (!selectedResume) return;
    setError('');
    try {
      const { match } = await apiClient.matchJob(jobId, selectedResume);
      setMatchResult({ jobId, ...match });
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const apply = async (jobId: string) => {
    if (!selectedResume) return;
    setError('');
    try {
      const res = await apiClient.apply(jobId, selectedResume);
      setApplyResult({ jobId, message: res.status, status: res.status });
    } catch (err) {
      setApplyResult({ jobId, message: (err as Error).message, status: 'error' });
    }
  };

  return (
    <>
      <h2>Job Search</h2>
      <div className="card">
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '0.5rem' }}>
          <div>
            <label htmlFor="query">Query</label>
            <input id="query" value={query} onChange={(e) => setQuery(e.target.value)} />
          </div>
          <div>
            <label htmlFor="location">Location</label>
            <input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="Remote" />
          </div>
          <div>
            <label htmlFor="portal">Portal</label>
            <select id="portal" value={portal} onChange={(e) => setPortal(e.target.value)}>
              <option value="">All portals</option>
              <option value="naukri">Naukri</option>
              <option value="linkedin">LinkedIn</option>
              <option value="indeed">Indeed</option>
              <option value="glassdoor">Glassdoor</option>
            </select>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'end' }}>
          <div style={{ flex: 1 }}>
            <label htmlFor="resume-select">Resume</label>
            <select id="resume-select" value={selectedResume} onChange={(e) => setSelectedResume(e.target.value)}>
              {resumes.length === 0 && <option value="">Upload a resume first</option>}
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.filename}
                </option>
              ))}
            </select>
          </div>
          <button className="primary" onClick={search} disabled={searching}>
            {searching ? 'Searching…' : 'Search jobs'}
          </button>
        </div>
        {error && <p className="error">{error}</p>}
      </div>

      {matchResult && (
        <div className="card" data-testid="match-result">
          <h3>
            Match score:{' '}
            <span className="badge good">{(matchResult.score as number).toFixed(2)}</span>
          </h3>
          <p>
            Matched skills: {(matchResult.matchedSkills as string[]).join(', ') || '—'} · Missing:{' '}
            {(matchResult.missingSkills as string[]).join(', ') || '—'}
          </p>
        </div>
      )}

      {applyResult && (
        <div className="card" data-testid="apply-result">
          <p>
            Application for job <strong>{applyResult.jobId}</strong>: {applyResult.message}
          </p>
        </div>
      )}

      {jobs.length === 0 && !searching && <p>Search to collect jobs from the portals.</p>}
      <div className="grid">
        {jobs.map((j) => (
          <div className="card" key={j.id} data-testid="job-card">
            <h3>{j.title}</h3>
            <p style={{ color: 'var(--muted)' }}>
              {j.company} · {j.location} · <span className="badge warn">{j.portal}</span>
            </p>
            {j.salary && <p>{j.salary}</p>}
            {j.fraudScore !== undefined && j.fraudScore > 0 && (
              <p>
                <span className="badge bad">fraud score {j.fraudScore}</span>{' '}
                {(j.fraudFlags ?? []).join(', ')}
              </p>
            )}
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button className="secondary" onClick={() => match(j.id)}>
                Match
              </button>
              <button className="secondary" onClick={() => apply(j.id)}>
                Apply
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
