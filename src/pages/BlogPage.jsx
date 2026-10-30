import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Search, ArrowRight, Calendar, Clock, Sparkles, Tag } from 'lucide-react';
import { initialBlogs } from '../../server/seedData.js';

const CATEGORIES = [
  'All',
  'Engineering',
  'AI & Machine Learning',
  'Development',
  'Hackathons',
  'Personal Journal'
];

export default function BlogPage() {
  const [blogs, setBlogs] = useState(initialBlogs);
  const [activeCategory, setActiveCategory] = useState('All');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadBlogs() {
      try {
        setLoading(true);
        const res = await fetch(`/api/blogs?category=${activeCategory}&search=${encodeURIComponent(search)}`);
        const data = await res.json();
        if (data.success && data.blogs) {
          setBlogs(data.blogs);
        }
      } catch (e) {
        console.warn('Using seeded blogs fallback:', e);
      } finally {
        setLoading(false);
      }
    }
    loadBlogs();
  }, [activeCategory, search]);

  const featured = blogs[0];
  const regularList = blogs.slice(1);

  return (
    <div className="page-view blog-universe-view">
      {/* Editorial Page Header */}
      <div className="page-hero-header editorial-hero">
        <div className="page-hero-inner">
          <div className="page-breadcrumb">Editorial &amp; Journal</div>
          <h1 className="page-hero-title">
            The <span className="sakura-gradient-text">Writing Studio</span>
          </h1>
          <p className="page-hero-subtitle">
            Deep-dives into AI anomaly detection, canvas sprite architectures, hackathons, and personal reflections on technology and creativity.
          </p>

          <div className="editorial-ornament">
            <span className="ornament-line" />
            <span className="ornament-star">✦ ❀ ✦</span>
            <span className="ornament-line" />
          </div>
        </div>
      </div>

      <section className="section-wrap">
        <div className="section-container">
          {/* Search & Category Filter Strip */}
          <div className="blog-controls-strip">
            <div className="blog-categories-pills">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  className={`blog-category-pill ${activeCategory === cat ? 'is-active' : ''}`}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="blog-search-box">
              <Search size={15} className="blog-search-icon" />
              <input
                type="text"
                placeholder="Search articles &amp; topics..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="blog-search-input"
              />
            </div>
          </div>

          {/* Featured Article Card (if available) */}
          {featured && !search && activeCategory === 'All' && (
            <div className="blog-featured-card">
              <div className="featured-cover-column">
                <img src={featured.coverImage} alt={featured.title} className="featured-cover-img" />
                <span className="featured-badge">Featured Story</span>
              </div>
              <div className="featured-content-column">
                <div className="featured-meta-row">
                  <span className="blog-category-tag">{featured.category}</span>
                  <span className="meta-read-time">
                    <Clock size={12} /> {featured.readTime || '5 min read'}
                  </span>
                </div>
                <h2 className="featured-title">
                  <Link to={`/blog/${featured.slug}`}>{featured.title}</Link>
                </h2>
                <p className="featured-subtitle">{featured.subtitle}</p>
                <p className="featured-excerpt">{featured.excerpt}</p>
                <div className="featured-footer-row">
                  <span className="featured-date">
                    <Calendar size={12} /> {new Date(featured.publishedAt || featured.createdAt).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
                  </span>
                  <Link to={`/blog/${featured.slug}`} className="btn btn-primary btn-sm">
                    <span>Read Full Story</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Articles Grid */}
          <div className="blog-articles-grid">
            {(search || activeCategory !== 'All' ? blogs : regularList).map((post) => (
              <article key={post._id} className="blog-post-card">
                <Link to={`/blog/${post.slug}`} className="post-card-cover-wrap">
                  <img src={post.coverImage} alt={post.title} className="post-card-img" />
                  <span className="post-cat-badge">{post.category}</span>
                </Link>

                <div className="post-card-body">
                  <div className="post-card-meta">
                    <span className="post-card-date">
                      <Calendar size={12} /> {new Date(post.publishedAt || post.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="post-card-read">
                      <Clock size={12} /> {post.readTime || '4 min read'}
                    </span>
                  </div>

                  <h3 className="post-card-title">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </h3>
                  <p className="post-card-excerpt">{post.excerpt}</p>

                  <div className="post-card-footer">
                    <div className="post-tags-row">
                      {post.tags?.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="post-mini-tag">#{t}</span>
                      ))}
                    </div>
                    <Link to={`/blog/${post.slug}`} className="post-read-link">
                      <span>Read</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {blogs.length === 0 && !loading && (
            <div className="blog-empty-state">
              <BookOpen size={42} className="empty-icon" />
              <h3>No articles found</h3>
              <p>Try searching for a different keyword or category.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
