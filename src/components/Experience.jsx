import React from 'react';
import { Briefcase, Calendar, CheckCircle2, Sparkles, Building2 } from 'lucide-react';
import { experienceData } from '../data/portfolioData';

export default function Experience() {
  return (
    <section className="section-wrap experience-section" id="experience">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow-pill">
            <Sparkles size={14} className="eyebrow-icon" />
            <span>Journey &amp; Milestones</span>
          </div>
          <h2 className="section-title">
            Internships &amp; <span className="sakura-gradient-text">leadership roles</span>
          </h2>
          <p className="section-subtitle">
            Hands-on technical engineering experience, cross-functional team direction, and campus community leadership.
          </p>
        </div>

        {/* Timeline Container */}
        <div className="experience-timeline">
          <div className="timeline-spine-line" />

          {experienceData.map((item, idx) => (
            <div key={idx} className="timeline-item-row">
              {/* Timeline Center Node */}
              <div className="timeline-node">
                <div className="timeline-node-dot" />
              </div>

              {/* Timeline Card */}
              <div className="timeline-card">
                <div className="timeline-card-header">
                  <div className="timeline-role-group">
                    <h3 className="timeline-role-title">{item.role}</h3>
                    <div className="timeline-org-row">
                      <Building2 size={15} className="timeline-org-icon" />
                      <span className="timeline-org-name">{item.organization}</span>
                      <span className="timeline-type-badge">{item.type}</span>
                    </div>
                  </div>
                  <div className="timeline-period-badge">
                    <Calendar size={13} />
                    <span>{item.period}</span>
                  </div>
                </div>

                <p className="timeline-description">{item.description}</p>

                <div className="timeline-highlights-list">
                  {item.highlights.map((bullet, bIdx) => (
                    <div key={bIdx} className="timeline-bullet-item">
                      <CheckCircle2 size={14} className="bullet-check-icon" />
                      <span>{bullet}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
