import React, { useRef } from 'react';
import InteractiveCharacter from './InteractiveCharacter';
import { ArrowUpRight, Sparkles, Send, Award, Compass } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export default function Hero() {
  const characterAreaRef = useRef(null);

  return (
    <section className="hero-section" id="hero">
      <div className="hero-container">
        {/* Left Column: Introduction (48% width) */}
        <div className="hero-left">
          {/* Eyebrow and Status */}
          <div className="hero-eyebrow-row">
            <div className="hero-eyebrow">
              <Sparkles size={13} className="eyebrow-icon" />
              <span>Information Technology @ IGDTUW '28</span>
            </div>
            <div className="hero-status-pill">
              <span className="status-ping" />
              <span>Available for SDE &amp; AI/ML Roles</span>
            </div>
          </div>

          {/* Main Headline */}
          <h1 className="hero-title">
            Building intelligent things with a <span className="sakura-gradient-text">little imagination</span>.
          </h1>

          {/* Personal Introduction Paragraph */}
          <p className="hero-description">
            Hi, I'm <strong className="hero-highlight-name">Dimple</strong>, an Information Technology
            undergraduate at <strong>IGDTUW</strong>. I enjoy building AI-powered applications, full-stack
            products, and creative digital experiences that solve real-world problems.
          </p>

          {/* Call-to-action buttons */}
          <div className="hero-cta-group">
            <a href="#projects" className="btn btn-primary">
              <span>View Projects</span>
              <ArrowUpRight size={17} />
            </a>
            <a href="#contact" className="btn btn-secondary">
              <Send size={15} />
              <span>Contact Me</span>
            </a>
          </div>

          {/* Credibility highlights */}
          <div className="hero-quick-stats">
            <div className="stat-pill">
              <Award size={14} className="stat-icon" />
              <span>Top 10 InnoVortex Finalist</span>
            </div>
            <div className="stat-pill">
              <Sparkles size={14} className="stat-icon" />
              <span>MOVES 2026 Top 200</span>
            </div>
            <div className="stat-pill">
              <Compass size={14} className="stat-icon" />
              <span>Full-Stack &amp; Applied AI</span>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive Character Animation (52% width) */}
        <div className="hero-right">
          <div className="character-stage" ref={characterAreaRef}>
            <div className="character-ambient-glow" />
            <InteractiveCharacter
              containerRef={characterAreaRef}
              idleFrame={0}
              className="hero-character-instance"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
