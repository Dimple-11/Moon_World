import React, { useState, useEffect } from 'react';
import { Image, Sparkles, X, ChevronLeft, ChevronRight, Calendar, Tag } from 'lucide-react';
import { initialGallery } from '../../server/seedData.js';

const CATEGORIES = ['All', 'Hackathons', 'Tech & Setups', 'Campus Life', 'Creative Artwork', 'Aesthetic'];

export default function GalleryPage() {
  const [photos, setPhotos] = useState(initialGallery);
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeLightboxIndex, setActiveLightboxIndex] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        setLoading(true);
        const res = await fetch(`/api/gallery?category=${activeCategory}`);
        const data = await res.json();
        if (data.success && data.items) {
          setPhotos(data.items);
        }
      } catch (e) {
        console.warn('Using seeded gallery fallback:', e);
      } finally {
        setLoading(false);
      }
    }
    fetchPhotos();
  }, [activeCategory]);

  const activePhoto = activeLightboxIndex !== null ? photos[activeLightboxIndex] : null;

  const nextPhoto = (e) => {
    e?.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex + 1) % photos.length);
    }
  };

  const prevPhoto = (e) => {
    e?.stopPropagation();
    if (activeLightboxIndex !== null) {
      setActiveLightboxIndex((activeLightboxIndex - 1 + photos.length) % photos.length);
    }
  };

  return (
    <div className="page-view gallery-universe-view">
      {/* Page Header */}
      <div className="page-hero-header scrapbook-hero">
        <div className="page-hero-inner">
          <div className="page-breadcrumb">Visual Scrapbook</div>
          <h1 className="page-hero-title">
            The <span className="sakura-gradient-text">Memory Gallery</span>
          </h1>
          <p className="page-hero-subtitle">
            A curated visual scrapbook of hackathon sprints, IGDTUW campus moments, late-night code setups, and creative aesthetic studies.
          </p>

          <div className="editorial-ornament">
            <span className="ornament-line" />
            <span className="ornament-star">✿ ❀ ✿</span>
            <span className="ornament-line" />
          </div>
        </div>
      </div>

      <section className="section-wrap">
        <div className="section-container">
          {/* Category Filter Pills */}
          <div className="gallery-filter-tabs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className={`gallery-filter-pill ${activeCategory === cat ? 'is-active' : ''}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Scrapbook Masonry Grid */}
          <div className="scrapbook-grid">
            {photos.map((photo, idx) => (
              <div
                key={photo._id || idx}
                className="scrapbook-card"
                onClick={() => setActiveLightboxIndex(idx)}
              >
                <div className="scrapbook-photo-frame">
                  <img src={photo.imageUrl} alt={photo.title} className="scrapbook-img" loading="lazy" />
                  <div className="scrapbook-vintage-tape" />
                  {photo.isFeatured && (
                    <span className="scrapbook-stamp">Featured ★</span>
                  )}
                </div>

                <div className="scrapbook-caption-block">
                  <span className="scrapbook-cat-tag">{photo.category}</span>
                  <h3 className="scrapbook-photo-title">{photo.title}</h3>
                  <p className="scrapbook-photo-desc">{photo.description}</p>
                  <div className="scrapbook-date-badge">
                    <Calendar size={11} /> {photo.dateTaken || '2025'}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {photos.length === 0 && !loading && (
            <div className="gallery-empty-state">
              <Image size={42} className="empty-icon" />
              <p>No photos in this scrapbook chapter yet.</p>
            </div>
          )}
        </div>
      </section>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div className="lightbox-backdrop" onClick={() => setActiveLightboxIndex(null)}>
          <button
            className="lightbox-close-btn"
            onClick={() => setActiveLightboxIndex(null)}
            aria-label="Close photo preview"
          >
            <X size={22} />
          </button>

          <button
            className="lightbox-nav-btn prev"
            onClick={prevPhoto}
            aria-label="Previous photo"
          >
            <ChevronLeft size={28} />
          </button>

          <div className="lightbox-card" onClick={(e) => e.stopPropagation()}>
            <div className="lightbox-image-wrap">
              <img src={activePhoto.imageUrl} alt={activePhoto.title} className="lightbox-img" />
            </div>
            <div className="lightbox-meta-bar">
              <div>
                <span className="lightbox-cat">{activePhoto.category} · {activePhoto.dateTaken || '2025'}</span>
                <h3 className="lightbox-title">{activePhoto.title}</h3>
                <p className="lightbox-desc">{activePhoto.description}</p>
              </div>
              <span className="lightbox-counter">
                {activeLightboxIndex + 1} / {photos.length}
              </span>
            </div>
          </div>

          <button
            className="lightbox-nav-btn next"
            onClick={nextPhoto}
            aria-label="Next photo"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      )}
    </div>
  );
}
