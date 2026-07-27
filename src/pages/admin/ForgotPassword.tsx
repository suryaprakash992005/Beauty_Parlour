import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { KeyRound, ArrowRight, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/admin.css';

export default function ForgotPassword() {
  const { resetPassword } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    
    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }

    setLoading(true);
    setError('');

    const { error: err } = await resetPassword(email.trim());
    setLoading(false);

    if (err) {
      if (err.message.includes('rate limit')) {
        setError('Too many requests. Please wait a few minutes before trying again.');
      } else {
        setError(err.message || 'Failed to send password reset email. Please try again.');
      }
    } else {
      setSuccess(true);
    }
  };

  return (
    <div className="admin-login">
      {/* Left Panel: Luxury Salon Branding & Illustration */}
      <div className="admin-login__left">
        <div className="admin-login__left-header">
          <div className="admin-login__logo-icon">Z</div>
          <span className="admin-login__logo-text">Zha Aesthetic Salon</span>
          <span className="admin-login__logo-badge">RECOVERY</span>
        </div>

        <div className="admin-login__hero">
          <h1 className="admin-login__hero-title">
            Administrator account password recovery.
          </h1>
          <ul className="admin-login__hero-list">
            <li className="admin-login__hero-item">
              <div className="admin-login__hero-dot" />
              <span>Secure password reset link via Supabase Auth</span>
            </li>
            <li className="admin-login__hero-item">
              <div className="admin-login__hero-dot" />
              <span>Encrypted token authentication URL</span>
            </li>
            <li className="admin-login__hero-item">
              <div className="admin-login__hero-dot" />
              <span>Instant admin console credential update</span>
            </li>
          </ul>
        </div>

        <div className="admin-login__left-footer">
          <span>© 2026 Zha Aesthetic Salon</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--admin-accent)' }} />
            <span style={{ color: 'var(--admin-text-secondary)' }}>TLS 1.3 Security</span>
          </div>
        </div>
      </div>

      {/* Right Panel: Glassmorphic Password Reset Form */}
      <div className="admin-login__right">
        <div className="admin-login__card">
          <div className="admin-login__badge">
            <KeyRound size={12} style={{ color: 'var(--admin-accent)' }} />
            <span>Password Recovery</span>
          </div>

          <h2 className="admin-login__title">Forgot Password</h2>
          <p className="admin-login__desc">
            Enter your admin email address and we will send you a password reset link.
          </p>

          {error && <div className="admin-error">{error}</div>}

          {success ? (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ display: 'inline-flex', padding: '16px', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', color: '#22C55E', marginBottom: '16px' }}>
                <CheckCircle2 size={36} />
              </div>
              <h3 style={{ color: '#FFFFFF', fontSize: '18px', fontWeight: 600, marginBottom: '8px' }}>Reset Link Sent!</h3>
              <p style={{ color: 'var(--admin-text-secondary)', fontSize: '14px', lineHeight: '1.6', marginBottom: '24px' }}>
                We have dispatched a password reset link to <strong>{email}</strong>. Please check your inbox and click the link to update your password.
              </p>
              <Link 
                to="/admin-login" 
                className="btn btn-outline" 
                style={{ width: '100%', justifyContent: 'center', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <ArrowLeft size={16} /> Return to Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="admin-login__form">
              <div className="form-group">
                <label className="form-label" htmlFor="reset-email">Administrator Email</label>
                <input
                  id="reset-email"
                  className="form-input"
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="admin@zhaaestheticsalon.in"
                  disabled={loading}
                  required
                />
              </div>

              <button 
                id="reset-submit" 
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
                    <span className="book-loader" style={{ borderColor: '#000', borderTopColor: 'transparent', width: '14px', height: '14px' }} /> Sending Link...
                  </>
                ) : (
                  <>
                    Send Reset Link <ArrowRight size={14} />
                  </>
                )}
              </button>

              <div style={{ marginTop: '16px', textAlign: 'center' }}>
                <Link to="/admin-login" style={{ color: 'var(--admin-text-secondary)', fontSize: '13px', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                  <ArrowLeft size={14} /> Back to sign in
                </Link>
              </div>
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
