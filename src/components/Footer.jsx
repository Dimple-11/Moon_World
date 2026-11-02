import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowUp, Sparkles, Heart } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './BrandIcons';
import BrandLogo from './BrandLogo';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function Footer() {
  const { settings } = useSiteSettings();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="site-footer">
      <div className="footer-container">
        {/* Top Footer Strip */}
        <div className="footer-top-grid">
          {/* Brand & Bio */}
          <div className="footer-brand-col">
            <div className="footer-logo-row">
              <div className="brand-sakura-icon">
                <BrandLogo size={24} />
              </div>
              <div className="brand-text-wrap">
                <span className="brand-name">{settings.brandName}</span>
                <span className="brand-tag">{settings.brandSubtitle}</span>
              </div>
            </div>
            <p className="footer-brand-bio">
              {settings.tagline} An Information Technology undergraduate at IGDTUW, building AI-powered systems and creative digital experiences.
            </p>
            <div className="footer-social-strip">
              <a
                href={settings.github}
                target="_blank"
                rel="noreferrer"
                className="footer-social-icon"
                aria-label="GitHub Profile"
                title="GitHub Profile"
              >
                <GithubIcon size={17} />
              </a>
              <a
                href={settings.linkedin}
                target="_blank"
                rel="noreferrer"
                className="footer-social-icon"
                aria-label="LinkedIn Profile"
                title="LinkedIn"
              >
                <LinkedinIcon size={17} />
              </a>
              <a
                href={`mailto:${settings.email}`}
                className="footer-social-icon"
                aria-label="Email Me"
                title={`Email: ${settings.email}`}
              >
                <Mail size={17} />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="footer-links-col">
            <h4 className="footer-col-heading">Navigation</h4>
            <div className="footer-nav-list">
              <Link to="/" className="footer-nav-link">Home</Link>
              <Link to="/about" className="footer-nav-link">About</Link>
              <Link to="/skills" className="footer-nav-link">Skills</Link>
              <Link to="/projects" className="footer-nav-link">Projects</Link>
              <Link to="/blog" className="footer-nav-link">Blog</Link>
              <Link to="/gallery" className="footer-nav-link">Gallery</Link>
              <Link to="/experience" className="footer-nav-link">Experience</Link>
              <Link to="/achievements" className="footer-nav-link">Honors</Link>
              <Link to="/certifications" className="footer-nav-link">Certifications</Link>
              <Link to="/beyond-code" className="footer-nav-link">Beyond Code</Link>
              <Link to="/contact" className="footer-nav-link">Contact</Link>
              <Link to="/admin" className="footer-nav-link studio-link" title="Private Owner Dashboard">Studio 🔒</Link>
            </div>
          </div>

          {/* Tech & Specifications */}
          <div className="footer-specs-col">
            <h4 className="footer-col-heading">Engine &amp; Aesthetic</h4>
            <p className="footer-specs-text">
              Crafted in React with custom Canvas LERP sprite engine, WebP paginated atlases (1280×720 · 24 FPS · 145 Frames), Mochi companion, and dual Sakura Dream / Midnight Sakura design tokens.
            </p>
            <button onClick={scrollToTop} className="footer-back-to-top">
              <span>Back to Top</span>
              <ArrowUp size={14} />
            </button>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="footer-bottom-bar">
          <p className="footer-copyright">
            © {new Date().getFullYear()} Dimple · DIMPLE'S WORLD. Designed with love, curiosity, and code.
          </p>
          <div className="footer-sakura-badge">
            <Sparkles size={13} />
            <span>Sakura Dream Edition</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
