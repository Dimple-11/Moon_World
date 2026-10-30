import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin.js';
import { connectDB } from '../db.js';

const JWT_SECRET = process.env.SESSION_SECRET || 'dimple-super-secret-sakura-key-2026';

// In-memory rate limiter for login
const loginAttempts = new Map();

export function rateLimitLogin(req, res, next) {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 15 * 60 * 1000; // 15 mins
  const maxAttempts = 10;

  const current = loginAttempts.get(ip) || { count: 0, resetAt: now + windowMs };

  if (now > current.resetAt) {
    current.count = 1;
    current.resetAt = now + windowMs;
  } else {
    current.count += 1;
  }

  loginAttempts.set(ip, current);

  if (current.count > maxAttempts) {
    return res.status(429).json({
      success: false,
      error: 'Too many login attempts. Please try again in 15 minutes.'
    });
  }

  next();
}

export async function requireAuth(req, res, next) {
  try {
    let token = req.cookies?.dimple_admin_token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized: Admin authentication required.'
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    // If MongoDB is connected, verify against DB
    const hasDB = await connectDB();
    if (hasDB) {
      const admin = await Admin.findById(decoded.id).select('-passwordHash');
      if (!admin) {
        return res.status(401).json({ success: false, error: 'Admin account not found or removed.' });
      }
      req.admin = admin;
    } else {
      // In-memory mock admin fallback
      req.admin = {
        _id: decoded.id,
        email: decoded.email,
        name: decoded.name || 'Dimple',
        role: 'owner'
      };
    }

    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      error: 'Session expired or invalid token. Please log in again.'
    });
  }
}

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}
