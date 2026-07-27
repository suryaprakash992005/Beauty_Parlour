import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin.css';

export default function ResetPassword() {
  const { updatePassword } = useAuth();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      setError('Please enter a new password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    setLoading(true);
    setError('');

    const { error: err } = await updatePassword(password);
    setLoading(false);

    if (err) {
      setError(err.message || 'Failed to update password. Session may have expired.');
    } else {
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin-login', { replace: true });
      }, 2000);
    }
  };

  return (
    <div className="admin-login">
      {/* Left Panel */}
      <div className="admin-login__left">
        <div className="admin-login__left-header">
          <div className="admin-login__logo-icon">Z</div>
          <span className="admin-login__logo-text">Zha Aesthetic Salon</span>
          <span className="admin-login__logo-badge">SECURITY</span>
        </div>

        <div className="admin-login__hero">
          <h1 className="admin-login__hero-title">
            Set your new administrator account password.
          </h1>
          <ul className="admin-login__hero-list">
            <li className="admin-login__hero-item">
              <div className="admin-login__hero-dot" />
              <span>Password minimum length & strength validation</span>
            </li>
            <li className="admin-login__hero-item">
              <div className="admin-login__hero-dot" />
              <span>Instant cryptographic update via Supabase Auth</span>
            </li>
            <li className="admin-login__hero-item">
              <div className="admin-login__hero-dot" />
              <span>Automatic session authorization & login redirect</span>
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

      {/* Right Panel */}
      <div className="admin-login__right">
        <div className="admin-login__card">
          <div className="admin-login__badge">
            <Lock size={12} style={{ color: 'var(--admin-accent)' }} />
            <span>Reset Password</span>
          </div>

          <h2 className="admin-login__title">New Password</h2>
          <p className="admin-login__desc">Enter and confirm your new password below.</p>

          {error && <div className="admin-error">{error}</div>}

          {success ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', color: '#22C55E', marginBottom: '16px' }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Password Updated!</h3>
              <p style={{ color: 'var(--admin-text-secondary)', fontSize: '14px', lineHeight: '1.6' }}>
                Your password has been successfully reset. Redirecting you to the sign-in screen...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="admin-login__form">
              <div className="form-group">
                <label className="form-label" htmlFor="new-password">New Password</label>
                <input
                  id="new-password"
                  className="form-input"
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="confirm-password">Confirm New Password</label>
                <input
                  id="confirm-password"
                  className="form-input"
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={loading}
                  required
                />
              </div>

              <button 
                id="update-submit" 
                className="btn btn-primary admin-login__submit" 
                type="submit" 
                disabled={loading}
                style={{
                  background: 'var(--admin-accent-gradient)',
                  color: '#000'
                }}
              >
                {loading ? (
                  <>
                    <span className="book-loader" style={{ borderColor: '#000', borderTopColor: 'transparent', width: '14px', height: '14px' }} /> Updating...
                  </>
                ) : (
                  <>
                    Update Password <ArrowRight size={14} />
                  </>
                )}
              </button>
            </form>
          )}

          <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--admin-border)', fontSize: '12px', color: 'var(--admin-text-muted)', display: 'flex', justifyContent: 'space-between' }}>
            <span>TLS 1.3 Encryption</span>
            <span>Console v2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
}
