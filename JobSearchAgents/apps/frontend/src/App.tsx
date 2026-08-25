import { Navigate, Route, Routes, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from './lib/auth';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Resumes from './pages/Resumes';
import Jobs from './pages/Jobs';
import Applications from './pages/Applications';
import Reports from './pages/Reports';
import Agents from './pages/Agents';

function Shell() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  return (
    <div className="layout">
      <aside className="sidebar">
        <h1>JobSearch Agents</h1>
        <nav>
          <NavLink to="/" end>Dashboard</NavLink>
          <NavLink to="/resumes">Resumes</NavLink>
          <NavLink to="/jobs">Jobs</NavLink>
          <NavLink to="/applications">Applications</NavLink>
          <NavLink to="/reports">Reports</NavLink>
          <NavLink to="/agents">Agents</NavLink>
        </nav>
        <div className="user-box">
          <div>{user?.name}</div>
          <div>{user?.email}</div>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Sign out
          </button>
        </div>
      </aside>
      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/resumes" element={<Resumes />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/applications" element={<Applications />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/agents" element={<Agents />} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  const { user, loading } = useAuth();
  if (loading) return <div style={{ padding: '2rem' }}>Loading…</div>;
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }
  return <Shell />;
}
