import React from 'react';
import { Award, ExternalLink, Calendar } from 'lucide-react';
import { certificationsData } from '../data/portfolioData';

export default function CertificationsPage() {
  return (
    <div className="page-view">
      <div className="page-hero-header">
        <div className="page-hero-inner">
          <div className="page-breadcrumb">Certifications</div>
          <h1 className="page-hero-title">
            Learning <span className="sakura-gradient-text">Credentials</span>
          </h1>
          <p className="page-hero-subtitle">
            Formal certifications and courses completed across AI, cloud, and development.
          </p>
        </div>
      </div>

      <section className="section-wrap">
        <div className="section-container">
          {(!certificationsData || certificationsData.length === 0) ? (
            <div className="certifications-empty">
              <Award size={48} className="certs-empty-icon" />
              <p>Certifications coming soon — always learning!</p>
            </div>
          ) : (
            <div className="certifications-grid">
              {certificationsData.map((cert, i) => (
                <div key={i} className="cert-card">
                  <div className="cert-card-icon">
                    <Award size={22} />
                  </div>
                  <div className="cert-card-body">
                    <h3 className="cert-title">{cert.title}</h3>
                    <p className="cert-issuer">{cert.issuer}</p>
                    {cert.date && (
                      <span className="cert-date">
                        <Calendar size={12} /> {cert.date}
                      </span>
                    )}
                  </div>
                  {cert.link && (
                    <a href={cert.link} target="_blank" rel="noreferrer" className="cert-link-btn" aria-label="View certificate">
                      <ExternalLink size={14} />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
