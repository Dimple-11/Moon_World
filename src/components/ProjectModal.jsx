import React, { useEffect } from 'react';
import { X, ExternalLink, Sparkles, Layers, CheckCircle } from 'lucide-react';
import { GithubIcon } from './BrandIcons';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="project-modal-overlay" onClick={onClose}>
      <div
        className="project-modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Modal Header */}
        <div className="modal-header">
          <div className="modal-badge-group">
            <span className="modal-category-badge">{project.category}</span>
            <span className="modal-metrics-badge">{project.metrics}</span>
          </div>
          <button
            onClick={onClose}
            className="modal-close-btn"
            aria-label="Close case study"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Title & Subtitle */}
        <h2 id="modal-title" className="modal-title">{project.title}</h2>
        <p className="modal-subtitle">{project.subtitle}</p>

        {/* Tech Stack Pills */}
        <div className="modal-tags-list">
          {project.tags.map((tag, i) => (
            <span key={i} className="modal-tag-pill">{tag}</span>
          ))}
        </div>

        {/* Case Study Sections */}
        <div className="modal-body-sections">
          <div className="modal-section-card">
            <div className="modal-section-header">
              <span className="modal-section-dot problem-dot" />
              <h3 className="modal-section-heading">Problem Statement</h3>
            </div>
            <p className="modal-section-text">{project.problem}</p>
          </div>

          <div className="modal-section-card">
            <div className="modal-section-header">
              <span className="modal-section-dot solution-dot" />
              <h3 className="modal-section-heading">Proposed Solution</h3>
            </div>
            <p className="modal-section-text">{project.solution}</p>
          </div>

          <div className="modal-section-card">
            <div className="modal-section-header">
              <Layers size={17} className="modal-section-icon" />
              <h3 className="modal-section-heading">System Architecture</h3>
            </div>
            <div className="modal-architecture-diagram">
              <code>{project.architecture}</code>
            </div>
          </div>

          <div className="modal-section-card">
            <div className="modal-section-header">
              <CheckCircle size={17} className="modal-section-icon highlight-icon" />
              <h3 className="modal-section-heading">Key Contribution &amp; Implementation</h3>
            </div>
            <p className="modal-section-text">{project.myContribution}</p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="modal-footer">
          <a
            href={project.github}
            target="_blank"
            rel="noreferrer"
            className="btn btn-primary"
          >
            <GithubIcon size={16} />
            <span>View Source on GitHub</span>
          </a>

          {project.demo && (
            <a
              href={project.demo}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary"
            >
              <ExternalLink size={16} />
              <span>Live Demonstration</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
