import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';

interface Application {
  id: string;
  jobTitle?: string;
  jobCompany?: string;
  jobPortal?: string;
  status: string;
  atsScore?: number;
  appliedAt: string;
}

const STATUSES = ['submitted', 'viewed', 'shortlisted', 'interview', 'offer', 'rejected', 'withdrawn'];

export default function Applications() {
  const [applications, setApplications] = useState<Application[]>([]);

  const load = () => {
    apiClient.listApplications().then(({ applications }) => setApplications(applications)).catch(() => undefined);
  };

  useEffect(load, []);

  const updateStatus = async (id: string, status: string) => {
    await apiClient.updateApplicationStatus(id, status);
    load();
  };

  return (
    <>
      <h2>Applications</h2>
      {applications.length === 0 && <p>No applications yet — search jobs and apply.</p>}
      <div className="card">
        <table>
          <thead>
            <tr>
              <th>Job</th>
              <th>Company</th>
              <th>Portal</th>
              <th>ATS</th>
              <th>Status</th>
              <th>Applied</th>
              <th>Update</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((a) => (
              <tr key={a.id} data-testid="application-row">
                <td>{a.jobTitle ?? a.id}</td>
                <td>{a.jobCompany ?? '—'}</td>
                <td>{a.jobPortal ?? '—'}</td>
                <td>{a.atsScore ?? '—'}</td>
                <td>
                  <span className={`badge ${a.status === 'offer' ? 'good' : a.status === 'rejected' ? 'bad' : 'warn'}`}>
                    {a.status}
                  </span>
                </td>
                <td>{a.appliedAt}</td>
                <td>
                  <select defaultValue="" onChange={(e) => e.target.value && updateStatus(a.id, e.target.value)}>
                    <option value="" disabled>
                      Set…
                    </option>
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
