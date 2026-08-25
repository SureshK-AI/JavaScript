import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';

export default function Login() {
  const { login, register, oauth } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      if (mode === 'login') await login(email, password);
      else await register(email, password, name);
      navigate('/');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="login-page">
      <div className="card">
        <h1>JobSearch Agents</h1>
        <p>Multi-agent automated job search and application platform.</p>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
          <button
            className={mode === 'login' ? 'primary' : 'secondary'}
            onClick={() => setMode('login')}
          >
            Log in
          </button>
          <button
            className={mode === 'register' ? 'primary' : 'secondary'}
            onClick={() => setMode('register')}
          >
            Register
          </button>
        </div>
        <form onSubmit={submit}>
          {mode === 'register' && (
            <>
              <label htmlFor="name">Name</label>
              <input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                required
              />
            </>
          )}
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            minLength={8}
            required
          />
          {error && <p className="error">{error}</p>}
          <button className="primary" type="submit" style={{ width: '100%' }} data-testid="submit-auth">
            {mode === 'login' ? 'Log in' : 'Create account'}
          </button>
        </form>
        <hr style={{ margin: '1rem 0', borderColor: 'var(--border)' }} />
        <p style={{ color: 'var(--muted)', fontSize: '0.85rem' }}>Or continue with:</p>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className="secondary"
            onClick={async () => {
              await oauth('linkedin');
              navigate('/');
            }}
          >
            LinkedIn (demo)
          </button>
          <button
            className="secondary"
            onClick={async () => {
              await oauth('google');
              navigate('/');
            }}
          >
            Google (demo)
          </button>
        </div>
      </div>
    </div>
  );
}
