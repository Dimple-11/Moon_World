import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectDB, getDBStatus } from './db.js';
import authRoutes from './routes/auth.routes.js';
import messagesRoutes from './routes/messages.routes.js';
import blogsRoutes from './routes/blogs.routes.js';
import galleryRoutes from './routes/gallery.routes.js';
import aiRoutes from './routes/ai.routes.js';
import uploadRoutes from './routes/upload.routes.js';
import settingsRoutes from './routes/settings.routes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Trust first proxy for IP rate-limiting
app.set('trust proxy', 1);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    app: 'Dimplverse Studio Backend',
    timestamp: new Date().toISOString(),
    database: getDBStatus(),
    geminiConfigured: !!(process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('YOUR_')),
    imagekitConfigured: !!(process.env.IMAGEKIT_PUBLIC_KEY && !process.env.IMAGEKIT_PUBLIC_KEY.includes('YOUR_'))
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/blogs', blogsRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);

// In production, serve built frontend assets if dist exists
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));

// Fallback SPA handler in Express 5
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'API endpoint not found' });
  }
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) next();
  });
});

// Start Server
app.listen(PORT, async () => {
  console.log(`🌸 [Dimplverse Server] Listening on http://localhost:${PORT}`);
  await connectDB();
});
