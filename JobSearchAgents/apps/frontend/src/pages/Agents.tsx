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

export default function Agents() {
  const [agents, setAgents] = useState<AgentInfo[]>([]);
  const [runs, setRuns] = useState<RunRecord[]>([]);
  const [output, setOutput] = useState<{ agent: string; status: string; summary: string; data?: unknown } | null>(null);
  const [pipeline, setPipeline] = useState<{ successCount: number; failedCount: number } | null>(null);
  const [error, setError] = useState('');

  const load = () => {
    apiClient.listAgents().then(({ agents }) => setAgents(agents)).catch(() => undefined);
    apiClient.listRuns().then(({ runs }) => setRuns(runs)).catch(() => undefined);
  };

  useEffect(load, []);

  const run = async (name: string) => {
    setError('');
    setOutput(null);
    try {
      const res = await apiClient.runAgent(name);
      setOutput(res);
      load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const runPipeline = async () => {
    setError('');
    try {
      const res = await apiClient.runPipeline();
      setPipeline(res);
      load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <>
      <h2>Agents</h2>
      <div className="card">
        <h3>Orchestrated pipeline</h3>
        <p>
          Runs parse → build → optimize → search → match → apply → report in one pass.
        </p>
        <button className="primary" onClick={runPipeline} data-testid="run-pipeline">
          Run full pipeline
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
          {agents.map((a) => (
            <div className="card" key={a.name} style={{ marginBottom: 0 }}>
              <h4 style={{ margin: '0 0 0.25rem' }}>{a.name}</h4>
              <p style={{ color: 'var(--muted)', fontSize: '0.8rem' }}>{a.description}</p>
              <button className="secondary" onClick={() => run(a.name)}>
                Run
              </button>
            </div>
          ))}
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
