import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { Lock, Mail, Key, Sparkles, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated, isLoading } = useAdminAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="admin-loading-screen">
        <Sparkles size={28} className="admin-spin-icon" />
        <p>Verifying Dimple Studio security token...</p>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/admin');
    } catch (err) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-view">
      <div className="admin-login-card">
        {/* Anime Lock Header */}
        <div className="admin-login-badge">
          <div className="admin-badge-icon">
            <Lock size={20} />
          </div>
          <span className="admin-badge-text">Dimple Studio · Owner Access</span>
        </div>

        <h1 className="admin-login-title">Creator Control Room</h1>
        <p className="admin-login-subtitle">
          Private dashboard for managing messages, blog publications, photo scrapbooks, and AI companion parameters.
        </p>

        {error && (
          <div className="admin-error-banner">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="admin-form-group">
            <label className="admin-form-label">Owner Email</label>
            <div className="admin-input-wrapper">
              <Mail size={16} className="admin-input-icon" />
              <input
                type="email"
                required
                className="admin-input"
                placeholder="dimple@dimplesworld.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-form-label">Security Password</label>
            <div className="admin-input-wrapper">
              <Key size={16} className="admin-input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className="admin-input"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                className="admin-pwd-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="admin-submit-btn"
            disabled={loading}
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>Enter Studio</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          <span className="security-notice">
            🔒 Protected by server-side HTTP-only session cookies and bcrypt hashing.
          </span>
        </div>
      </div>
    </div>
  );
}
