import React from 'react';
import { Sparkles, Palette, MessageSquareText, Users, Compass, Megaphone, ArrowUpRight } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';

export default function BeyondCode() {
  const creativePillars = [
    {
      icon: Palette,
      tag: 'Creative Direction',
      title: 'Digital Media & Visual Experiences',
      desc: 'Merging design sensibilities with code. Crafting cohesive visual identities, responsive branding, and aesthetic digital media at Aevona Solutions.',
      accent: 'Media & Tech'
    },
    {
      icon: MessageSquareText,
      tag: 'Content & Editorial',
      title: 'Technical Storytelling',
      desc: 'Leading content initiatives at TechNeeds. Demystifying complex machine learning and engineering concepts into engaging, accessible narratives for builders.',
      accent: 'Leadership'
    },
    {
      icon: Users,
      tag: 'Community Growth',
      title: 'Campus Leadership & Mentorship',
      desc: 'Inspiring peers as an Unstop Campus Ambassador. Organizing hackathon briefings, connecting students to opportunities, and cultivating engineering curiosity.',
      accent: 'Community'
    }
  ];

  return (
    <section className="section-wrap beyond-section" id="beyond">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow-pill">
            <Sparkles size={14} className="eyebrow-icon" />
            <span>Beyond Code</span>
          </div>
          <h2 className="section-title">
            "Technology is my craft. <span className="sakura-gradient-text">Creativity is my playground."</span>
          </h2>
          <p className="section-subtitle">
            Great engineering does not exist in isolation. I bring together technical depth, visual storytelling, and empathetic communication.
          </p>
        </div>

        {/* Pillars Grid */}
        <div className="beyond-cards-grid">
          {creativePillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div key={idx} className="beyond-card">
                <div className="beyond-card-header">
                  <div className="beyond-icon-box">
                    <Icon size={22} />
                  </div>
                  <span className="beyond-tag-badge">{pillar.accent}</span>
                </div>

                <div className="beyond-category-label">{pillar.tag}</div>
                <h3 className="beyond-card-title">{pillar.title}</h3>
                <p className="beyond-card-desc">{pillar.desc}</p>
              </div>
            );
          })}
        </div>

        {/* Dynamic "Currently Exploring" Strip right below */}
        <div className="currently-exploring-container">
          <div className="exploring-header">
            <div className="exploring-title-wrap">
              <Compass size={18} className="exploring-icon" />
              <h3 className="exploring-title">Currently Exploring &amp; Experimenting</h3>
            </div>
            <span className="exploring-subtext">Active research frontiers</span>
          </div>

          <div className="exploring-tags-grid">
            <div className="exploring-chip">
              <span className="chip-bullet" />
              <span>Multi-Agent LLM Orchestration</span>
            </div>
            <div className="exploring-chip">
              <span className="chip-bullet" />
              <span>Low-Latency RAG Retrieval Pipelines</span>
            </div>
            <div className="exploring-chip">
              <span className="chip-bullet" />
              <span>Autonomous AI Tool Use &amp; Code Synthesis</span>
            </div>
            <div className="exploring-chip">
              <span className="chip-bullet" />
              <span>High-DPI WebGL &amp; Canvas Shaders</span>
            </div>
            <div className="exploring-chip">
              <span className="chip-bullet" />
              <span>Distributed Asynchronous Queues</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
