import React from 'react';
import { GraduationCap, Brain, Compass, Sparkles, Code2, Heart, Award, ArrowUpRight } from 'lucide-react';
import { aboutHighlights, personalInfo } from '../data/portfolioData';

export default function About() {
  const iconMap = [GraduationCap, Brain, Compass, Sparkles];

  return (
    <section className="section-wrap about-section" id="about">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow-pill">
            <Sparkles size={14} className="eyebrow-icon" />
            <span>Behind the Pixels</span>
          </div>
          <h2 className="section-title">
            Engineering software with <span className="sakura-gradient-text">curiosity &amp; craft</span>
          </h2>
          <p className="section-subtitle">
            I'm an Information Technology undergraduate at Indira Gandhi Delhi Technical University for Women (IGDTUW),
            graduating in 2028. I bridge analytical machine intelligence with intuitive, human-centered digital experiences.
          </p>
        </div>

        {/* Narrative & Profile Overview */}
        <div className="about-overview-card">
          <div className="about-bio-column">
            <h3 className="about-bio-heading">
              Curious by nature, driven by impact.
            </h3>
            <p className="about-bio-text">
              My journey in technology lives at the intersection of mathematical reasoning and user-facing design.
              Whether I am optimizing gradient-boosted decision trees for anomaly detection, wiring up retrieval-augmented
              generation (RAG) pipelines, or fine-tuning interactive 60 FPS canvas graphics, I care deeply about how systems
              feel to the humans who interact with them.
            </p>
            <p className="about-bio-text">
              Beyond standard coursework, I actively compete in national hackathons (like InnoVortex 2.0 and MOVES 2026),
              tackle algorithmic challenges on Codeforces and LeetCode, and contribute to media and technology development.
            </p>

            <div className="about-tags-row">
              <span className="about-chip">#ArtificialIntelligence</span>
              <span className="about-chip">#FullStackDevelopment</span>
              <span className="about-chip">#GenerativeAI</span>
              <span className="about-chip">#WomenInTech</span>
              <span className="about-chip">#CompetitiveProgramming</span>
            </div>
          </div>

          <div className="about-quick-specs">
            {/* Anime Study Accent */}
            <div className="about-anime-study-card">
              <div className="study-cat-illustration">
                <svg width="60" height="60" viewBox="0 0 80 80" fill="none">
                  <ellipse cx="40" cy="55" rx="26" ry="16" fill="#FDFBFF" stroke="#D8C8E8" strokeWidth="1.5" />
                  <path d="M 28 35 Q 20 12 34 22 Z" fill="#FFFFFF" stroke="#D8C8E8" strokeWidth="1.5" />
                  <path d="M 52 35 Q 60 12 46 22 Z" fill="#FFFFFF" stroke="#D8C8E8" strokeWidth="1.5" />
                  <circle cx="40" cy="40" r="18" fill="#FFFFFF" stroke="#D8C8E8" strokeWidth="1.5" />
                  <path d="M 22 42 C 22 25 58 25 58 42" stroke="#E9A6C4" strokeWidth="3.5" strokeLinecap="round" fill="none" />
                  <rect x="18" y="38" width="7" height="13" rx="3" fill="#E9A6C4" />
                  <rect x="55" y="38" width="7" height="13" rx="3" fill="#E9A6C4" />
                  <path d="M 33 40 Q 37 36 41 40" stroke="#5B4A78" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                  <path d="M 45 40 Q 49 36 53 40" stroke="#5B4A78" strokeWidth="1.8" fill="none" strokeLinecap="round" />
                  <circle cx="34" cy="45" r="3" fill="#FFAEC9" opacity="0.6" />
                  <circle cx="52" cy="45" r="3" fill="#FFAEC9" opacity="0.6" />
                  <path d="M 64 22 C 67 20 70 24 68 28 C 66 26 63 24 64 22 Z" fill="#FFAEC9" />
                </svg>
              </div>
              <span className="study-caption">"Code, algorithms, headphones &amp; curiosity." 🌸</span>
            </div>

            <div className="spec-item">
              <span className="spec-label">University</span>
              <span className="spec-value">IGDTUW, New Delhi</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Degree &amp; Major</span>
              <span className="spec-value">B.Tech in Information Technology</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Graduation Year</span>
              <span className="spec-value">Class of 2028</span>
            </div>
            <div className="spec-item">
              <span className="spec-label">Key Focus</span>
              <span className="spec-value">AI/ML, Backend, Applied LLMs</span>
            </div>
          </div>
        </div>

        {/* 4 Themed Info Cards */}
        <div className="about-cards-grid">
          {aboutHighlights.map((item, idx) => {
            const Icon = iconMap[idx] || Code2;
            return (
              <div
                key={idx}
                className="about-feature-card"
                id={item.title === 'Education' ? 'education' : undefined}
              >
                <div className="feature-card-header">
                  <div className="feature-icon-wrapper">
                    <Icon size={20} />
                  </div>
                  <span className="feature-tag">{item.tag}</span>
                </div>
                <h4 className="feature-title">{item.title}</h4>
                <div className="feature-subtitle">{item.subtitle}</div>
                <div className="feature-institution">{item.institution}</div>
                <p className="feature-desc">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
