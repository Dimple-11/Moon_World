import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import {
  Sun, Moon, FileText, Menu, X, Search, ChevronDown,
  User, Code2, Trophy, Award, FolderGit2, Briefcase, BookOpen,
  Image as ImageIcon, Palette
} from 'lucide-react';
import { GithubIcon } from './BrandIcons';
import BrandLogo from './BrandLogo';
import { useSiteSettings } from '../context/SiteSettingsContext';
import { resumeUrl as defaultResumeUrl } from '../data/links';

const navGroups = [
  { label: 'Home', to: '/' },
  {
    label: 'About',
    items: [
      { label: 'About', to: '/about', icon: User, desc: 'The story behind the pixels' },
      { label: 'Skills', to: '/skills', icon: Code2, desc: 'Languages, frameworks & tools' },
      { label: 'Honors', to: '/achievements', icon: Trophy, desc: 'Hackathons & recognition' },
      { label: 'Certifications', to: '/certifications', icon: Award, desc: 'Verified credentials' }
    ]
  },
  {
    label: 'Work',
    items: [
      { label: 'Projects', to: '/projects', icon: FolderGit2, desc: 'AI systems & full-stack builds' },
      { label: 'Experience', to: '/experience', icon: Briefcase, desc: 'Internships & leadership' },
      { label: 'Blog', to: '/blog', icon: BookOpen, desc: 'Notes, tutorials & reflections' }
    ]
  },
  {
    label: 'Creative',
    items: [
      { label: 'Gallery', to: '/gallery', icon: ImageIcon, desc: 'Campus & hackathon scrapbook' },
      { label: 'Beyond Code', to: '/beyond-code', icon: Palette, desc: 'Media, writing & community' }
    ]
  },
  { label: 'Contact', to: '/contact' }
];

const slugify = (value) => value.toLowerCase().replace(/[^a-z0-9]+/g, '-');

function isPathActive(to, pathname) {
  if (to === '/') return pathname === '/';
  return pathname === to || pathname.startsWith(`${to}/`);
}

function groupIsActive(items, pathname) {
  return items.some((item) => isPathActive(item.to, pathname));
}

