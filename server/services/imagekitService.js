import ImageKit from 'imagekit';
import crypto from 'crypto';

let imagekitInstance = null;

function getImageKit() {
  const publicKey = process.env.IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint ||
      publicKey.includes('YOUR_') || privateKey.includes('YOUR_')) {
    return null;
  }

  if (!imagekitInstance) {
    imagekitInstance = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint
    });
  }

  return imagekitInstance;
}

export function isImageKitConfigured() {
  return getImageKit() !== null;
}

export function getImageKitAuthParameters() {
  const ik = getImageKit();
  if (!ik) {
    // Generate a fallback mock token if keys not yet configured
    const expire = Math.floor(Date.now() / 1000) + 1800;
    const token = crypto.randomUUID();
    return {
      configured: false,
      token,
      expire,
      signature: 'mock_signature_configure_imagekit_env',
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY || '',
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT || '',
      message: 'ImageKit credentials not configured in .env yet. You can paste direct image URLs in the dashboard.'
    };
  }

  const authParams = ik.getAuthenticationParameters();
  return {
    configured: true,
    ...authParams,
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
  };
}
