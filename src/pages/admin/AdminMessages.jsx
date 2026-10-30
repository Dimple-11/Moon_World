import React, { useState, useEffect } from 'react';
import {
  Inbox, Search, Mail, MailOpen, Archive, Trash2,
  ExternalLink, Clock, User, Check, X, Filter
} from 'lucide-react';

export default function AdminMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'unread' | 'archived'
  const [search, setSearch] = useState('');
  const [activeMessage, setActiveMessage] = useState(null);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/messages?filter=${filter}&search=${encodeURIComponent(search)}`, {
        credentials: 'include'
      });
      const data = await res.json();
      if (data.success) {
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [filter, search]);

  const toggleRead = async (id, currentStatus, e) => {
    e?.stopPropagation();
    try {
      await fetch(`/api/messages/${id}/read`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isRead: !currentStatus })
      });
      setMessages(prev => prev.map(m => m._id === id ? { ...m, isRead: !currentStatus } : m));
      if (activeMessage && activeMessage._id === id) {
        setActiveMessage(prev => ({ ...prev, isRead: !currentStatus }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleArchive = async (id, currentStatus, e) => {
    e?.stopPropagation();
    try {
      await fetch(`/api/messages/${id}/archive`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ isArchived: !currentStatus })
      });
      fetchMessages();
      if (activeMessage && activeMessage._id === id) {
        setActiveMessage(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteMessage = async (id, e) => {
    e?.stopPropagation();
    if (!window.confirm('Are you sure you want to permanently delete this inquiry?')) return;
    try {
      await fetch(`/api/messages/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      setMessages(prev => prev.filter(m => m._id !== id));
      if (activeMessage && activeMessage._id === id) {
        setActiveMessage(null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-page-container">
      {/* Top Controls Bar */}
      <div className="admin-page-header-row">
        <div>
          <h1 className="admin-page-title">Contact Inquiries</h1>
          <p className="admin-page-subtitle">Private inbox for messages submitted through the website contact form.</p>
        </div>

        {/* Search */}
        <div className="admin-search-wrapper">
          <Search size={16} className="search-icon" />
          <input
            type="text"
            placeholder="Search sender, email, or message..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search-input"
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="admin-filter-tabs">
        <button
          className={`filter-tab-btn ${filter === 'all' ? 'is-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Inquiries
        </button>
        <button
          className={`filter-tab-btn ${filter === 'unread' ? 'is-active' : ''}`}
          onClick={() => setFilter('unread')}
        >
          Unread
        </button>
        <button
          className={`filter-tab-btn ${filter === 'archived' ? 'is-active' : ''}`}
          onClick={() => setFilter('archived')}
        >
          Archived
        </button>
      </div>

      {/* Messages List Table */}
      <div className="admin-table-card">
        {loading ? (
          <div className="admin-loading-state">
            <p>Loading inquiries...</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="admin-empty-state">
            <Inbox size={42} className="empty-icon" />
            <h3>No messages found</h3>
            <p>Your inbox is peaceful and clean.</p>
          </div>
        ) : (
          <div className="inbox-messages-list">
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`inbox-row ${!msg.isRead ? 'is-unread' : ''}`}
                onClick={() => {
                  setActiveMessage(msg);
                  if (!msg.isRead) toggleRead(msg._id, false);
                }}
              >
                <div className="inbox-status-dot">
                  {!msg.isRead && <span className="unread-dot" />}
                </div>

                <div className="inbox-sender-meta">
                  <span className="inbox-name">{msg.name}</span>
                  <span className="inbox-email">{msg.email}</span>
                </div>

                <div className="inbox-content-snippet">
                  <span className="inbox-subject">{msg.subject}</span>
                  <span className="inbox-text-preview">— {msg.message}</span>
                </div>

                <div className="inbox-date">
                  <span>{new Date(msg.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}</span>
                </div>

                <div className="inbox-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="action-pill-btn"
                    onClick={(e) => toggleRead(msg._id, msg.isRead, e)}
                    title={msg.isRead ? 'Mark as Unread' : 'Mark as Read'}
                  >
                    {msg.isRead ? <Mail size={14} /> : <MailOpen size={14} />}
                  </button>
                  <button
                    className="action-pill-btn"
                    onClick={(e) => toggleArchive(msg._id, msg.isArchived, e)}
                    title={msg.isArchived ? 'Unarchive' : 'Archive'}
                  >
                    <Archive size={14} />
                  </button>
                  <button
                    className="action-pill-btn delete"
                    onClick={(e) => deleteMessage(msg._id, e)}
                    title="Delete permanently"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Full Message Detail Modal */}
      {activeMessage && (
        <div className="admin-modal-backdrop" onClick={() => setActiveMessage(null)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <span className="modal-date">
                  <Clock size={12} /> {new Date(activeMessage.createdAt).toLocaleString()}
                </span>
                <h2 className="modal-subject">{activeMessage.subject}</h2>
              </div>
              <button className="modal-close-btn" onClick={() => setActiveMessage(null)}>
                <X size={18} />
              </button>
            </div>

            <div className="modal-sender-info">
              <div className="sender-avatar">
                <User size={18} />
              </div>
              <div>
                <div className="sender-name">{activeMessage.name}</div>
                <a href={`mailto:${activeMessage.email}`} className="sender-email-link">
                  {activeMessage.email} <ExternalLink size={12} />
                </a>
              </div>
            </div>

            <div className="modal-body-content">
              <p>{activeMessage.message}</p>
            </div>

            <div className="modal-footer-actions">
              <a
                href={`mailto:${activeMessage.email}?subject=Re: ${encodeURIComponent(activeMessage.subject)}`}
                className="btn btn-primary btn-sm"
              >
                <Mail size={14} />
                <span>Reply via Email</span>
              </a>
              <button
                className="btn btn-secondary btn-sm"
                onClick={(e) => toggleArchive(activeMessage._id, activeMessage.isArchived, e)}
              >
                <Archive size={14} />
                <span>{activeMessage.isArchived ? 'Unarchive' : 'Archive'}</span>
              </button>
              <button
                className="btn btn-danger btn-sm"
                onClick={(e) => deleteMessage(activeMessage._id, e)}
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
