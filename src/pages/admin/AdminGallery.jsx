import React, { useState, useEffect } from 'react';
import { Image, PlusCircle, Trash2, Sparkles, Check, X, Calendar, Tag } from 'lucide-react';

const CATEGORIES = ['Hackathons', 'Tech & Setups', 'Campus Life', 'Creative Artwork', 'Aesthetic'];

export default function AdminGallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [category, setCategory] = useState('Hackathons');
  const [dateTaken, setDateTaken] = useState('');
  const [isFeatured, setIsFeatured] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const fetchGallery = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/gallery');
      const data = await res.json();
      if (data.success) {
        setItems(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGallery();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !imageUrl.trim()) return;

    try {
      setSubmitting(true);
      const res = await fetch('/api/gallery/admin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          title,
          description,
          imageUrl,
          category,
          dateTaken: dateTaken || '2025',
          isFeatured
        })
      });

      const data = await res.json();
      if (data.success) {
        setShowModal(false);
        setTitle('');
        setDescription('');
        setImageUrl('');
        fetchGallery();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm('Delete this photograph from the scrapbook?')) return;

    try {
      await fetch(`/api/gallery/admin/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      setItems(prev => prev.filter(i => i._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="admin-page-container">
      <div className="admin-page-header-row">
        <div>
          <h1 className="admin-page-title">Photo Scrapbook Management</h1>
          <p className="admin-page-subtitle">Upload and organize campus memories, hackathon photos, aesthetics, and creative artwork.</p>
        </div>

        <button onClick={() => setShowModal(true)} className="btn btn-primary">
          <PlusCircle size={16} />
          <span>Add Photograph</span>
        </button>
      </div>

      {/* Gallery Grid */}
      <div className="admin-gallery-grid">
        {loading ? (
          <div className="admin-loading-state">
            <p>Loading scrapbook memories...</p>
          </div>
        ) : items.length === 0 ? (
          <div className="admin-empty-state">
            <Image size={42} className="empty-icon" />
            <h3>Your scrapbook is waiting</h3>
            <p>Add your first photo to Dimple's visual gallery.</p>
          </div>
        ) : (
          items.map((photo) => (
            <div key={photo._id} className="admin-photo-card">
              <div className="photo-frame">
                <img src={photo.imageUrl} alt={photo.title} className="photo-img" loading="lazy" decoding="async" />
                {photo.isFeatured && (
                  <span className="featured-badge" title="Featured on website homepage">
                    <Sparkles size={11} /> Featured
                  </span>
                )}
                <button
                  className="photo-delete-btn"
                  onClick={(e) => handleDelete(photo._id, e)}
                  title="Delete photo"
                >
                  <Trash2 size={13} />
                </button>
              </div>

              <div className="photo-info">
                <span className="photo-cat-tag">{photo.category}</span>
                <h4 className="photo-title">{photo.title}</h4>
                <p className="photo-caption">{photo.description}</p>
                <span className="photo-date">
                  <Calendar size={11} /> {photo.dateTaken || '2025'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Upload Photo Modal */}
      {showModal && (
        <div className="admin-modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="admin-modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Photograph to Scrapbook</h2>
              <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="admin-modal-form">
              <div className="admin-form-group">
                <label className="admin-form-label">Photo Title</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  placeholder="InnoVortex 2024 Presentation"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Image URL / ImageKit Direct Link</label>
                <input
                  type="text"
                  required
                  className="admin-input"
                  placeholder="https://images.unsplash.com/... or ImageKit URL"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                />
                {imageUrl && (
                  <img src={imageUrl} alt="Preview" className="photo-upload-preview" decoding="async" />
                )}
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="admin-select"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Caption / Description</label>
                <textarea
                  className="admin-textarea"
                  rows={2}
                  placeholder="Tell the story behind this photo..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div className="admin-form-group">
                <label className="admin-form-label">Date Taken / Milestone</label>
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Nov 2024"
                  value={dateTaken}
                  onChange={(e) => setDateTaken(e.target.value)}
                />
              </div>

              <div className="admin-checkbox-row">
                <input
                  type="checkbox"
                  id="featured-check"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                <label htmlFor="featured-check">Feature this photo on the homepage showcase</label>
              </div>

              <div className="modal-actions-bar">
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary btn-sm"
                  disabled={submitting}
                >
                  {submitting ? 'Adding...' : 'Add to Scrapbook'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
