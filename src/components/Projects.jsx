import React, { useState } from 'react';
import { Sparkles, ExternalLink, ArrowRight, Layers, FileCode, CheckCircle } from 'lucide-react';
import { GithubIcon } from './BrandIcons';
import { projectsData } from '../data/portfolioData';
import ProjectModal from './ProjectModal';

export default function Projects() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeProjectModal, setActiveProjectModal] = useState(null);

  const categories = ['All', 'AI / ML', 'Full Stack', 'Backend', 'NLP', 'Data Science'];

  const filteredProjects =
    selectedCategory === 'All'
      ? projectsData
      : projectsData.filter((p) => p.category === selectedCategory);

  return (
    <section className="section-wrap projects-section" id="projects">
      <div className="section-container">
        {/* Section Header */}
        <div className="section-header">
          <div className="section-eyebrow-pill">
            <Sparkles size={14} className="eyebrow-icon" />
            <span>Featured Creations</span>
          </div>
          <h2 className="section-title">
            Intelligent systems &amp; <span className="sakura-gradient-text">full-stack products</span>
          </h2>
          <p className="section-subtitle">
            A curated selection of real-world machine learning architectures, automated intelligence tools, and resilient backend systems.
          </p>
        </div>

        {/* Filter Category Pills */}
        <div className="projects-filter-bar">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`project-filter-chip ${selectedCategory === cat ? 'is-active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Projects Grid */}
        <div className="projects-card-grid">
          {filteredProjects.map((proj) => (
            <div
              key={proj.id}
              className="project-showcase-card"
              onClick={() => setActiveProjectModal(proj)}
            >
              {/* Card Header */}
              <div className="project-card-meta-row">
                <span className="project-cat-tag">{proj.category}</span>
                <span className="project-metrics-pill">{proj.metrics}</span>
              </div>

              {/* Title & Short Description */}
              <h3 className="project-heading">{proj.title}</h3>
              <p className="project-subheading">{proj.subtitle}</p>
              <p className="project-summary-text">{proj.shortDesc}</p>

              {/* Tech Tags */}
              <div className="project-tags-cluster">
                {proj.tags.slice(0, 5).map((t, tidx) => (
                  <span key={tidx} className="project-mini-tag">{t}</span>
                ))}
              </div>

              {/* Card Footer Actions */}
              <div className="project-card-footer">
                <button
                  className="project-details-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveProjectModal(proj);
                  }}
                >
                  <span>Case Study</span>
                  <ArrowRight size={14} />
                </button>

                <div className="project-external-links">
                  <a
                    href={proj.github}
                    target="_blank"
                    rel="noreferrer"
                    className="project-link-icon"
                    aria-label={`View ${proj.title} on GitHub`}
                    onClick={(e) => e.stopPropagation()}
                    title="View GitHub Repository"
                  >
                    <GithubIcon size={17} />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Case Study Modal */}
      {activeProjectModal && (
        <ProjectModal
          project={activeProjectModal}
          onClose={() => setActiveProjectModal(null)}
        />
      )}
    </section>
  );
}
