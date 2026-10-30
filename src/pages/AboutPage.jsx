import React from 'react';
import About from '../components/About';

export default function AboutPage() {
  return (
    <div className="page-view">
      <div className="page-hero-header">
        <div className="page-hero-inner">
          <div className="page-breadcrumb">About</div>
          <h1 className="page-hero-title">
            Behind the <span className="sakura-gradient-text">Pixels</span>
          </h1>
          <p className="page-hero-subtitle">
            The story of a curious technologist, creative coder, and relentless learner.
          </p>
        </div>
      </div>
      <About />
    </div>
  );
}
