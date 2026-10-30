import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { getImageKitAuthParameters } from '../services/imagekitService.js';

const router = Router();

// GET /api/upload/imagekit-auth - Protected: Returns signed auth token for client-side direct upload
router.get('/imagekit-auth', requireAuth, (req, res) => {
  try {
    const authData = getImageKitAuthParameters();
    res.json({
      success: true,
      ...authData
    });
  } catch (err) {
    console.error('ImageKit auth error:', err);
    res.status(500).json({ success: false, error: 'Failed to generate ImageKit authorization.' });
  }
});

export default router;
