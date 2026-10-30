import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Sun, Moon, FileText, Menu, X, Search } from 'lucide-react';
import { GithubIcon } from './BrandIcons';
import { personalInfo } from '../data/portfolioData';

const navLinks = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Skills', to: '/skills' },
  { label: 'Projects', to: '/projects' },
  { label: 'Blog', to: '/blog' },
  { label: 'Gallery', to: '/gallery' },
  { label: 'Experience', to: '/experience' },
  { label: 'Honors', to: '/achievements' },
  { label: 'Beyond Code', to: '/beyond-code' },
  { label: 'Contact', to: '/contact' },
];

export default function Navbar({ theme, onToggleTheme, onLogoClick, onOpenPalette }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="header-inner">
        {/* Brand Logo */}
        <Link
          to="/"
          className="brand-logo"
          onClick={() => { closeMenu(); onLogoClick?.(); }}
        >
          <div className="brand-sakura-icon">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <defs>
                <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#E891B4"/>
                  <stop offset="100%" stopColor="#A78BFA"/>
                </linearGradient>
              </defs>
              <rect width="28" height="28" rx="8" fill="url(#logoGrad)" />
              <text x="5" y="21" fontFamily="Outfit,sans-serif" fontWeight="800" fontSize="18" fill="white">D</text>
              <circle cx="22" cy="6" r="3" fill="white" opacity="0.85"/>
              <circle cx="22" cy="6" r="1.2" fill="url(#logoGrad)"/>
            </svg>
          </div>
          <div className="brand-text-wrap">
            <span className="brand-name">DIMPLE'S WORLD</span>
            <span className="brand-tag">THE CREATIVE UNIVERSE OF DIMPLE</span>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav className="nav-links">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              className={({ isActive }) => `nav-item${isActive ? ' is-active' : ''}`}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Header Actions */}
        <div className="header-actions">
          {/* Command Palette trigger */}
          <button
            onClick={onOpenPalette}
            className="action-icon-btn palette-trigger-btn"
            aria-label="Open command palette (Ctrl+K)"
            title="Command Palette (Ctrl+K)"
          >
            <Search size={16} />
            <span className="palette-kbd-hint">⌘K</span>
          </button>

          {/* Theme Switcher */}
          <button
            onClick={onToggleTheme}
            className="theme-toggle-btn"
            aria-label={`Switch to ${theme === 'dark' ? 'Sakura Dream (Light)' : 'Midnight Sakura (Dark)'} theme`}
            title={`Current: ${theme === 'dark' ? 'Midnight Sakura' : 'Sakura Dream'}`}
          >
            {theme === 'dark' ? (
              <Sun size={17} className="theme-icon sun-icon" />
            ) : (
              <Moon size={17} className="theme-icon moon-icon" />
            )}
            <span className="theme-toggle-label">{theme === 'dark' ? 'Midnight' : 'Sakura'}</span>
          </button>

          {/* GitHub Profile */}
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noreferrer"
            className="action-icon-btn"
            aria-label="GitHub Profile"
            title="GitHub: Dimple-11"
          >
            <GithubIcon size={17} />
          </a>

          {/* Resume CTA */}
          <Link to="/contact" className="btn btn-sm btn-nav-cta">
            <FileText size={14} />
            <span>Resume</span>
          </Link>

          {/* Mobile Hamburger */}
          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={closeMenu}>
          <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
            <div className="drawer-header">
              <span className="drawer-brand">DIMPLE'S WORLD</span>
              <button className="drawer-close-btn" onClick={closeMenu}>
                <X size={20} />
              </button>
            </div>
            <nav className="mobile-nav-links">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  className={({ isActive }) => `mobile-nav-item${isActive ? ' is-active' : ''}`}
                  onClick={closeMenu}
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>
            <div className="drawer-footer">
              <button onClick={() => { onToggleTheme(); closeMenu(); }} className="drawer-theme-btn">
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                <span>Toggle {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
              </button>
              <a
                href={personalInfo.github}
                target="_blank"
                rel="noreferrer"
                className="drawer-github-link"
                onClick={closeMenu}
              >
                <GithubIcon size={16} />
                <span>github.com/Dimple-11</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
