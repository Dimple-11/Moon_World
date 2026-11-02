import React from 'react';
import { NavLink, Outlet, Navigate, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Inbox, BookOpen, PenTool, Image,
  Settings, LogOut, ArrowLeft, Sparkles, Disc3
} from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import DatabaseStatusBanner from '../../components/DatabaseStatusBanner';

export default function AdminLayout() {
  const { admin, isAuthenticated, isLoading, logout } = useAdminAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="admin-loading-screen">
        <Sparkles size={28} className="admin-spin-icon" />
        <p>Loading Dimple Studio...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const navItems = [
    { label: 'Overview', to: '/admin', icon: LayoutDashboard, end: true },
    { label: 'Messages', to: '/admin/messages', icon: Inbox },
    { label: 'Published Blogs', to: '/admin/blogs', icon: BookOpen },
    { label: 'Writing Studio', to: '/admin/blogs/editor', icon: PenTool },
    { label: 'Photo Scrapbook', to: '/admin/gallery', icon: Image },
    { label: 'Studio Settings', to: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="admin-root-layout">
      {/* Sidebar Navigation */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-top">
          <div className="admin-brand-header">
            <div className="admin-brand-logo">
              <span>D</span>
            </div>
            <div>
              <div className="admin-brand-title">Dimple Studio</div>
              <div className="admin-brand-badge">Private Owner Suite</div>
            </div>
          </div>

          <nav className="admin-nav-menu">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) => `admin-nav-link ${isActive ? 'is-active' : ''}`}
                >
                  <Icon size={18} className="admin-nav-icon" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        <div className="admin-sidebar-bottom">
          <div className="admin-user-card">
            <div className="admin-user-avatar">🌸</div>
            <div className="admin-user-info">
              <div className="admin-user-name">{admin?.name || 'Dimple'}</div>
              <div className="admin-user-email">{admin?.email}</div>
            </div>
          </div>

          <div className="admin-sidebar-actions">
            <button
              onClick={() => navigate('/')}
              className="admin-side-btn secondary"
              title="Return to public portfolio"
            >
              <ArrowLeft size={15} />
              <span>Public Website</span>
            </button>
            <button
              onClick={handleLogout}
              className="admin-side-btn logout"
              title="Log out of admin session"
            >
              <LogOut size={15} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Admin View Content */}
      <main className="admin-main-viewport">
        <header className="admin-topbar">
          <div className="admin-breadcrumbs">
            <span>Dimple Studio</span>
            <span className="breadcrumb-separator">/</span>
            <span className="breadcrumb-current">Management Console</span>
          </div>
          <div className="admin-topbar-actions">
            <span className="live-status-pill">
              <span className="ping-dot" />
              <span>Production Session Active</span>
            </span>
          </div>
        </header>

        <div className="admin-viewport-scroll">
          <DatabaseStatusBanner />
          <Outlet />
        </div>
      </main>
    </div>
  );
}
