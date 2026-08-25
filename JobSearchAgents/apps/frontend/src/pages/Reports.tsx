import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';

interface ReportRecord {
  id: string;
  period: string;
  channel: string;
}

export default function Reports() {
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [summary, setSummary] = useState<{ totalApplications: number; byStatus: Record<string, number> } | null>(null);
  const [channel, setChannel] = useState<'email' | 'sms'>('email');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const load = () => {
    apiClient.listReports().then(({ reports }) => setReports(reports)).catch(() => undefined);
  };

  useEffect(load, []);

  const generate = async () => {
    setError('');
    setMessage('');
    try {
      const res = await apiClient.dailyReport(channel);
      setSummary(res.summary);
      setMessage(`Report delivered via ${channel}.`);
      load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <>
      <h2>Daily Reports</h2>
      <div className="card">
        <label htmlFor="channel">Delivery channel</label>
        <select id="channel" value={channel} onChange={(e) => setChannel(e.target.value as 'email' | 'sms')}>
          <option value="email">Email</option>
          <option value="sms">SMS</option>
        </select>
        <button className="primary" onClick={generate} data-testid="generate-report">
          Generate daily report
        </button>
        {message && <p style={{ color: 'var(--good)' }}>{message}</p>}
        {error && <p className="error">{error}</p>}
      </div>

      {summary && (
        <div className="card" data-testid="report-summary">
          <h3>Today's summary</h3>
          <p>
            <strong>{summary.totalApplications}</strong> applications
          </p>
          <ul>
            {Object.entries(summary.byStatus).map(([status, count]) => (
              <li key={status}>
                {status}: {count}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="card">
        <h3>Report history</h3>
        {reports.length === 0 && <p>No reports generated yet.</p>}
        <table>
          <thead>
            <tr>
              <th>Period</th>
              <th>Channel</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r) => (
              <tr key={r.id}>
                <td>{r.period}</td>
                <td>{r.channel}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