export default function Navbar({ theme, onToggleTheme, onLogoClick, onOpenPalette }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState(null);
  const [openAccordion, setOpenAccordion] = useState(null);

  const { pathname } = useLocation();
  const { settings } = useSiteSettings();

  const groupRefs = useRef(new Map());
  const triggerRefs = useRef(new Map());
  const hoverTimer = useRef(null);
  const drawerCloseRef = useRef(null);

  const resumeHref = settings.resumeUrl || defaultResumeUrl;

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMenu = useCallback(() => setMobileMenuOpen(false), []);

  // Close every floating layer when the route changes.
  useEffect(() => {
    setOpenGroup(null);
    setMobileMenuOpen(false);
    setOpenAccordion(null);
  }, [pathname]);

  // Outside click + Esc for desktop dropdowns.
  useEffect(() => {
    if (!openGroup) return undefined;

    const handlePointerDown = (event) => {
      const wrapper = groupRefs.current.get(openGroup);
      if (wrapper && !wrapper.contains(event.target)) {
        setOpenGroup(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenGroup(null);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openGroup]);

  // Esc + body scroll lock for the mobile drawer.
  useEffect(() => {
    if (!mobileMenuOpen) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMobileMenuOpen(false);
      }
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    document.addEventListener('keydown', handleKeyDown);

    const focusTimer = window.setTimeout(() => drawerCloseRef.current?.focus(), 60);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', handleKeyDown);
      window.clearTimeout(focusTimer);
    };
  }, [mobileMenuOpen]);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  const openWithHover = (label) => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return;
    window.clearTimeout(hoverTimer.current);
    setOpenGroup(label);
  };

  const closeWithHover = () => {
    if (typeof window === 'undefined') return;
    if (!window.matchMedia?.('(hover: hover) and (pointer: fine)').matches) return;
    hoverTimer.current = window.setTimeout(() => setOpenGroup(null), 150);
  };

  const focusMenuItem = (label, index = 0) => {
    const wrapper = groupRefs.current.get(label);
    const items = wrapper ? Array.from(wrapper.querySelectorAll('[role="menuitem"]')) : [];
    if (!items.length) return;
    const targetIndex = index === -1 ? items.length - 1 : index;
    items[targetIndex]?.focus();
  };

  const handleTriggerKeyDown = (event, label) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpenGroup(label);
      window.requestAnimationFrame(() => focusMenuItem(label, 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setOpenGroup(label);
      window.requestAnimationFrame(() => focusMenuItem(label, -1));
    } else if (event.key === 'Escape') {
      setOpenGroup(null);
    }
  };

  const handleMenuKeyDown = (event, label) => {
    const wrapper = groupRefs.current.get(label);
    const items = wrapper ? Array.from(wrapper.querySelectorAll('[role="menuitem"]')) : [];
    if (!items.length) return;

    const currentIndex = items.indexOf(document.activeElement);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      items[(currentIndex + 1) % items.length]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      items[(currentIndex - 1 + items.length) % items.length]?.focus();
    } else if (event.key === 'Home') {
      event.preventDefault();
      items[0]?.focus();
    } else if (event.key === 'End') {
      event.preventDefault();
      items[items.length - 1]?.focus();
    } else if (event.key === 'Escape') {
      event.preventDefault();
      setOpenGroup(null);
      triggerRefs.current.get(label)?.focus();
    }
  };

  const handleGroupBlur = (event) => {
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setOpenGroup(null);
    }
  };

  return (
    <header className={`site-header ${isScrolled ? 'is-scrolled' : ''}`}>
      <div className="header-inner">
        {/* Brand */}
        <Link
          to="/"
          className="brand-logo"
          onClick={() => { closeMenu(); onLogoClick?.(); }}
          aria-label={`${settings.brandName} home`}
        >
          <span className="brand-sakura-icon">
            <BrandLogo size={28} />
          </span>
          <span className="brand-name">{settings.brandName}</span>
        </Link>

        {/* Desktop grouped navigation */}
        <nav className="nav-links" aria-label="Primary">
          {navGroups.map((group) => {
            if (!group.items) {
              return (
                <NavLink
                  key={group.label}
                  to={group.to}
                  end={group.to === '/'}
                  className={({ isActive }) => `nav-item${isActive ? ' is-active' : ''}`}
                >
                  {group.label}
                </NavLink>
              );
            }

            const active = groupIsActive(group.items, pathname);
            const isOpen = openGroup === group.label;
            const menuId = `nav-menu-${slugify(group.label)}`;

            return (
              <div
                key={group.label}
                className={`nav-group${active ? ' is-active' : ''}${isOpen ? ' is-open' : ''}`}
                ref={(node) => {
                  if (node) groupRefs.current.set(group.label, node);
                  else groupRefs.current.delete(group.label);
                }}
                onMouseEnter={() => openWithHover(group.label)}
                onMouseLeave={closeWithHover}
                onBlur={handleGroupBlur}
              >
                <button
                  type="button"
                  className="nav-group-trigger"
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  aria-controls={menuId}
                  ref={(node) => {
                    if (node) triggerRefs.current.set(group.label, node);
                    else triggerRefs.current.delete(group.label);
                  }}
                  onClick={() => setOpenGroup((prev) => (prev === group.label ? null : group.label))}
                  onKeyDown={(event) => handleTriggerKeyDown(event, group.label)}
                >
                  <span>{group.label}</span>
                  <ChevronDown size={13} className="nav-chevron" aria-hidden="true" />
                </button>

                {isOpen && (
                  <div
                    className="nav-dropdown"
                    id={menuId}
                    role="menu"
                    aria-label={`${group.label} menu`}
                    onKeyDown={(event) => handleMenuKeyDown(event, group.label)}
                  >
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          role="menuitem"
                          tabIndex={-1}
                          className={({ isActive }) => `nav-dropdown-item${isActive ? ' is-active' : ''}`}
                          onClick={() => setOpenGroup(null)}
                        >
                          <span className="nav-dropdown-icon" aria-hidden="true">
                            <Icon size={16} />
                          </span>
                          <span className="nav-dropdown-copy">
                            <span className="nav-dropdown-label">{item.label}</span>
                            <span className="nav-dropdown-desc">{item.desc}</span>
                          </span>
                        </NavLink>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Right-side actions */}
        <div className="header-actions">
          <button
            onClick={onOpenPalette}
            className="action-icon-btn palette-trigger-btn"
            aria-label="Open command palette (Ctrl+K)"
            title="Command Palette (Ctrl+K)"
          >
            <Search size={16} />
            <span className="palette-kbd-hint">⌘K</span>
          </button>

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

          <a
            href={settings.github}
            target="_blank"
            rel="noopener noreferrer"
            className="action-icon-btn"
            aria-label="GitHub profile (opens in a new tab)"
            title="GitHub: Dimple-11"
          >
            <GithubIcon size={17} />
          </a>

          <a
            href={resumeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-sm btn-nav-cta"
            aria-label="Resume (opens in a new tab)"
          >
            <FileText size={14} />
            <span>Resume</span>
          </a>

          <button
            className="mobile-hamburger-btn"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileMenuOpen && (
        <div className="mobile-drawer-overlay" onClick={closeMenu}>
          <div
            className="mobile-drawer"
            id="mobile-navigation"
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="drawer-header">
              <span className="drawer-brand">{settings.brandName}</span>
              <button
                ref={drawerCloseRef}
                className="drawer-close-btn"
                onClick={closeMenu}
                aria-label="Close navigation menu"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="mobile-nav-links" aria-label="Mobile primary">
              {navGroups.map((group) => {
                if (!group.items) {
                  return (
                    <NavLink
                      key={group.label}
                      to={group.to}
                      end={group.to === '/'}
                      className={({ isActive }) => `mobile-nav-item${isActive ? ' is-active' : ''}`}
                      onClick={closeMenu}
                    >
                      {group.label}
                    </NavLink>
                  );
                }

                const active = groupIsActive(group.items, pathname);
                const expanded = openAccordion === group.label;
                const panelId = `mobile-accordion-${slugify(group.label)}`;

                return (
                  <div key={group.label} className={`mobile-accordion${active ? ' is-active' : ''}`}>
                    <button
                      type="button"
                      className="mobile-accordion-trigger"
                      aria-expanded={expanded}
                      aria-controls={panelId}
                      onClick={() => setOpenAccordion((prev) => (prev === group.label ? null : group.label))}
                    >
                      <span>{group.label}</span>
                      <ChevronDown size={16} className="mobile-accordion-chevron" aria-hidden="true" />
                    </button>
                    {expanded && (
                      <div className="mobile-accordion-panel" id={panelId}>
                        {group.items.map((item) => (
                          <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) => `mobile-nav-sublink${isActive ? ' is-active' : ''}`}
                            onClick={closeMenu}
                          >
                            {item.label}
                          </NavLink>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="drawer-footer">
              <button onClick={() => { onToggleTheme(); closeMenu(); }} className="drawer-theme-btn">
                {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
                <span>Toggle {theme === 'dark' ? 'Light Theme' : 'Dark Theme'}</span>
              </button>
              <a
                href={settings.github}
                target="_blank"
                rel="noopener noreferrer"
                className="drawer-github-link"
                onClick={closeMenu}
              >
                <GithubIcon size={16} />
                <span>{settings.github.replace(/^https?:\/\/(www\.)?/, '')}</span>
              </a>
              <a
                href={resumeHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary drawer-resume-btn"
                aria-label="Resume (opens in a new tab)"
                onClick={closeMenu}
              >
                <FileText size={16} />
                <span>Resume</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
