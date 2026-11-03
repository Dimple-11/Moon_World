import { initialBlogs, initialGallery } from '../src/data/fallbackContent.js';
import { githubUrl, linkedinUrl, resumeUrl } from '../src/data/links.js';

export { initialBlogs, initialGallery };

export const inMemoryStore = {
  messages: [
    {
      _id: 'msg-seed-1',
      name: 'Rohan Sharma',
      email: 'rohan.tech@example.com',
      subject: 'Collaboration on AI Vision Project',
      message: 'Hi Dimple! Came across your Insurance Fraud Detection project on GitHub and was thoroughly impressed by your multimodal feature engineering approach. Would love to discuss a potential open-source collaboration!',
      isRead: false,
      isArchived: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4) // 4 hours ago
    },
    {
      _id: 'msg-seed-2',
      name: 'Ananya Verma',
      email: 'ananya@innovortex.org',
      subject: 'InnoVortex 2024 Certificate of Excellence',
      message: 'Congratulations on qualifying as a Top 10 Finalist at InnoVortex! Your presentation on anomaly extraction was outstanding. Your official credential certificate has been issued.',
      isRead: true,
      isArchived: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48) // 2 days ago
    }
  ],
  blogs: [...initialBlogs],
  gallery: [...initialGallery],
  siteSettings: {
    site: {
      brandName: 'DIMPLVERSE',
      brandSubtitle: 'A universe, made of curiosity.',
      tagline: 'A universe, made of curiosity.',
      email: 'bhdimple06@gmail.com',
      github: githubUrl,
      linkedin: linkedinUrl,
      resumeUrl
    },
    announcement: { enabled: false, text: '', link: '' },
    mochiConfig: {
      greeting: "Hello, I'm Mochi, the quiet guide to Dimplverse. Ask about Dimple's projects, skills, experience, or how to reach her.",
      personalityModifier: 'cheerful, helpful, playful anime cat',
      enabled: true
    }
  }
};
