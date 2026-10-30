import { Router } from 'express';
import { Message } from '../models/Message.js';
import { requireAuth } from '../middleware/auth.js';
import { connectDB } from '../db.js';
import { inMemoryStore } from '../seedData.js';

const router = Router();

// Basic HTML sanitizer to strip dangerous script tags
function sanitize(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .trim();
}

// POST /api/messages - Public Contact Form Submission
router.post('/', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    const cleanName = sanitize(name);
    const cleanEmail = sanitize(email);
    const cleanSubject = sanitize(subject || 'General Inquiry');
    const cleanMessage = sanitize(message);

    if (!cleanName || !cleanEmail || !cleanMessage) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, and message are required.'
      });
    }

    // Email regex validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.'
      });
    }

    const hasDB = await connectDB();
    const clientIp = req.ip || req.connection?.remoteAddress;

    if (hasDB) {
      const savedMessage = await Message.create({
        name: cleanName,
        email: cleanEmail,
        subject: cleanSubject,
        message: cleanMessage,
        ip: clientIp,
        createdAt: new Date(),
        isRead: false,
        isArchived: false,
      });

      return res.status(201).json({
        success: true,
        message: 'Your message has been received! Dimple will reply soon. 🌸',
        id: savedMessage._id
      });
    }

    // In-memory fallback
    const newMsg = {
      _id: 'msg-' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      subject: cleanSubject,
      message: cleanMessage,
      ip: clientIp,
      isRead: false,
      isArchived: false,
      createdAt: new Date()
    };
    inMemoryStore.messages.unshift(newMsg);

    return res.status(201).json({
      success: true,
      message: 'Your message has been received! Dimple will reply soon. 🌸',
      id: newMsg._id
    });
  } catch (err) {
    console.error('Contact submission error:', err);
    res.status(500).json({ success: false, error: 'Failed to send message. Please try again.' });
  }
});

// GET /api/messages - Private Admin Inbox
router.get('/', requireAuth, async (req, res) => {
  try {
    const { search = '', filter = 'all', page = 1, limit = 20 } = req.query;
    const hasDB = await connectDB();

    if (hasDB) {
      const query = {};

      if (filter === 'unread') query.isRead = false;
      if (filter === 'archived') query.isArchived = true;
      if (filter === 'inbox') query.isArchived = { $ne: true };

      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { subject: { $regex: search, $options: 'i' } },
          { message: { $regex: search, $options: 'i' } }
        ];
      }

      const total = await Message.countDocuments(query);
      const unreadCount = await Message.countDocuments({ isRead: false, isArchived: false });
      const messages = await Message.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

      return res.json({
        success: true,
        messages,
        total,
        unreadCount,
        page: Number(page),
        pages: Math.ceil(total / limit)
      });
    }

    // In-memory fallback
    let list = inMemoryStore.messages;
    if (filter === 'unread') list = list.filter(m => !m.isRead);
    if (filter === 'archived') list = list.filter(m => m.isArchived);
    if (filter === 'inbox') list = list.filter(m => !m.isArchived);

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(m =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q)
      );
    }

    const unreadCount = inMemoryStore.messages.filter(m => !m.isRead && !m.isArchived).length;

    res.json({
      success: true,
      messages: list,
      total: list.length,
      unreadCount,
      page: 1,
      pages: 1
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/messages/:id/read - Mark Read/Unread
router.patch('/:id/read', requireAuth, async (req, res) => {
  try {
    const { isRead = true } = req.body;
    const hasDB = await connectDB();

    if (hasDB) {
      const updated = await Message.findByIdAndUpdate(req.params.id, { isRead }, { new: true });
      return res.json({ success: true, message: updated });
    }

    const msg = inMemoryStore.messages.find(m => m._id === req.params.id);
    if (msg) msg.isRead = isRead;
    res.json({ success: true, message: msg });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH /api/messages/:id/archive - Toggle Archive
router.patch('/:id/archive', requireAuth, async (req, res) => {
  try {
    const { isArchived = true } = req.body;
    const hasDB = await connectDB();

    if (hasDB) {
      const updated = await Message.findByIdAndUpdate(req.params.id, { isArchived }, { new: true });
      return res.json({ success: true, message: updated });
    }

    const msg = inMemoryStore.messages.find(m => m._id === req.params.id);
    if (msg) msg.isArchived = isArchived;
    res.json({ success: true, message: msg });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE /api/messages/:id - Delete Message
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const hasDB = await connectDB();

    if (hasDB) {
      await Message.findByIdAndDelete(req.params.id);
      return res.json({ success: true, message: 'Message removed permanently.' });
    }

    inMemoryStore.messages = inMemoryStore.messages.filter(m => m._id !== req.params.id);
    res.json({ success: true, message: 'Message removed permanently.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
