import { Router } from 'express';
import { Gallery } from '../models/Gallery.js';
import { requireAuth } from '../middleware/auth.js';
import { connectDB } from '../db.js';
import { inMemoryStore } from '../seedData.js';

const router = Router();

// GET /api/gallery - Public: List photographs
router.get('/', async (req, res) => {
  try {
    const { category, featured } = req.query;
    const hasDB = await connectDB();

    if (hasDB) {
      const query = {};
      if (category && category !== 'All') query.category = category;
      if (featured === 'true') query.isFeatured = true;

      const items = await Gallery.find(query).sort({ displayOrder: 1, createdAt: -1 });
      return res.json({ success: true, items });
    }

    let list = inMemoryStore.gallery;
    if (category && category !== 'All') list = list.filter(g => g.category === category);
    if (featured === 'true') list = list.filter(g => g.isFeatured);

    res.json({ success: true, items: list });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/gallery/admin - Protected: Add photograph
router.post('/admin', requireAuth, async (req, res) => {
  try {
    const { title, description, imageUrl, thumbnailUrl, category, albumId, altText, isFeatured, dateTaken } = req.body;

    if (!title || !imageUrl) {
      return res.status(400).json({ success: false, error: 'Title and image URL are required.' });
    }

    const hasDB = await connectDB();

    if (hasDB) {
      const newItem = await Gallery.create({
        title,
        description,
        imageUrl,
        thumbnailUrl: thumbnailUrl || imageUrl,
        category: category || 'Aesthetic',
        albumId: albumId || 'default',
        altText: altText || title,
        isFeatured: Boolean(isFeatured),
        dateTaken: dateTaken || '2025',
        createdAt: new Date()
      });
      return res.status(201).json({ success: true, item: newItem });
    }

    const newItem = {
      _id: 'gal-' + Date.now(),
      title,
      description,
      imageUrl,
      thumbnailUrl: thumbnailUrl || imageUrl,
      category: category || 'Aesthetic',
      albumId: albumId || 'default',
      altText: altText || title,
      isFeatured: Boolean(isFeatured),
      dateTaken: dateTaken || '2025',
      createdAt: new Date()
    };
    inMemoryStore.gallery.unshift(newItem);

    res.status(201).json({ success: true, item: newItem });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/gallery/admin/:id - Protected: Remove photograph
router.delete('/admin/:id', requireAuth, async (req, res) => {
  try {
    const hasDB = await connectDB();

    if (hasDB) {
      await Gallery.findByIdAndDelete(req.params.id);
      return res.json({ success: true, message: 'Photo deleted from scrapbook.' });
    }

    inMemoryStore.gallery = inMemoryStore.gallery.filter(g => g._id !== req.params.id);
    res.json({ success: true, message: 'Photo deleted from scrapbook.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
