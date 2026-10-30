import React from 'react';
import Achievements from '../components/Achievements';

export default function AchievementsPage() {
  return (
    <div className="page-view">
      <div className="page-hero-header">
        <div className="page-hero-inner">
          <div className="page-breadcrumb">Honors</div>
          <h1 className="page-hero-title">
            Achievements & <span className="sakura-gradient-text">Recognition</span>
          </h1>
          <p className="page-hero-subtitle">
            Hackathons, competitions, and milestones I'm proud of.
          </p>
        </div>
      </div>
      <Achievements />
    </div>
  );
}
