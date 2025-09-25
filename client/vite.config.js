import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3011,
    open: true,
    cors: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  optimizeDeps: {
    include: ['leaflet']
  },
  // Serve assets from parent directory
  publicDir: '../assets',
  // Alternative: use alias for assets
  resolve: {
    alias: {
      '@assets': '../assets'
    }
  }
});
