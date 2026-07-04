import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin.css';

export default function AdminLogin() {
  const [creds, setCreds] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handle = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setTimeout(() => {
      if (creds.username === 'admin' && creds.password === 'zhahair2026') {
        localStorage.setItem('zha_admin', 'true');
        navigate('/admin/dashboard');
      } else {
        setError('Invalid credentials. Use admin / zhahair2026');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <div className="admin-login__logo">
          <span className="admin-login__logo-name">ZHA</span>
          <span className="admin-login__logo-sub">Admin Panel</span>
        </div>
        <h1 className="admin-login__title">Welcome Back</h1>
        <p className="admin-login__desc">Sign in to manage your salon</p>

        {error && <div className="admin-error">{error}</div>}

        <form onSubmit={handle} className="admin-login__form">
          <div className="form-group">
            <label className="form-label" htmlFor="admin-username">Username</label>
            <input
              id="admin-username"
              className="form-input"
              type="text"
              value={creds.username}
              onChange={e => setCreds(p => ({ ...p, username: e.target.value }))}
              placeholder="admin"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="admin-password">Password</label>
            <input
              id="admin-password"
              className="form-input"
              type="password"
              value={creds.password}
              onChange={e => setCreds(p => ({ ...p, password: e.target.value }))}
              placeholder="••••••••"
              required
            />
          </div>
          <button id="admin-submit" className="btn btn-primary admin-login__submit" type="submit" disabled={loading}>
            {loading ? <><span className="book-loader" /> Signing in...</> : 'Sign In'}
          </button>
        </form>
        <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', marginTop: 'var(--space-md)', textAlign: 'center' }}>
          Demo: admin / zhahair2026
        </p>
      </div>
    </div>
  );
}
