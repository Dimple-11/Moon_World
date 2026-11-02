import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // A local .env may set NODE_ENV=development for the server. Ensure a
  // production build still bundles React's production runtime.
  if (mode === 'production') {
    process.env.NODE_ENV = 'production';
  }

  return {
    plugins: [react()],
    // Vite must not inherit NODE_ENV=development from the server's .env.
    // All current values are server-only; no client VITE_ vars are used.
    envDir: false,
    server: {
      port: 5173,
      host: true,
      historyApiFallback: true,
      proxy: {
        '/api': {
          target: 'http://localhost:5000',
          changeOrigin: true,
          secure: false,
        }
      }
    },
    preview: {
      port: 4173,
      historyApiFallback: true
    }
  };
});
