import React from 'react';
import Experience from '../components/Experience';

export default function ExperiencePage() {
  return (
    <div className="page-view">
      <div className="page-hero-header">
        <div className="page-hero-inner">
          <div className="page-breadcrumb">Experience</div>
          <h1 className="page-hero-title">
            My <span className="sakura-gradient-text">Journey</span>
          </h1>
          <p className="page-hero-subtitle">
            Internships, roles, and milestones that shaped who I am as a developer.
          </p>
        </div>
      </div>
      <Experience />
    </div>
  );
}
