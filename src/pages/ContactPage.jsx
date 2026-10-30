import React from 'react';
import Contact from '../components/Contact';

export default function ContactPage() {
  return (
    <div className="page-view">
      <div className="page-hero-header">
        <div className="page-hero-inner">
          <div className="page-breadcrumb">Contact</div>
          <h1 className="page-hero-title">
            Let's <span className="sakura-gradient-text">Connect</span>
          </h1>
          <p className="page-hero-subtitle">
            Open to SDE & AI/ML roles, collaborations, and creative conversations.
          </p>
        </div>
      </div>
      <Contact />
    </div>
  );
}
