import React from 'react';
import Skills from '../components/Skills';

export default function SkillsPage() {
  return (
    <div className="page-view">
      <div className="page-hero-header">
        <div className="page-hero-inner">
          <div className="page-breadcrumb">Skills</div>
          <h1 className="page-hero-title">
            Technical <span className="sakura-gradient-text">Arsenal</span>
          </h1>
          <p className="page-hero-subtitle">
            Languages, frameworks, tools and platforms I work with every day.
          </p>
        </div>
      </div>
      <Skills />
    </div>
  );
}
