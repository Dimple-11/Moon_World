import { Router } from 'express';
import { SiteSettings } from '../models/SiteSettings.js';
import { requireAuth } from '../middleware/auth.js';
import { connectDB } from '../db.js';
import { inMemoryStore } from '../seedData.js';
import { githubUrl, linkedinUrl, resumeUrl } from '../../src/data/links.js';

const router = Router();

export const DEFAULT_SITE_SETTINGS = {
  brandName: 'DIMPLVERSE',
  brandSubtitle: 'A universe, made of curiosity.',
  tagline: 'A universe, made of curiosity.',
  email: 'bhdimple06@gmail.com',
  github: githubUrl,
  linkedin: linkedinUrl,
  resumeUrl,
};

function mergeSettings(settings) {
  return {
    ...DEFAULT_SITE_SETTINGS,
    ...(settings?.site || {}),
  };
}

// GET /api/settings - Public, read-only site identity
router.get('/', async (req, res) => {
  try {
    const hasDB = await connectDB();

    if (hasDB) {
      const doc = await SiteSettings.findOne({ key: 'global_settings' });
      return res.json({
        success: true,
        storage: 'mongodb',
        settings: mergeSettings(doc),
      });
    }

    return res.json({
      success: true,
      storage: 'memory',
      settings: mergeSettings(inMemoryStore.siteSettings),
    });
  } catch (err) {
    console.error('Settings read error:', err);
    return res.json({
      success: true,
      storage: 'memory',
      settings: { ...DEFAULT_SITE_SETTINGS },
    });
  }
});

// PUT /api/settings - Owner only
router.put('/', requireAuth, async (req, res) => {
  try {
    const { brandName, brandSubtitle, tagline, email, github, linkedin, resumeUrl: resumeUrlInput } = req.body || {};
    const site = {
      brandName: String(brandName || DEFAULT_SITE_SETTINGS.brandName).trim().slice(0, 80),
      brandSubtitle: String(brandSubtitle || DEFAULT_SITE_SETTINGS.brandSubtitle).trim().slice(0, 120),
      tagline: String(tagline || DEFAULT_SITE_SETTINGS.tagline).trim().slice(0, 200),
      email: String(email || DEFAULT_SITE_SETTINGS.email).trim().slice(0, 120),
      github: String(github || DEFAULT_SITE_SETTINGS.github).trim().slice(0, 200),
      linkedin: String(linkedin || DEFAULT_SITE_SETTINGS.linkedin).trim().slice(0, 200),
      resumeUrl: String(resumeUrlInput || DEFAULT_SITE_SETTINGS.resumeUrl).trim().slice(0, 300),
    };

    const hasDB = await connectDB();

    if (hasDB) {
      const doc = await SiteSettings.findOneAndUpdate(
        { key: 'global_settings' },
        { $set: { site, updatedAt: new Date() } },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      return res.json({ success: true, storage: 'mongodb', settings: mergeSettings(doc) });
    }

    inMemoryStore.siteSettings = {
      ...(inMemoryStore.siteSettings || {}),
      site,
      updatedAt: new Date(),
    };
    return res.json({ success: true, storage: 'memory', settings: mergeSettings(inMemoryStore.siteSettings) });
  } catch (err) {
    console.error('Settings update error:', err);
    return res.status(500).json({ success: false, error: 'Unable to save settings right now.' });
  }
});

export default router;
