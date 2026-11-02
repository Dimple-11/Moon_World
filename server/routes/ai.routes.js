import { Router } from 'express';
import { askMochi } from '../services/aiService.js';

const router = Router();

// POST /api/ai/mochi - Public AI Companion endpoint with rate limiting
router.post('/mochi', async (req, res) => {
  try {
    const { message, history, page } = req.body;
    const clientIp = req.ip || req.connection?.remoteAddress || 'unknown';

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'A valid message string is required.' });
    }

    const safePage = typeof page === 'string' && page.startsWith('/') ? page.slice(0, 80) : '/';
    const result = await askMochi(message, history || [], clientIp, safePage);
    res.json(result);
  } catch (err) {
    console.error('Mochi API Error:', err);
    res.status(500).json({
      success: false,
      error: 'Mochi is resting for a moment. Please try again shortly.'
    });
  }
});

export default router;
