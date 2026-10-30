import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Inbox, BookOpen, Image, Sparkles, ArrowRight,
  Clock, CheckCircle, Mail, PlusCircle, ExternalLink
} from 'lucide-react';

export default function AdminOverview() {
  const [stats, setStats] = useState({
    totalMessages: 0,
    unreadMessages: 0,
    totalBlogs: 0,
    publishedBlogs: 0,
    draftBlogs: 0,
    totalGallery: 0,
    recentMessages: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOverview() {
      try {
        const [msgRes, blogRes, galRes] = await Promise.all([
          fetch('/api/messages?limit=5', { credentials: 'include' }).then(r => r.json()),
          fetch('/api/blogs/admin/all', { credentials: 'include' }).then(r => r.json()),
          fetch('/api/gallery').then(r => r.json())
        ]);

        setStats({
          totalMessages: msgRes.total || 0,
          unreadMessages: msgRes.unreadCount || 0,
          totalBlogs: blogRes.counts?.total || 0,
          publishedBlogs: blogRes.counts?.published || 0,
          draftBlogs: blogRes.counts?.draft || 0,
          totalGallery: galRes.items?.length || 0,
          recentMessages: msgRes.messages || []
        });
      } catch (err) {
        console.error('Failed to load overview metrics:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchOverview();
  }, []);

  return (
    <div className="admin-page-container">
      {/* Welcome Banner */}
      <div className="admin-welcome-card">
        <div className="welcome-text-wrap">
          <h1 className="welcome-title">Welcome back, Dimple! 🌸</h1>
          <p className="welcome-desc">
            Here is your live studio status across inbox inquiries, editorial articles, and scrapbook memories.
          </p>
        </div>
        <div className="welcome-actions">
          <Link to="/admin/blogs/editor" className="btn btn-primary btn-sm">
            <PlusCircle size={15} />
            <span>Write New Article</span>
          </Link>
          <Link to="/admin/gallery" className="btn btn-secondary btn-sm">
            <Image size={15} />
            <span>Add Photograph</span>
          </Link>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="admin-metrics-grid">
        <div className="metric-box">
          <div className="metric-icon-wrap inbox">
            <Inbox size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-number">{stats.totalMessages}</span>
            <span className="metric-label">Total Inquiries</span>
          </div>
          {stats.unreadMessages > 0 && (
            <span className="metric-pill unread">{stats.unreadMessages} Unread</span>
          )}
        </div>

        <div className="metric-box">
          <div className="metric-icon-wrap blogs">
            <BookOpen size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-number">{stats.publishedBlogs}</span>
            <span className="metric-label">Published Articles</span>
          </div>
          <span className="metric-pill draft">{stats.draftBlogs} Drafts</span>
        </div>

        <div className="metric-box">
          <div className="metric-icon-wrap gallery">
            <Image size={22} />
          </div>
          <div className="metric-details">
            <span className="metric-number">{stats.totalGallery}</span>
            <span className="metric-label">Scrapbook Photos</span>
          </div>
          <span className="metric-pill live">Digital Album</span>
        </div>
      </div>

      {/* Two-Column Overview Split */}
      <div className="admin-overview-grid">
        {/* Left: Recent Inquiries */}
        <div className="overview-card-box">
          <div className="overview-card-header">
            <div className="card-title-group">
              <Mail size={18} className="card-header-icon" />
              <h3>Recent Contact Inquiries</h3>
            </div>
            <Link to="/admin/messages" className="card-header-link">
              <span>View All</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="overview-messages-list">
            {stats.recentMessages.length === 0 ? (
              <div className="overview-empty-state">
                <p>No messages received yet.</p>
              </div>
            ) : (
              stats.recentMessages.slice(0, 4).map((msg) => (
                <div key={msg._id} className={`overview-msg-item ${!msg.isRead ? 'is-unread' : ''}`}>
                  <div className="msg-sender-col">
                    <span className="msg-sender-name">{msg.name}</span>
                    <span className="msg-sender-email">{msg.email}</span>
                  </div>
                  <div className="msg-content-col">
                    <span className="msg-subject">{msg.subject}</span>
                    <span className="msg-snippet">{msg.message.substring(0, 80)}...</span>
                  </div>
                  <div className="msg-time-col">
                    <span>{new Date(msg.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Quick Studio Actions & AI Assistant Status */}
        <div className="overview-card-box">
          <div className="overview-card-header">
            <div className="card-title-group">
              <Sparkles size={18} className="card-header-icon" />
              <h3>Mochi AI Companion Status</h3>
            </div>
          </div>

          <div className="mochi-status-widget">
            <div className="mochi-status-top">
              <div className="mochi-status-avatar">ฅ^•ﻌ•^ฅ</div>
              <div>
                <div className="mochi-status-title">Mochi is Active</div>
                <div className="mochi-status-desc">Grounding conversations with Dimple's real project portfolio.</div>
              </div>
            </div>

            <div className="mochi-status-metrics">
              <div className="status-item">
                <span className="status-label">Model Endpoint</span>
                <span className="status-value">gemini-2.5-flash / local</span>
              </div>
              <div className="status-item">
                <span className="status-label">Knowledge Base</span>
                <span className="status-value">6 Projects · 3 Experiences · 3 Blogs</span>
              </div>
            </div>

            <Link to="/admin/settings" className="btn btn-secondary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
              <span>Configure AI Settings</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
