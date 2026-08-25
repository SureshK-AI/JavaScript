import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';

interface Resume {
  id: string;
  filename: string;
  version: string;
  createdAt: string;
  parsedData?: {
    fullName?: string;
    email?: string;
    skills: string[];
    experience: { title?: string; company?: string }[];
    education: { degree?: string }[];
  };
}

export default function Resumes() {
  const [resumes, setResumes] = useState<Resume[]>([]);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [jobOptions, setJobOptions] = useState<Array<{ id: string; title: string }>>([]);

  const load = () => {
    apiClient.listResumes().then(({ resumes }) => setResumes(resumes as unknown as Resume[])).catch((e) => setError(e.message));
    apiClient
      .listJobs()
      .then(({ jobs }) => setJobOptions(jobs.map((j) => ({ id: String(j.id), title: String(j.title) }))))
      .catch(() => undefined);
  };

  useEffect(load, []);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError('');
    setMessage('');
    try {
      const res = await apiClient.uploadResume(file);
      setMessage(
        `Parsed in ${res.parseTimeMs}ms — ${res.parsed.skills.length} skills${res.parsed.email ? `, email ${res.parsed.email}` : ''}.`,
      );
      load();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  };

  const tailor = async (resumeId: string) => {
    if (!selectedJobId) return;
    setError('');
    try {
      const res = await apiClient.runAgent('resume-builder', { resumeId, jobId: selectedJobId });
      setMessage(`Tailored: ${res.summary}`);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const optimize = async (resumeId: string) => {
    if (!selectedJobId) return;
    setError('');
    try {
      const res = await apiClient.runAgent('resume-optimizer', { resumeId, jobId: selectedJobId });
      const data = res.data as { report?: { score: number; suggestions: string[] } } | undefined;
      setMessage(`ATS score: ${data?.report?.score ?? '?'}. ${data?.report?.suggestions?.[0] ?? ''}`);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <>
      <h2>Resumes</h2>
      <div className="card">
        <h3>Upload a resume (PDF, DOCX, or TXT)</h3>
        <input type="file" accept=".pdf,.docx,.txt" onChange={upload} disabled={uploading} data-testid="resume-upload" />
        {message && <p style={{ color: 'var(--good)' }} data-testid="upload-message">{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>

      <div className="card">
        <h3>Tailor / optimize against a job</h3>
        <label htmlFor="job-select">Job</label>
        <select id="job-select" value={selectedJobId} onChange={(e) => setSelectedJobId(e.target.value)}>
          <option value="">Select a job…</option>
          {jobOptions.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title}
            </option>
          ))}
        </select>
      </div>

      {resumes.length === 0 && <p>No resumes yet — upload one above.</p>}
      {resumes.map((r) => (
        <div className="card" key={r.id} data-testid="resume-card">
          <h3>
            {r.filename} <span className="badge warn">{r.version}</span>
          </h3>
          <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>
            Uploaded {r.createdAt} · {r.parsedData?.fullName ?? 'No parsed name'} ·{' '}
            {r.parsedData?.skills.length ?? 0} skills
          </p>
          {r.parsedData && (
            <div>
              <p>
                <strong>Skills:</strong> {r.parsedData.skills.join(', ')}
              </p>
              <p>
                <strong>Experience:</strong>{' '}
                {r.parsedData.experience.map((e) => e.title ?? e.company).filter(Boolean).join('; ') || '—'}
              </p>
              <p>
                <strong>Education:</strong>{' '}
                {r.parsedData.education.map((e) => e.degree).filter(Boolean).join('; ') || '—'}
              </p>
            </div>
          )}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="secondary" disabled={!selectedJobId} onClick={() => tailor(r.id)}>
              Tailor for job
            </button>
            <button className="secondary" disabled={!selectedJobId} onClick={() => optimize(r.id)}>
              ATS-optimize
            </button>
          </div>
        </div>
      ))}
    </>
  );
}
