import { Router } from 'express';
import { Blog } from '../models/Blog.js';
import { requireAuth } from '../middleware/auth.js';
import { connectDB } from '../db.js';
import { inMemoryStore, initialBlogs } from '../seedData.js';

const router = Router();

// Helper to generate URL slug
function slugify(text) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

// GET /api/blogs - Public: Published posts only
router.get('/', async (req, res) => {
  try {
    const { category, search, tag, page = 1, limit = 12 } = req.query;
    const hasDB = await connectDB();

    if (hasDB) {
      const query = { status: 'published' };
      if (category && category !== 'All') query.category = category;
      if (tag) query.tags = tag;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { subtitle: { $regex: search, $options: 'i' } },
          { excerpt: { $regex: search, $options: 'i' } },
          { tags: { $regex: search, $options: 'i' } }
        ];
      }

      const total = await Blog.countDocuments(query);
      const blogs = await Blog.find(query)
        .sort({ publishedAt: -1, createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

      return res.json({
        success: true,
        blogs,
        total,
        page: Number(page),
        pages: Math.ceil(total / limit)
      });
    }

    // In-memory fallback
    let list = inMemoryStore.blogs.filter(b => b.status === 'published');
    if (category && category !== 'All') list = list.filter(b => b.category === category);
    if (tag) list = list.filter(b => b.tags?.includes(tag));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(b =>
        b.title.toLowerCase().includes(q) ||
        b.subtitle?.toLowerCase().includes(q) ||
        b.excerpt?.toLowerCase().includes(q) ||
        b.tags?.some(t => t.toLowerCase().includes(q))
      );
    }

    res.json({
      success: true,
      blogs: list,
      total: list.length,
      page: 1,
      pages: 1
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/blogs/:slug - Public single post
router.get('/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    const hasDB = await connectDB();

    if (hasDB) {
      const blog = await Blog.findOne({ slug, status: 'published' });
      if (!blog) {
        return res.status(404).json({ success: false, error: 'Article not found.' });
      }

      // Related posts in same category
      const related = await Blog.find({
        status: 'published',
        category: blog.category,
        _id: { $ne: blog._id }
      }).limit(3);

      return res.json({ success: true, blog, related });
    }

    const blog = inMemoryStore.blogs.find(b => b.slug === slug && b.status === 'published');
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Article not found.' });
    }

    const related = inMemoryStore.blogs
      .filter(b => b.status === 'published' && b.category === blog.category && b._id !== blog._id)
      .slice(0, 3);

    res.json({ success: true, blog, related });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/blogs/admin/all - Protected: All posts including drafts
router.get('/admin/all', requireAuth, async (req, res) => {
  try {
    const hasDB = await connectDB();

    if (hasDB) {
      const blogs = await Blog.find().sort({ updatedAt: -1 });
      const publishedCount = await Blog.countDocuments({ status: 'published' });
      const draftCount = await Blog.countDocuments({ status: 'draft' });

      return res.json({
        success: true,
        blogs,
        counts: { total: blogs.length, published: publishedCount, draft: draftCount }
      });
    }

    const blogs = inMemoryStore.blogs;
    const publishedCount = blogs.filter(b => b.status === 'published').length;
    const draftCount = blogs.filter(b => b.status === 'draft').length;

    res.json({
      success: true,
      blogs,
      counts: { total: blogs.length, published: publishedCount, draft: draftCount }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/blogs/admin - Protected: Create blog
router.post('/admin', requireAuth, async (req, res) => {
  try {
    const { title, subtitle, excerpt, content, coverImage, category, tags, status, seoTitle, seoDescription } = req.body;

    if (!title || !content) {
      return res.status(400).json({ success: false, error: 'Title and content are required.' });
    }

    let slug = slugify(title);
    const hasDB = await connectDB();

    if (hasDB) {
      // Ensure unique slug
      let uniqueSlug = slug;
      let counter = 1;
      while (await Blog.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
      }

      // Calculate read time roughly
      const wordCount = content.split(/\s+/).length;
      const readTime = `${Math.max(1, Math.ceil(wordCount / 200))} min read`;

      const newBlog = await Blog.create({
        title,
        slug: uniqueSlug,
        subtitle,
        excerpt: excerpt || content.substring(0, 160) + '...',
        content,
        coverImage: coverImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        category: category || 'Engineering',
        tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
        status: status || 'draft',
        readTime,
        publishedAt: status === 'published' ? new Date() : null,
        seoTitle,
        seoDescription
      });

      return res.status(201).json({ success: true, blog: newBlog });
    }

    // In-memory fallback
    const wordCount = content.split(/\s+/).length;
    const newBlog = {
      _id: 'blog-' + Date.now(),
      title,
      slug: slug + '-' + Math.floor(Math.random() * 1000),
      subtitle,
      excerpt: excerpt || content.substring(0, 160) + '...',
      content,
      coverImage: coverImage || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
      category: category || 'Engineering',
      tags: Array.isArray(tags) ? tags : (tags ? tags.split(',').map(t => t.trim()) : []),
      status: status || 'draft',
      readTime: `${Math.max(1, Math.ceil(wordCount / 200))} min read`,
      author: 'Dimple',
      publishedAt: status === 'published' ? new Date() : null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    inMemoryStore.blogs.unshift(newBlog);

    res.status(201).json({ success: true, blog: newBlog });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PUT /api/blogs/admin/:id - Protected: Update blog
router.put('/admin/:id', requireAuth, async (req, res) => {
  try {
    const { title, subtitle, excerpt, content, coverImage, category, tags, status, seoTitle, seoDescription } = req.body;
    const hasDB = await connectDB();

    if (hasDB) {
      const existing = await Blog.findById(req.params.id);
      if (!existing) {
        return res.status(404).json({ success: false, error: 'Post not found.' });
      }

      if (title && title !== existing.title) {
        existing.title = title;
        existing.slug = slugify(title);
      }
      if (subtitle !== undefined) existing.subtitle = subtitle;
      if (excerpt !== undefined) existing.excerpt = excerpt;
      if (content !== undefined) {
        existing.content = content;
        const words = content.split(/\s+/).length;
        existing.readTime = `${Math.max(1, Math.ceil(words / 200))} min read`;
      }
      if (coverImage !== undefined) existing.coverImage = coverImage;
      if (category !== undefined) existing.category = category;
      if (tags !== undefined) existing.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
      if (status !== undefined) {
        if (status === 'published' && existing.status !== 'published') {
          existing.publishedAt = new Date();
        }
        existing.status = status;
      }
      if (seoTitle !== undefined) existing.seoTitle = seoTitle;
      if (seoDescription !== undefined) existing.seoDescription = seoDescription;
      existing.updatedAt = new Date();

      await existing.save();
      return res.json({ success: true, blog: existing });
    }

    const idx = inMemoryStore.blogs.findIndex(b => b._id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ success: false, error: 'Post not found.' });
    }

    const b = inMemoryStore.blogs[idx];
    if (title) { b.title = title; b.slug = slugify(title); }
    if (subtitle !== undefined) b.subtitle = subtitle;
    if (excerpt !== undefined) b.excerpt = excerpt;
    if (content !== undefined) b.content = content;
    if (coverImage !== undefined) b.coverImage = coverImage;
    if (category !== undefined) b.category = category;
    if (tags !== undefined) b.tags = Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim());
    if (status !== undefined) {
      if (status === 'published' && b.status !== 'published') b.publishedAt = new Date();
      b.status = status;
    }
    b.updatedAt = new Date();

    res.json({ success: true, blog: b });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/blogs/admin/:id - Protected: Delete blog
router.delete('/admin/:id', requireAuth, async (req, res) => {
  try {
    const hasDB = await connectDB();

    if (hasDB) {
      await Blog.findByIdAndDelete(req.params.id);
      return res.json({ success: true, message: 'Article permanently deleted.' });
    }

    inMemoryStore.blogs = inMemoryStore.blogs.filter(b => b._id !== req.params.id);
    res.json({ success: true, message: 'Article permanently deleted.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
