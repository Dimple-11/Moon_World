import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, Database, Bot, Image, Check, RefreshCw, Save } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { useSiteSettings } from '../../context/SiteSettingsContext';

export default function AdminSettings() {
  const { admin } = useAdminAuth();
  const { settings, setSettings } = useSiteSettings();
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [saveNote, setSaveNote] = useState('');

  useEffect(() => {
    setForm(settings);
  }, [settings]);

  const fetchHealth = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/health');
      const data = await res.json();
      setHealth(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const updateField = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
    setSaveNote('');
  };

  const handleSaveSite = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      setSaveNote('');
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Unable to save settings.');
      setSettings(data.settings);
      setSaveNote(data.storage === 'mongodb' ? 'Saved to the database.' : 'Saved for this session only (no database connected).');
    } catch (err) {
      setSaveNote(err.message || 'Unable to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header-row">
        <div>
          <h1 className="admin-page-title">Studio Settings &amp; Architecture</h1>
          <p className="admin-page-subtitle">Inspect database connections, AI model status, and account configuration.</p>
        </div>

        <button onClick={fetchHealth} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} className={loading ? 'admin-spin-icon' : ''} />
          <span>Refresh Health Status</span>
        </button>
      </div>

      <div className="admin-settings-grid">
        {/* Public site identity */}
        <form className="settings-card settings-identity-card" onSubmit={handleSaveSite}>
          <div className="settings-card-header">
            <Settings size={20} className="settings-icon" />
            <div>
              <h3>Public Site Identity</h3>
              <p>Shown in the navbar, footer, page title and contact links</p>
            </div>
          </div>

          <div className="settings-identity-fields">
            <div className="form-group">
              <label className="form-label" htmlFor="site-brand-name">Site Name</label>
              <input id="site-brand-name" className="form-input" value={form.brandName || ''} onChange={updateField('brandName')} maxLength={80} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="site-brand-subtitle">Brand Subtitle</label>
              <input id="site-brand-subtitle" className="form-input" value={form.brandSubtitle || ''} onChange={updateField('brandSubtitle')} maxLength={120} />
            </div>
            <div className="form-group settings-field-wide">
              <label className="form-label" htmlFor="site-tagline">Tagline</label>
              <input id="site-tagline" className="form-input" value={form.tagline || ''} onChange={updateField('tagline')} maxLength={200} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="site-email">Contact Email</label>
              <input id="site-email" type="email" className="form-input" value={form.email || ''} onChange={updateField('email')} maxLength={120} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="site-github">GitHub URL</label>
              <input id="site-github" className="form-input" value={form.github || ''} onChange={updateField('github')} maxLength={200} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="site-linkedin">LinkedIn URL</label>
              <input id="site-linkedin" className="form-input" value={form.linkedin || ''} onChange={updateField('linkedin')} maxLength={200} />
            </div>
          </div>

          <div className="settings-identity-actions">
            <button type="submit" className="btn btn-primary btn-sm" disabled={saving}>
              <Save size={14} />
              <span>{saving ? 'Saving…' : 'Save Identity'}</span>
            </button>
            {saveNote && <span className="settings-save-note">{saveNote}</span>}
          </div>
        </form>

        {/* Backend & Database Health Card */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Database size={20} className="settings-icon" />
            <div>
              <h3>Database &amp; Storage Architecture</h3>
              <p>MongoDB Cluster and Local Storage Status</p>
            </div>
          </div>

          <div className="settings-status-list">
            <div className="status-row">
              <span className="status-label">MongoDB Connection</span>
              <span className={`status-pill ${health?.database?.connected ? 'connected' : 'warning'}`}>
                {health?.database?.statusText || 'Checking...'}
              </span>
            </div>

            <div className="status-row">
              <span className="status-label">ImageKit Media CDN</span>
              <span className={`status-pill ${health?.imagekitConfigured ? 'connected' : 'neutral'}`}>
                {health?.imagekitConfigured ? 'Active & Signed' : 'Configured via Direct URLs'}
              </span>
            </div>

            <div className="status-row">
              <span className="status-label">Backend API Server</span>
              <span className="status-pill connected">Online (Port 5000)</span>
            </div>
          </div>
        </div>

        {/* Gemini AI Companion Card */}
        <div className="settings-card">
          <div className="settings-card-header">
            <Bot size={20} className="settings-icon" />
            <div>
              <h3>Mochi AI Companion Engine</h3>
              <p>Google Gemini Integration &amp; Grounding</p>
            </div>
          </div>

          <div className="settings-status-list">
            <div className="status-row">
              <span className="status-label">Gemini API Status</span>
              <span className={`status-pill ${health?.geminiConfigured ? 'connected' : 'active-local'}`}>
                {health?.geminiConfigured ? 'Gemini 2.5 Flash Connected' : 'Local Portfolio Grounding Fallback'}
              </span>
            </div>

            <div className="status-row">
              <span className="status-label">Safety &amp; Abuse Limiting</span>
              <span className="status-pill connected">Active (Max 25 queries / 10m per IP)</span>
            </div>

            <div className="status-row">
              <span className="status-label">Personality</span>
              <span className="status-pill neutral">Mochi the Anime Cat</span>
            </div>
          </div>
        </div>

        {/* Owner Account Card */}
        <div className="settings-card">
          <div className="settings-card-header">
            <ShieldCheck size={20} className="settings-icon" />
            <div>
              <h3>Admin Identity &amp; Session</h3>
              <p>Owner credentials and active JWT cookie</p>
            </div>
          </div>

          <div className="settings-status-list">
            <div className="status-row">
              <span className="status-label">Owner Name</span>
              <span className="status-text-val">{admin?.name || 'Dimple'}</span>
            </div>
            <div className="status-row">
              <span className="status-label">Registered Email</span>
              <span className="status-text-val">{admin?.email}</span>
            </div>
            <div className="status-row">
              <span className="status-label">Session Protection</span>
              <span className="status-pill connected">HTTP-Only Cookie (7-day validity)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
