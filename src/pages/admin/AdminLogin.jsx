import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, Lock, Mail, ArrowRight, Eye, EyeOff, KeyRound, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const toast = useToast();

  const [email, setEmail] = useState('admin@nextgenarvr.club');
  const [password, setPassword] = useState('Admin@NextGen2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok) {
        login(data.token, data.admin);
        toast.success(`Welcome back, ${data.admin.username}!`);
        const from = location.state?.from?.pathname || '/admin/dashboard';
        navigate(from, { replace: true });
      } else {
        setErrorMsg(data.error || 'Authentication failed. Please verify credentials.');
        toast.error(data.error || 'Invalid credentials');
      }
    } catch (err) {
      setErrorMsg('Network error connecting to authentication server.');
      toast.error('Network connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-wrapper">
      <div className="admin-login-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.2), rgba(138, 43, 226, 0.3))',
            border: '1px solid rgba(0, 240, 255, 0.4)',
            color: '#00F0FF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            boxShadow: '0 0 25px rgba(0, 240, 255, 0.3)'
          }}>
            <Shield size={28} />
          </div>
          <h2 style={{ fontSize: '1.8rem', color: '#FFFFFF', marginBottom: '0.35rem' }}>Admin Gateway</h2>
          <p style={{ color: '#94A3B8', fontSize: '0.9rem' }}>
            NextGen AR/VR Restricted Management Suite
          </p>
        </div>

        {errorMsg && (
          <div style={{
            background: 'rgba(255, 51, 102, 0.12)',
            border: '1px solid rgba(255, 51, 102, 0.3)',
            borderRadius: '10px',
            padding: '0.85rem',
            marginBottom: '1.5rem',
            color: '#FF8099',
            fontSize: '0.88rem'
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Admin Email or Username</label>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '2.5rem' }}
                placeholder="admin@nextgenarvr.club"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Security Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748B' }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                placeholder="••••••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#64748B',
                  cursor: 'pointer'
                }}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-lg full-width"
            disabled={loading}
            style={{ marginTop: '1.5rem' }}
            id="admin-login-submit-btn"
          >
            {loading ? (
              <span>Verifying Token...</span>
            ) : (
              <>
                <KeyRound size={18} />
                <span>Authenticate Session</span>
              </>
            )}
          </button>
        </form>

        {/* Demo Seed Credentials Callout */}
        <div className="demo-creds-box">
          <span style={{ fontWeight: '700', display: 'block', marginBottom: '0.2rem', color: '#FFFFFF' }}>
            🔑 Pre-Configured Administrator Credentials:
          </span>
          <div>Email: <strong style={{ color: '#00F0FF' }}>admin@nextgenarvr.club</strong></div>
          <div>Password: <strong style={{ color: '#00F0FF' }}>Admin@NextGen2026!</strong></div>
        </div>
      </div>
    </div>
  );
}
