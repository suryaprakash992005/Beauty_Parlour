import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin.css';

export default function AdminLogin() {
  const { login, session } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  // Auto-redirect if user is already authenticated
  useEffect(() => {
    if (session) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [session, navigate]);

  const handle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading || success) return;

    if (!email.trim()) {
      setError('Please enter your administrator email.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setLoading(true);
    setError('');

    const { error: loginError } = await login(email.trim(), password);

    if (loginError) {
      setLoading(false);
      const msg = loginError.message.toLowerCase();
      if (msg.includes('invalid login credentials') || msg.includes('invalid credentials')) {
        setError('Invalid credentials. Please check your email and password.');
      } else if (msg.includes('network') || msg.includes('fetch')) {
        setError('Network connection error. Please verify your connection.');
      } else {
        setError(loginError.message || 'Login failed. Please check your credentials.');
      }
    } else {
      setSuccess(true);
      localStorage.setItem('zha_admin', 'true');
      setTimeout(() => {
        navigate('/admin/dashboard', { replace: true });
      }, 700);
    }
  };

  return (
    <div className="admin-login">
      {/* Left Panel: Luxury Salon Branding & Illustration */}
      <div className="admin-login__left">
        <div className="admin-login__left-header">
          <div className="admin-login__logo-icon">Z</div>
          <span className="admin-login__logo-text">Zha Aesthetic Salon</span>
          <span className="admin-login__logo-badge">ADMIN CONSOLE</span>
        </div>

        <div className="admin-login__hero">
          <h1 className="admin-login__hero-title">
            Sign in to the secure administration console.
          </h1>
          <ul className="admin-login__hero-list">
            <li className="admin-login__hero-item">
              <div className="admin-login__hero-dot" />
              <span>Real-time content management & layout editor</span>
            </li>
            <li className="admin-login__hero-item">
              <div className="admin-login__hero-dot" />
              <span>Direct media upload pipelines (Base64 file rendering)</span>
            </li>
            <li className="admin-login__hero-item">
              <div className="admin-login__hero-dot" />
              <span>Luxury styling portfolio & custom lookbook catalog</span>
            </li>
            <li className="admin-login__hero-item">
              <div className="admin-login__hero-dot" />
              <span>Grouped website metadata & SEO controls</span>
            </li>
          </ul>
        </div>

        <div className="admin-login__left-footer">
          <span>© 2026 Zha Aesthetic Salon</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--admin-accent)' }} />
            <span style={{ color: 'var(--admin-text-secondary)' }}>All systems operational</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Glassmorphic Login Form Card */}
      <div className="admin-login__right">
        <div className="admin-login__card">
          <div className="admin-login__badge">
            <Lock size={12} style={{ color: 'var(--admin-accent)' }} />
            <span>Restricted Access</span>
          </div>

          <h2 className="admin-login__title">Sign in</h2>
          <p className="admin-login__desc">Use your administrator credentials to continue.</p>

          {error && <div className="admin-error">{error}</div>}

          <form onSubmit={handle} className="admin-login__form">
            <div className="form-group">
              <label className="form-label" htmlFor="admin-email">Administrator Email</label>
              <input
                id="admin-email"
                className="form-input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@zhaaestheticsalon.in"
                disabled={loading || success}
                required
              />
            </div>
            
            <div className="form-group">
              <div className="form-label-row">
                <label className="form-label" htmlFor="admin-password">Password</label>
                <Link to="/forgot-password" className="admin-login__forgot">
                  Forgot password?
                </Link>
              </div>
              <input
                id="admin-password"
                className="form-input"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={loading || success}
                required
              />
            </div>

            <div className="admin-login__options">
              <label className="admin-login__remember">
                <input 
                  type="checkbox" 
                  checked={rememberMe} 
                  onChange={e => setRememberMe(e.target.checked)} 
                />
                <span>Remember me on this device</span>
              </label>
            </div>

            <button 
              id="admin-submit" 
              className="btn btn-primary admin-login__submit" 
              type="submit" 
              disabled={loading || success}
              style={{
                background: success ? '#22C55E' : 'var(--admin-accent-gradient)',
                color: '#000'
              }}
            >
              {success ? (
                <>
                  <ShieldCheck size={16} /> Welcome back
                </>
              ) : loading ? (
                <>
                  <span className="book-loader" style={{ borderColor: '#000', borderTopColor: 'transparent', width: '14px', height: '14px' }} /> Verifying...
                </>
              ) : (
                <>
                  Sign In <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--admin-border)', fontSize: '12px', color: 'var(--admin-text-muted)', display: 'flex', justifyContent: 'space-between' }}>
            <span>TLS 1.3 Encryption</span>
            <span>Console v2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
