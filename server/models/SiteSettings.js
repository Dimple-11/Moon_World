import mongoose from 'mongoose';

const siteSettingsSchema = new mongoose.Schema({
  key: {
    type: String,
    unique: true,
    default: 'global_settings',
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
