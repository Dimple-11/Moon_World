import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Save, Eye, ArrowLeft, Image, Sparkles, Check,
  Bold, Italic, Heading2, Code, Quote, List, Link as LinkIcon
} from 'lucide-react';

const CATEGORIES = [
  'Engineering',
  'AI & Machine Learning',
  'Development',
  'Hackathons',
  'Personal Journal',
  'Creative Writing',
  'Photography',
  'Life Updates'
];

export default function AdminBlogEditor() {
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('id');
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('write'); // 'write' | 'preview'
  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Engineering');
  const [coverImage, setCoverImage] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [status, setStatus] = useState('published');
  const [seoTitle, setSeoTitle] = useState('');
  const [seoDescription, setSeoDescription] = useState('');

  // If editing an existing blog, fetch details
  useEffect(() => {
    if (!editId) return;

    async function loadPost() {
      try {
        setLoading(true);
        const res = await fetch('/api/blogs/admin/all', { credentials: 'include' });
        const data = await res.json();
        if (data.success && data.blogs) {
          const found = data.blogs.find(b => b._id === editId);
          if (found) {
            setTitle(found.title || '');
            setSubtitle(found.subtitle || '');
            setSlug(found.slug || '');
            setCategory(found.category || 'Engineering');
            setCoverImage(found.coverImage || '');
            setExcerpt(found.excerpt || '');
            setContent(found.content || '');
            setTags(Array.isArray(found.tags) ? found.tags.join(', ') : (found.tags || ''));
            setStatus(found.status || 'draft');
            setSeoTitle(found.seoTitle || '');
            setSeoDescription(found.seoDescription || '');
          }
        }
      } catch (err) {
        console.error('Failed to load blog:', err);
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [editId]);

  // Auto-slugify when title changes in new mode
  const handleTitleChange = (e) => {
    const val = e.target.value;
    setTitle(val);
    if (!editId) {
      const generated = val.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-');
      setSlug(generated);
    }
  };

  // Quick Markdown formatting helpers
  const insertFormatting = (prefix, suffix = '') => {
    const textarea = document.getElementById('blog-editor-textarea');
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = content.substring(start, end);
    const replacement = prefix + (selected || 'text') + suffix;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + replacement.length - suffix.length);
    }, 10);
  };

  // Submit Handler
  const handleSave = async (forcedStatus) => {
    setError('');
    setSaveSuccess(false);

    if (!title.trim() || !content.trim()) {
      setError('Article title and content cannot be empty.');
      return;
    }

    const payload = {
      title: title.trim(),
      subtitle: subtitle.trim(),
      slug: slug.trim(),
      category,
      coverImage: coverImage.trim() || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      excerpt: excerpt.trim() || content.substring(0, 160) + '...',
      content,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      status: forcedStatus || status,
      seoTitle: seoTitle.trim(),
      seoDescription: seoDescription.trim()
    };

    try {
      setLoading(true);
      const url = editId ? `/api/blogs/admin/${editId}` : '/api/blogs/admin';
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to save article.');
      }

      setSaveSuccess(true);
      setTimeout(() => {
        navigate('/admin/blogs');
      }, 1200);
    } catch (err) {
      setError(err.message || 'Error saving post.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page-container editor-layout">
      {/* Editor Top Bar */}
      <div className="editor-top-bar">
        <button onClick={() => navigate('/admin/blogs')} className="btn btn-secondary btn-sm">
          <ArrowLeft size={15} />
          <span>Back to Articles</span>
        </button>

        <div className="editor-tab-switch">
          <button
            className={`editor-tab-btn ${activeTab === 'write' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('write')}
          >
            Markdown Editor
          </button>
          <button
            className={`editor-tab-btn ${activeTab === 'preview' ? 'is-active' : ''}`}
            onClick={() => setActiveTab('preview')}
          >
            <Eye size={14} />
            <span>Live Preview</span>
          </button>
        </div>

        <div className="editor-publish-actions">
          <button
            onClick={() => handleSave('draft')}
            className="btn btn-secondary btn-sm"
            disabled={loading}
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSave('published')}
            className="btn btn-primary btn-sm"
            disabled={loading}
          >
            <Save size={15} />
            <span>Publish Article</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="admin-error-banner" style={{ marginTop: '1rem' }}>
          <span>{error}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="admin-success-banner" style={{ marginTop: '1rem' }}>
          <Check size={16} />
          <span>Article saved successfully! Redirecting to library...</span>
        </div>
      )}

      {/* Editor Body */}
      {activeTab === 'write' ? (
        <div className="editor-form-grid">
          {/* Main Writing Column */}
          <div className="editor-main-column">
            <input
              type="text"
              placeholder="Article Title..."
              value={title}
              onChange={handleTitleChange}
              className="editor-title-input"
            />

            <input
              type="text"
              placeholder="Subheading or subtitle (optional)..."
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="editor-subtitle-input"
            />

            {/* Markdown Quick Formatting Toolbar */}
            <div className="editor-toolbar">
              <button type="button" onClick={() => insertFormatting('**', '**')} title="Bold">
                <Bold size={15} />
              </button>
              <button type="button" onClick={() => insertFormatting('*', '*')} title="Italic">
                <Italic size={15} />
              </button>
              <button type="button" onClick={() => insertFormatting('## ', '')} title="Heading 2">
                <Heading2 size={15} />
              </button>
              <button type="button" onClick={() => insertFormatting('> ', '')} title="Blockquote">
                <Quote size={15} />
              </button>
              <button type="button" onClick={() => insertFormatting('```javascript\n', '\n```')} title="Code Block">
                <Code size={15} />
              </button>
              <button type="button" onClick={() => insertFormatting('- ', '')} title="Bullet list">
                <List size={15} />
              </button>
              <button type="button" onClick={() => insertFormatting('[Link title](', ')')} title="Insert link">
                <LinkIcon size={15} />
              </button>
              <button type="button" onClick={() => insertFormatting('![Caption](', ')')} title="Insert image">
                <Image size={15} />
              </button>
            </div>

            <textarea
              id="blog-editor-textarea"
              placeholder="Write your story, technical tutorial, or reflection in Markdown..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="editor-content-textarea"
            />
          </div>

          {/* Sidebar Metadata Column */}
          <div className="editor-sidebar-column">
            <div className="editor-meta-card">
              <h3 className="meta-card-heading">Post Properties</h3>

              <div className="meta-field">
                <label className="meta-label">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="meta-select"
                >
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="meta-field">
                <label className="meta-label">URL Slug</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  className="meta-input"
                  placeholder="article-slug"
                />
              </div>

              <div className="meta-field">
                <label className="meta-label">Cover Image URL</label>
                <input
                  type="text"
                  value={coverImage}
                  onChange={(e) => setCoverImage(e.target.value)}
                  className="meta-input"
                  placeholder="https://images.unsplash.com/..."
                />
                {coverImage && (
                  <img src={coverImage} alt="Cover preview" className="meta-cover-preview" />
                )}
              </div>

              <div className="meta-field">
                <label className="meta-label">Tags (comma separated)</label>
                <input
                  type="text"
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  className="meta-input"
                  placeholder="AI, FastAPI, Python"
                />
              </div>

              <div className="meta-field">
                <label className="meta-label">Excerpt / Summary</label>
                <textarea
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  className="meta-textarea"
                  rows={3}
                  placeholder="Brief 1-2 sentence preview for cards and search..."
                />
              </div>
            </div>

            {/* SEO Card */}
            <div className="editor-meta-card">
              <h3 className="meta-card-heading">SEO & Metadata</h3>
              <div className="meta-field">
                <label className="meta-label">Meta Title</label>
                <input
                  type="text"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  className="meta-input"
                  placeholder="Optimized browser title"
                />
              </div>
              <div className="meta-field">
                <label className="meta-label">Meta Description</label>
                <textarea
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  className="meta-textarea"
                  rows={2}
                  placeholder="Google search summary..."
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Live Markdown Preview View */
        <div className="editor-preview-container">
          <div className="preview-cover-stage">
            {coverImage && <img src={coverImage} alt={title} className="preview-cover-img" />}
            <div className="preview-meta-row">
              <span className="blog-category-tag">{category}</span>
              <span>By Dimple · {new Date().toLocaleDateString()}</span>
            </div>
            <h1 className="preview-title">{title || 'Untitled Article'}</h1>
            {subtitle && <p className="preview-subtitle">{subtitle}</p>}
          </div>

          <div className="preview-article-body">
            {content.split('\n\n').map((block, i) => {
              if (block.startsWith('## ')) {
                return <h2 key={i}>{block.replace('## ', '')}</h2>;
              }
              if (block.startsWith('### ')) {
                return <h3 key={i}>{block.replace('### ', '')}</h3>;
              }
              if (block.startsWith('> ')) {
                return <blockquote key={i}>{block.replace('> ', '')}</blockquote>;
              }
              if (block.startsWith('```')) {
                return (
                  <pre key={i} className="code-block">
                    <code>{block.replace(/```[a-z]*\n?/g, '')}</code>
                  </pre>
                );
              }
              return <p key={i}>{block}</p>;
            })}
          </div>
        </div>
      )}
    </div>
  );
}
