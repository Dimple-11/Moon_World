import React from 'react';
import BeyondCode from '../components/BeyondCode';

export default function BeyondCodePage() {
  return (
    <div className="page-view">
      <div className="page-hero-header">
        <div className="page-hero-inner">
          <div className="page-breadcrumb">Beyond Code</div>
          <h1 className="page-hero-title">
            The <span className="sakura-gradient-text">Creative Playground</span>
          </h1>
          <p className="page-hero-subtitle">
            Art, media, music, and curiosity — the human side of a developer.
          </p>
        </div>
      </div>
      <BeyondCode />
    </div>
  );
}
