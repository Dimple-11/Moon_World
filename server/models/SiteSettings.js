import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  key: {
    type: String,
    unique: true,
    default: 'global_settings',
  },
  site: {
    brandName: { type: String, default: "DIMPLE'S WORLD" },
    brandSubtitle: { type: String, default: 'THE CREATIVE UNIVERSE OF DIMPLE' },
    tagline: { type: String, default: 'Where code meets creativity, and every pixel has a story.' },
    email: { type: String, default: 'bhdimple06@gmail.com' },
    github: { type: String, default: 'https://github.com/Dimple-11' },
    linkedin: { type: String, default: 'https://linkedin.com/in/dimple-11' },
  },
  announcement: {
    enabled: { type: Boolean, default: false },
    text: { type: String, default: '' },
    link: { type: String, default: '' },
  },
  mochiConfig: {
    greeting: { type: String, default: "Nyaa~! I'm Mochi, Dimple's AI portfolio companion! Ask me anything about her projects, tech stack, or campus journey!" },
    personalityModifier: { type: String, default: 'cheerful, helpful, playful anime cat' },
    enabled: { type: Boolean, default: true },
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  }
});

export const SiteSettings = mongoose.models.SiteSettings || mongoose.model('SiteSettings', siteSettingsSchema);
