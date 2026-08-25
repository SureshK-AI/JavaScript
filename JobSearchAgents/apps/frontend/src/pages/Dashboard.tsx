import { useEffect, useState } from 'react';
import { apiClient } from '../lib/api';

interface Stats {
  totalResumes: number;
  totalJobs: number;
  totalApplications: number;
  avgAtsScore: number;
  interviews: number;
  offers: number;
  applicationsByStatus: Record<string, number>;
  topCompanies: string[];
}

export default function Dashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    apiClient.dashboardStats().then(({ stats }) => setStats(stats)).catch(() => undefined);
  }, []);

  if (!stats) return <p>Loading dashboard…</p>;

  return (
    <>
      <h2>Dashboard</h2>
      <div className="grid">
        <div className="stat" data-testid="stat-resumes">
          <div className="value">{stats.totalResumes}</div>
          <div className="label">Resumes</div>
        </div>
        <div className="stat" data-testid="stat-jobs">
          <div className="value">{stats.totalJobs}</div>
          <div className="label">Jobs collected</div>
        </div>
        <div className="stat" data-testid="stat-applications">
          <div className="value">{stats.totalApplications}</div>
          <div className="label">Applications</div>
        </div>
        <div className="stat" data-testid="stat-ats">
          <div className="value">{stats.avgAtsScore}</div>
          <div className="label">Avg ATS score</div>
        </div>
        <div className="stat">
          <div className="value">{stats.interviews}</div>
          <div className="label">Interviews</div>
        </div>
        <div className="stat">
          <div className="value">{stats.offers}</div>
          <div className="label">Offers</div>
        </div>
      </div>
      <div className="card">
        <h3>Applications by status</h3>
        <ul>
          {Object.entries(stats.applicationsByStatus).map(([status, count]) => (
            <li key={status}>
              {status}: {count}
            </li>
          ))}
        </ul>
      </div>
      <div className="card">
        <h3>Top companies</h3>
        <ul>
          {stats.topCompanies.map((c) => (
            <li key={c}>{c}</li>
          ))}
        </ul>
      </div>
    </>
  );
}
