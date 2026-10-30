import React, { useState, useEffect, useCallback } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import SakuraBackground from './components/SakuraBackground';
import ScrollProgress from './components/ScrollProgress';
import CustomCursor from './components/CustomCursor';
import CommandPalette from './components/CommandPalette';
import Mochi from './components/Mochi';
import MusicPlayer from './components/MusicPlayer';
import ScrollToTop from './components/ScrollToTop';

// Context
import { AdminAuthProvider } from './context/AdminAuthContext';

// Public Pages
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import SkillsPage from './pages/SkillsPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ExperiencePage from './pages/ExperiencePage';
import AchievementsPage from './pages/AchievementsPage';
import CertificationsPage from './pages/CertificationsPage';
import BeyondCodePage from './pages/BeyondCodePage';
import ContactPage from './pages/ContactPage';
import BlogPage from './pages/BlogPage';
import BlogDetailPage from './pages/BlogDetailPage';
import GalleryPage from './pages/GalleryPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminLayout from './pages/admin/AdminLayout';
import AdminOverview from './pages/admin/AdminOverview';
import AdminMessages from './pages/admin/AdminMessages';
import AdminBlogs from './pages/admin/AdminBlogs';
import AdminBlogEditor from './pages/admin/AdminBlogEditor';
import AdminGallery from './pages/admin/AdminGallery';
import AdminSettings from './pages/admin/AdminSettings';

import './styles/theme.css';
import './styles/index.css';
import './styles/hero.css';
import { logDeveloperGreeting, triggerSakuraBurst } from './utils/sakuraBurst';

// Scroll to top on route change
function RouteScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

function AppInner() {
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('dimpuru-theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [musicPlayerForceOpen, setMusicPlayerForceOpen] = useState(false);
  const [logoClickCount, setLogoClickCount] = useState(0);

  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Apply theme
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('dimpuru-theme', theme);
  }, [theme]);

  // Log developer greeting once
  useEffect(() => {
    logDeveloperGreeting();
  }, []);

  // Ctrl+K command palette listener
  useEffect(() => {
    const handler = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const handleLogoClick = useCallback(() => {
    setLogoClickCount((prev) => {
      const next = prev + 1;
      if (next >= 5) {
        triggerSakuraBurst();
        return 0;
      }
      return next;
    });
  }, []);

  return (
    <div className={`portfolio-app-root theme-transition ${theme}-theme`} data-theme={theme}>
      <RouteScrollTop />

      {/* Global floating overlays */}
      <SakuraBackground theme={theme} />
      <CustomCursor />
      {!isAdminRoute && <ScrollProgress />}

      {/* Top Navigation (hidden in admin studio) */}
      {!isAdminRoute && (
        <Navbar
          theme={theme}
          onToggleTheme={toggleTheme}
          onLogoClick={handleLogoClick}
          onOpenPalette={() => setCommandPaletteOpen(true)}
        />
      )}

      {/* Main Routes */}
      <main className={isAdminRoute ? 'admin-main-wrapper' : 'public-main-wrapper'}>
        <Routes>
          {/* Public Views */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/skills" element={<SkillsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/:slug" element={<ProjectDetailPage />} />
          <Route path="/experience" element={<ExperiencePage />} />
          <Route path="/achievements" element={<AchievementsPage />} />
          <Route path="/certifications" element={<CertificationsPage />} />
          <Route path="/beyond-code" element={<BeyondCodePage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/contact" element={<ContactPage />} />

          {/* Admin Owner Dashboard */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="blogs/editor" element={<AdminBlogEditor />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* 404 Catch-All */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer (hidden in admin studio) */}
      {!isAdminRoute && <Footer />}

      {/* Global floating interactive widgets */}
      {!isAdminRoute && (
        <>
          <ScrollToTop />
          <Mochi />
          <MusicPlayer
            isForceOpen={musicPlayerForceOpen}
            onCloseForce={() => setMusicPlayerForceOpen(false)}
          />
        </>
      )}

      {/* Command Palette */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onToggleTheme={toggleTheme}
        onOpenMusic={() => {
          setMusicPlayerForceOpen(true);
          setCommandPaletteOpen(false);
        }}
        theme={theme}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AdminAuthProvider>
        <AppInner />
      </AdminAuthProvider>
    </BrowserRouter>
  );
}
