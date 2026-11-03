import mongoose from 'mongoose';
import { githubUrl, linkedinUrl, resumeUrl } from '../../src/data/links.js';

const siteSettingsSchema = new mongoose.Schema({
  key: {
    type: String,
    unique: true,
    default: 'global_settings',
  },
  site: {
    brandName: { type: String, default: 'DIMPLVERSE' },
    brandSubtitle: { type: String, default: 'A universe, made of curiosity.' },
    tagline: { type: String, default: 'A universe, made of curiosity.' },
    email: { type: String, default: 'bhdimple06@gmail.com' },
    github: { type: String, default: githubUrl },
    linkedin: { type: String, default: linkedinUrl },
    resumeUrl: { type: String, default: resumeUrl },
  },
  announcement: {
    enabled: { type: Boolean, default: false },
    text: { type: String, default: '' },
    link: { type: String, default: '' },
  },
  mochiConfig: {
    greeting: { type: String, default: "Hello, I'm Mochi, the quiet guide to Dimplverse. Ask about Dimple's projects, skills, experience, or how to reach her." },
    personalityModifier: { type: String, default: 'cheerful, helpful, playful anime cat' },
    enabled: { type: Boolean, default: true },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

export const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', siteSettingsSchema);
