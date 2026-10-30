import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, Calendar, Clock, Share2, Bookmark, Check,
  Sparkles, Tag, ArrowRight, User
} from 'lucide-react';
import { initialBlogs } from '../../server/seedData.js';

export default function BlogDetailPage() {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true);
        const res = await fetch(`/api/blogs/${slug}`);
        const data = await res.json();
        if (data.success && data.blog) {
          setBlog(data.blog);
          setRelated(data.related || []);
        } else {
          // Fallback to seed data
          const found = initialBlogs.find(b => b.slug === slug);
          if (found) {
            setBlog(found);
            setRelated(initialBlogs.filter(b => b.slug !== slug).slice(0, 2));
          }
        }
      } catch (e) {
        const found = initialBlogs.find(b => b.slug === slug);
        if (found) {
          setBlog(found);
          setRelated(initialBlogs.filter(b => b.slug !== slug).slice(0, 2));
        }
      } finally {
        setLoading(false);
      }
    }
    loadPost();
  }, [slug]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="page-view blog-loading-view">
        <Sparkles size={28} className="admin-spin-icon" />
        <p>Opening story...</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="page-view not-found-view">
        <div className="not-found-content">
          <h1 className="not-found-code">404</h1>
          <h2 className="not-found-title">Article Not Found</h2>
          <p className="not-found-msg">This story may have been relocated or drafted into a new edition.</p>
          <Link to="/blog" className="btn btn-primary">
            <ArrowLeft size={16} />
            <span>Return to Writing Studio</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-view blog-detail-universe">
      {/* Article Hero Banner */}
      <div className="blog-article-hero">
        <div className="article-hero-inner">
          <Link to="/blog" className="back-link">
            <ArrowLeft size={16} />
            <span>Back to Writing Studio</span>
          </Link>

          <div className="article-header-meta">
            <span className="blog-category-tag">{blog.category}</span>
            <span className="meta-dot">·</span>
            <span className="meta-read-time">
              <Clock size={13} /> {blog.readTime || '5 min read'}
            </span>
            <span className="meta-dot">·</span>
            <span className="meta-date">
              <Calendar size={13} /> {new Date(blog.publishedAt || blog.createdAt).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <h1 className="article-title">{blog.title}</h1>
          {blog.subtitle && <p className="article-subtitle">{blog.subtitle}</p>}

          <div className="article-author-row">
            <div className="author-card">
              <div className="author-avatar">🌸</div>
              <div>
                <span className="author-name">Dimple</span>
                <span className="author-title">IT @ IGDTUW · Creative Technologist</span>
              </div>
            </div>

            <div className="article-actions-cluster">
              <button onClick={handleShare} className="share-pill-btn" title="Copy article URL">
                {copied ? <Check size={14} /> : <Share2 size={14} />}
                <span>{copied ? 'Link Copied!' : 'Share'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Cover Image */}
      {blog.coverImage && (
        <div className="article-cover-stage">
          <div className="cover-wrapper">
            <img src={blog.coverImage} alt={blog.title} className="cover-img" />
          </div>
        </div>
      )}

      {/* Article Content Layout */}
      <section className="section-wrap article-content-section">
        <div className="article-reading-container">
          <div className="article-rich-body">
            {blog.content.split('\n\n').map((block, idx) => {
              if (block.startsWith('## ')) {
                return <h2 key={idx}>{block.replace('## ', '')}</h2>;
              }
              if (block.startsWith('### ')) {
                return <h3 key={idx}>{block.replace('### ', '')}</h3>;
              }
              if (block.startsWith('> ')) {
                return (
                  <blockquote key={idx} className="editorial-quote">
                    <p>{block.replace('> ', '')}</p>
                  </blockquote>
                );
              }
              if (block.startsWith('```')) {
                const codeLines = block.replace(/```[a-z]*\n?/g, '').trim();
                return (
                  <pre key={idx} className="article-code-block">
                    <code>{codeLines}</code>
                  </pre>
                );
              }
              if (block.startsWith('- ')) {
                const items = block.split('\n').filter(l => l.startsWith('- '));
                return (
                  <ul key={idx} className="article-bullets-list">
                    {items.map((item, i) => (
                      <li key={i}>{item.replace('- ', '')}</li>
                    ))}
                  </ul>
                );
              }
              return (
                <p key={idx}>
                  {block.split('**').map((chunk, cIdx) =>
                    cIdx % 2 === 1 ? <strong key={cIdx}>{chunk}</strong> : chunk
                  )}
                </p>
              );
            })}
          </div>

          {/* Tags */}
          {blog.tags && blog.tags.length > 0 && (
            <div className="article-tags-wrap">
              <span className="tags-label">Tagged in:</span>
              <div className="tags-cluster">
                {blog.tags.map((tag, idx) => (
                  <span key={idx} className="tag-chip">#{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Ornamental Divider */}
          <div className="editorial-ornament" style={{ margin: '4rem 0' }}>
            <span className="ornament-line" />
            <span className="ornament-star">✿ ✿ ✿</span>
            <span className="ornament-line" />
          </div>

          {/* Author Bio Box */}
          <div className="article-author-bio-box">
            <div className="bio-avatar">🌸</div>
            <div className="bio-info">
              <h4>Written by Dimple</h4>
              <p>
                Undergraduate in Information Technology at IGDTUW, building machine learning pipelines, responsive frontend engines, and multimodal creative experiences.
              </p>
              <div className="bio-links">
                <Link to="/about" className="bio-link">About Dimple</Link>
                <span className="bio-separator">·</span>
                <Link to="/contact" className="bio-link">Get in Touch</Link>
              </div>
            </div>
          </div>

          {/* Related Articles Strip */}
          {related.length > 0 && (
            <div className="related-articles-box">
              <h3 className="related-title">Continue Reading</h3>
              <div className="related-grid">
                {related.map((rel) => (
                  <Link key={rel._id} to={`/blog/${rel.slug}`} className="related-card">
                    <img src={rel.coverImage} alt={rel.title} className="related-thumb" />
                    <div>
                      <span className="related-cat">{rel.category}</span>
                      <h4 className="related-heading">{rel.title}</h4>
                      <span className="related-time">{rel.readTime}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
