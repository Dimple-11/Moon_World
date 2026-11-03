import React from 'react';
import { Trophy, Award, Terminal, Sparkles, TrendingUp, Target, Code } from 'lucide-react';
import { achievementsData, personalInfo } from '../data/portfolioData';

export default function Achievements() {
  const badgeIcons = [Trophy, Award, Terminal, Target];

  return (
    <section className="section-wrap achievements-section" id="achievements">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow-pill">
            <Sparkles size={14} className="eyebrow-icon" />
            <span>Honors &amp; Recognitions</span>
          </div>
          <h2 className="section-title">
            Hackathon milestones &amp; <span className="sakura-gradient-text">competitions</span>
          </h2>
          <p className="section-subtitle">
            Demonstrated performance in high-pressure national hackathons, nationwide competitions, and algorithmic problem solving.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="achievements-grid">
          {achievementsData.map((ach, idx) => {
            const Icon = badgeIcons[idx] || Trophy;
            return (
              <div key={idx} className="achievement-card">
                <div className="achievement-card-top">
                  <div className="achievement-icon-box">
                    <Icon size={22} />
                  </div>
                  <div className="achievement-pill-badge">{ach.category}</div>
                  <span className="anime-achievement-flourish">✦ 🌸 ✦</span>
                </div>

                <div className="achievement-event-title">{ach.event}</div>
                <h3 className="achievement-main-title">{ach.title}</h3>
                <p className="achievement-desc-text">{ach.description}</p>

                <div className="achievement-card-bottom">
                  <span className="achievement-year-tag">{ach.year}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Competitive Programming Callout Bar */}
        <div className="cp-showcase-strip">
          <div className="cp-strip-left">
            <div className="cp-icon-wrap">
              <Code size={24} />
            </div>
            <div>
              <h3 className="cp-strip-heading">Algorithmic Problem Solving</h3>
              <p className="cp-strip-desc">
                Actively training on Codeforces and LeetCode to sharpen complexity analysis, graph invariants, and dynamic programming.
              </p>
            </div>
          </div>

          <div className="cp-strip-actions">
            <a
              href={personalInfo.github}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
            >
              <span>Explore Code Repositories</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
