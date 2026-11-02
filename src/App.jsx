import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
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
import { SiteSettingsProvider } from './context/SiteSettingsContext';

// Home is the landing route, so it stays in the initial chunk.
import HomePage from './pages/HomePage';

// Every other route is loaded on demand so visitors never download the admin suite.
const AboutPage = lazy(() => import('./pages/AboutPage'));
const SkillsPage = lazy(() => import('./pages/SkillsPage'));
const ProjectsPage = lazy(() => import('./pages/ProjectsPage'));
const ProjectDetailPage = lazy(() => import('./pages/ProjectDetailPage'));
const ExperiencePage = lazy(() => import('./pages/ExperiencePage'));
const AchievementsPage = lazy(() => import('./pages/AchievementsPage'));
const CertificationsPage = lazy(() => import('./pages/CertificationsPage'));
const BeyondCodePage = lazy(() => import('./pages/BeyondCodePage'));
const ContactPage = lazy(() => import('./pages/ContactPage'));
const BlogPage = lazy(() => import('./pages/BlogPage'));
const BlogDetailPage = lazy(() => import('./pages/BlogDetailPage'));
const GalleryPage = lazy(() => import('./pages/GalleryPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));

// Admin Pages
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminOverview = lazy(() => import('./pages/admin/AdminOverview'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));
const AdminBlogs = lazy(() => import('./pages/admin/AdminBlogs'));
const AdminBlogEditor = lazy(() => import('./pages/admin/AdminBlogEditor'));
const AdminGallery = lazy(() => import('./pages/admin/AdminGallery'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));

import { logDeveloperGreeting, triggerSakuraBurst } from './utils/sakuraBurst';

// Scroll to top on route change
function RouteScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

// Soft sakura loader shown while a route chunk arrives
function PageFallback() {
  return (
    <div className="page-suspense-loader" role="status" aria-live="polite">
      <div className="sakura-loader" aria-hidden="true">
        <span className="sakura-loader-petal" />
        <span className="sakura-loader-petal" />
        <span className="sakura-loader-petal" />
        <span className="sakura-loader-petal" />
      </div>
      <p>Gathering petals…</p>
    </div>
  );
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
        <Suspense fallback={<PageFallback />}>
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
        </Suspense>
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
      <SiteSettingsProvider>
        <AdminAuthProvider>
          <AppInner />
        </AdminAuthProvider>
      </SiteSettingsProvider>
    </BrowserRouter>
  );
}
