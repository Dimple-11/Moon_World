import React, { useState } from 'react';
import { Terminal, Layout, Server, Database, BrainCircuit, Wrench, Sparkles, CheckCircle2 } from 'lucide-react';
import { skillsData } from '../data/portfolioData';

export default function Skills() {
  const [activeCategory, setActiveCategory] = useState('All');

  const categoryIcons = {
    'Programming Languages': Terminal,
    'Frontend Development': Layout,
    'Backend & APIs': Server,
    'Databases & Storage': Database,
    'AI / ML & Data Science': BrainCircuit,
    'Tools & DevOps': Wrench
  };

  const categories = ['All', ...skillsData.map((s) => s.category)];

  const filteredData =
    activeCategory === 'All'
      ? skillsData
      : skillsData.filter((s) => s.category === activeCategory);

  return (
    <section className="section-wrap skills-section" id="skills">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow-pill">
            <Sparkles size={14} className="eyebrow-icon" />
            <span>Technical Arsenal</span>
          </div>
          <h2 className="section-title">
            Technologies &amp; frameworks I <span className="sakura-gradient-text">work with</span>
          </h2>
          <p className="section-subtitle">
            A comprehensive overview of my tools, languages, and frameworks for engineering intelligent systems and fluid interfaces.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="skills-filter-row">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`skills-filter-btn ${activeCategory === cat ? 'is-active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Categorized Skills Grid */}
        <div className="skills-cards-grid">
          {filteredData.map((catItem, idx) => {
            const Icon = categoryIcons[catItem.category] || Wrench;
            return (
              <div
                key={idx}
                className="skill-category-card"
                id={catItem.category === 'Tools & DevOps' ? 'software' : undefined}
              >
                <div className="skill-card-top">
                  <div className="skill-category-icon-box">
                    <Icon size={22} />
                  </div>
                  <div>
                    <h3 className="skill-category-title">{catItem.category}</h3>
                    <p className="skill-category-desc">{catItem.description}</p>
                  </div>
                </div>

                <div className="skills-tags-cluster">
                  {catItem.skills.map((skill, sIdx) => (
                    <div
                      key={sIdx}
                      className={`skill-badge ${skill.highlight ? 'is-highlight' : ''}`}
                    >
                      <CheckCircle2 size={13} className="skill-badge-check" />
                      <span className="skill-badge-name">{skill.name}</span>
                      <span className="skill-badge-level">{skill.level}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
