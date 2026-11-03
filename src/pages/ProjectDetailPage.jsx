import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ExternalLink, Tag, Calendar, Award } from 'lucide-react';
import { GithubIcon } from '../components/BrandIcons';
import { projectsData } from '../data/portfolioData';

export default function ProjectDetailPage() {
  const { slug } = useParams();
  const project = projectsData.find(p => p.slug === slug);

  if (!project) {
    return (
      <div className="page-view not-found-view">
        <div className="not-found-content">
          <h1 className="not-found-code">404</h1>
          <p className="not-found-msg">Project not found.</p>
          <Link to="/projects" className="btn btn-primary">← Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-view">
      <div className="page-hero-header detail-hero">
        <div className="page-hero-inner">
          <Link to="/projects" className="back-link">
            <ArrowLeft size={16} />
            <span>All Projects</span>
          </Link>
          <div className="detail-cat-row">
            <span className="project-cat-tag">{project.category}</span>
            <span className="project-metrics-pill">{project.metrics}</span>
          </div>
          <h1 className="page-hero-title">{project.title}</h1>
          <p className="page-hero-subtitle">{project.subtitle}</p>
          <div className="detail-action-row">
            {project.github && (
              <a href={project.github} target="_blank" rel="noopener noreferrer" className="btn btn-secondary btn-sm">
                <GithubIcon size={15} />
                <span>View Source</span>
              </a>
            )}
            {project.live && (
              <a href={project.live} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                <ExternalLink size={15} />
                <span>Live Demo</span>
              </a>
            )}
          </div>
        </div>
      </div>

      <section className="section-wrap">
        <div className="section-container project-detail-content">
          {/* Overview */}
          <div className="detail-block">
            <h2 className="detail-block-title">Project Overview</h2>
            <p className="detail-block-text">{project.description || project.shortDesc}</p>
          </div>

          {/* Tech Stack */}
          <div className="detail-block">
            <h2 className="detail-block-title">
              <Tag size={18} className="detail-icon" /> Tech Stack
            </h2>
            <div className="project-tags-cluster detail-tags">
              {project.tags.map((tag, i) => (
                <span key={i} className="project-mini-tag">{tag}</span>
              ))}
            </div>
          </div>

          {/* Key Features */}
          {project.highlights && project.highlights.length > 0 && (
            <div className="detail-block">
              <h2 className="detail-block-title">
                <Award size={18} className="detail-icon" /> Key Highlights
              </h2>
              <ul className="detail-highlights-list">
                {project.highlights.map((h, i) => (
                  <li key={i} className="detail-highlight-item">
                    <span className="detail-bullet" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Navigation to other projects */}
          <div className="detail-nav-strip">
            <Link to="/projects" className="btn btn-secondary">
              <ArrowLeft size={15} />
              <span>Back to All Projects</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
