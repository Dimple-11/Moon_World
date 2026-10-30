import React, { useState, useEffect } from 'react';
import { Settings, ShieldCheck, Database, Bot, Image, Check, RefreshCw } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminSettings() {
  const { admin } = useAdminAuth();
  const [health, setHealth] = useState(null);
  const [loading, setLoading] = useState(true);

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
