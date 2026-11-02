import { initialBlogs, initialGallery } from '../src/data/fallbackContent.js';

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
      brandName: "DIMPLE'S WORLD",
      brandSubtitle: 'THE CREATIVE UNIVERSE OF DIMPLE',
      tagline: 'Where code meets creativity, and every pixel has a story.',
      email: 'bhdimple06@gmail.com',
      github: 'https://github.com/Dimple-11',
      linkedin: 'https://linkedin.com/in/dimple-11'
    },
    announcement: { enabled: false, text: '', link: '' },
    mochiConfig: {
      greeting: "Nyaa~! I'm Mochi, Dimple's AI portfolio companion! Ask me anything about her projects, tech stack, or campus journey!",
      personalityModifier: 'cheerful, helpful, playful anime cat',
      enabled: true
    }
  }
};
