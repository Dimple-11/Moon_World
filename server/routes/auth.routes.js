import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { Admin } from '../models/Admin.js';
import { requireAuth, generateToken, rateLimitLogin } from '../middleware/auth.js';
import { connectDB } from '../db.js';

const router = Router();

// POST /api/auth/login
router.post('/login', rateLimitLogin, async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const hasDB = await connectDB();

    // Check against MongoDB if connected
    if (hasDB) {
      const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
      if (!admin) {
        return res.status(401).json({ success: false, error: 'Invalid email or password.' });
      }

      const isMatch = await admin.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({ success: false, error: 'Invalid email or password.' });
      }

      admin.lastLogin = new Date();
      await admin.save();

      const token = generateToken({ id: admin._id, email: admin.email, name: admin.name, role: admin.role });

      res.cookie('dimple_admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });

      return res.json({
        success: true,
        admin: { id: admin._id, email: admin.email, name: admin.name, role: admin.role },
        token
      });
    }

    // In-memory / Environment fallback if MongoDB is not yet connected
    const envAdminEmail = (process.env.ADMIN_EMAIL || 'dimple@dimplesworld.com').toLowerCase();
    const envAdminPass = process.env.ADMIN_PASSWORD || 'sakura2026';

    if (email.toLowerCase().trim() === envAdminEmail && password === envAdminPass) {
      const token = generateToken({ id: 'admin-mock-id', email: envAdminEmail, name: 'Dimple', role: 'owner' });

      res.cookie('dimple_admin_token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60 * 1000
      });

      return res.json({
        success: true,
        admin: { id: 'admin-mock-id', email: envAdminEmail, name: 'Dimple', role: 'owner' },
        token
      });
    }

    return res.status(401).json({ success: false, error: 'Invalid email or password.' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ success: false, error: 'Server error during login authentication.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('dimple_admin_token');
  res.json({ success: true, message: 'Logged out successfully.' });
});

// GET /api/auth/me
router.get('/me', requireAuth, (req, res) => {
  res.json({
    success: true,
    admin: req.admin
  });
});

// POST /api/auth/setup (Seed initial admin if none exists)
router.post('/setup', async (req, res) => {
  try {
    const hasDB = await connectDB();
    if (!hasDB) {
      return res.json({ success: true, message: 'Running in fallback mode. Use ADMIN_EMAIL and ADMIN_PASSWORD from .env' });
    }

    const count = await Admin.countDocuments();
    if (count > 0) {
      return res.status(400).json({ success: false, error: 'Admin account already configured.' });
    }

    const { email, password, name } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required for setup.' });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const newAdmin = await Admin.create({
      email: email.toLowerCase().trim(),
      passwordHash,
      name: name || 'Dimple',
      role: 'owner'
    });

    res.json({
      success: true,
      message: 'Owner account successfully created!',
      admin: { id: newAdmin._id, email: newAdmin.email, name: newAdmin.name }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
