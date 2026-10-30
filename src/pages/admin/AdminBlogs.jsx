import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, PlusCircle, Edit3, Trash2, ExternalLink, Calendar, Eye } from 'lucide-react';

export default function AdminBlogs() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' | 'published' | 'draft'
  const navigate = useNavigate();

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/blogs/admin/all', { credentials: 'include' });
      const data = await res.json();
      if (data.success) {
        setBlogs(data.blogs || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleDelete = async (id, title, e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to permanently delete "${title}"?`)) return;

    try {
      await fetch(`/api/blogs/admin/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      setBlogs(prev => prev.filter(b => b._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const filteredBlogs = blogs.filter(b => {
    if (filter === 'published') return b.status === 'published';
    if (filter === 'draft') return b.status === 'draft';
    return true;
  });

  return (
    <div className="admin-page-container">
      <div className="admin-page-header-row">
        <div>
          <h1 className="admin-page-title">Personal Blog Studio</h1>
          <p className="admin-page-subtitle">Publish technical write-ups, project breakdowns, tutorials, and life reflections.</p>
        </div>

        <Link to="/admin/blogs/editor" className="btn btn-primary">
          <PlusCircle size={16} />
          <span>Write New Article</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="admin-filter-tabs">
        <button
          className={`filter-tab-btn ${filter === 'all' ? 'is-active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Articles ({blogs.length})
        </button>
        <button
          className={`filter-tab-btn ${filter === 'published' ? 'is-active' : ''}`}
          onClick={() => setFilter('published')}
        >
          Published ({blogs.filter(b => b.status === 'published').length})
        </button>
        <button
          className={`filter-tab-btn ${filter === 'draft' ? 'is-active' : ''}`}
          onClick={() => setFilter('draft')}
        >
          Drafts ({blogs.filter(b => b.status === 'draft').length})
        </button>
      </div>

      {/* Blog Cards Grid */}
      <div className="admin-blogs-list">
        {loading ? (
          <div className="admin-loading-state">
            <p>Loading articles...</p>
          </div>
        ) : filteredBlogs.length === 0 ? (
          <div className="admin-empty-state">
            <BookOpen size={42} className="empty-icon" />
            <h3>No articles found</h3>
            <p>Ready to start your next thought piece?</p>
          </div>
        ) : (
          filteredBlogs.map((blog) => (
            <div key={blog._id} className="admin-blog-card">
              <div className="blog-card-cover-wrap">
                <img src={blog.coverImage} alt={blog.title} className="blog-card-cover" />
                <span className={`blog-status-badge ${blog.status}`}>
                  {blog.status}
                </span>
              </div>

              <div className="blog-card-details">
                <div className="blog-card-meta">
                  <span className="blog-category-tag">{blog.category}</span>
                  <span className="blog-read-time">{blog.readTime || '4 min read'}</span>
                </div>

                <h3 className="blog-card-title">{blog.title}</h3>
                <p className="blog-card-excerpt">{blog.excerpt}</p>

                <div className="blog-card-footer">
                  <span className="blog-date">
                    <Calendar size={12} /> {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString()}
                  </span>

                  <div className="blog-card-actions">
                    {blog.status === 'published' && (
                      <a
                        href={`/blog/${blog.slug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="action-pill-btn"
                        title="View live post"
                      >
                        <Eye size={14} />
                      </a>
                    )}
                    <button
                      className="action-pill-btn"
                      onClick={() => navigate(`/admin/blogs/editor?id=${blog._id}`)}
                      title="Edit article"
                    >
                      <Edit3 size={14} />
                    </button>
                    <button
                      className="action-pill-btn delete"
                      onClick={(e) => handleDelete(blog._id, blog.title, e)}
                      title="Delete article"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
