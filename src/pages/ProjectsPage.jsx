import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, ExternalLink } from 'lucide-react';
import { GithubIcon } from '../components/BrandIcons';
import { projectsData } from '../data/portfolioData';

const ALL_CATEGORIES = ['All', ...Array.from(new Set(projectsData.map(p => p.category)))];

export default function ProjectsPage() {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filtered = projectsData.filter(p => {
    const matchCat = activeCategory === 'All' || p.category === activeCategory;
    const q = query.toLowerCase();
    const matchQ = !q || p.title.toLowerCase().includes(q) || p.shortDesc.toLowerCase().includes(q) || p.tags.some(t => t.toLowerCase().includes(q));
    return matchCat && matchQ;
  });

  return (
    <div className="page-view">
      <div className="page-hero-header">
        <div className="page-hero-inner">
          <div className="page-breadcrumb">Projects</div>
          <h1 className="page-hero-title">
            Engineering <span className="sakura-gradient-text">Creations</span>
          </h1>
          <p className="page-hero-subtitle">
            A curated collection of AI, full-stack, and creative technology projects.
          </p>
        </div>
      </div>

      <section className="section-wrap">
        <div className="section-container">
          {/* Search + Filter */}
          <div className="projects-filter-bar">
            <div className="projects-search-wrap">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                className="projects-search-input"
                placeholder="Search projects…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
            </div>
            <div className="projects-category-filters">
              {ALL_CATEGORIES.map(cat => (
                <button
                  key={cat}
                  className={`filter-chip ${activeCategory === cat ? 'is-active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Projects Grid */}
          {filtered.length === 0 ? (
            <div className="projects-empty-state">
              <p>No projects match your search. Try a different keyword.</p>
            </div>
          ) : (
            <div className="projects-card-grid">
              {filtered.map(proj => (
                <div key={proj.id} className="project-showcase-card">
                  <div className="project-card-meta-row">
                    <span className="project-cat-tag">{proj.category}</span>
                    <span className="project-metrics-pill">{proj.metrics}</span>
                  </div>
                  <h3 className="project-heading">{proj.title}</h3>
                  <p className="project-subheading">{proj.subtitle}</p>
                  <p className="project-summary-text">{proj.shortDesc}</p>
                  <div className="project-tags-cluster">
                    {proj.tags.slice(0, 5).map((t, i) => (
                      <span key={i} className="project-mini-tag">{t}</span>
                    ))}
                  </div>
                  <div className="project-card-footer">
                    <Link to={`/projects/${proj.slug}`} className="project-details-btn">
                      <span>Case Study</span>
                      <ArrowRight size={14} />
                    </Link>
                    {proj.github && (
                      <a href={proj.github} target="_blank" rel="noreferrer" className="project-icon-link" aria-label="GitHub">
                        <GithubIcon size={15} />
                      </a>
                    )}
                    {proj.live && (
                      <a href={proj.live} target="_blank" rel="noreferrer" className="project-icon-link" aria-label="Live demo">
                        <ExternalLink size={15} />
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
