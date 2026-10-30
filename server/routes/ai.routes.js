import { Router } from 'express';
import { askMochi } from '../services/aiService.js';

const router = Router();

// POST /api/ai/mochi - Public AI Companion endpoint with rate limiting
router.post('/mochi', async (req, res) => {
  try {
    const { message, history } = req.body;
    const clientIp = req.ip || req.connection?.remoteAddress || 'unknown';

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ success: false, error: 'A valid message string is required.' });
    }

    const result = await askMochi(message, history || [], clientIp);
    res.json(result);
  } catch (err) {
    console.error('Mochi API Error:', err);
    res.status(500).json({
      success: true,
      reply: "Nyaa~ my kitten whiskers are tingling! Something made my thoughts scatter, but I'm still right here! Ask me about Dimple's projects or tech journey! 🐾"
    });
  }
});

export default router;
