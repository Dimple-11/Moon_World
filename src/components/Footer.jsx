import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { useSiteSettings } from '../context/SiteSettingsContext';

export default function Footer() {
  const { settings } = useSiteSettings();

  return (
    <footer className="site-footer">
      <div className="footer-card">
        <div className="footer-card-top">
          <span className="footer-brand">{settings.brandName}</span>
          <span className="footer-est">EST. 2026</span>
        </div>

        <div className="footer-divider" aria-hidden="true" />

        <h2 className="footer-headline">
          <span>A universe,</span>
          <span className="footer-headline-accent">made of curiosity.</span>
        </h2>

        <p className="footer-roles">AI Engineer · Developer · Creator · Forever Curious</p>

        <Link to="/about" className="footer-explore-link">
          <span>Explore My World</span>
          <ArrowUpRight size={16} aria-hidden="true" />
        </Link>
      </div>
    </footer>
  );
}
