import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
    // Enable minification and tree shaking
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          // Core React framework
          if (id.includes('react') || id.includes('react-dom')) {
            return 'react-vendor';
          }
          // Router
          if (id.includes('react-router')) {
            return 'router';
          }
          // UI Icons
          if (id.includes('lucide-react') || id.includes('react-icons')) {
            return 'icons';
          }
          // Analytics and monitoring
          if (id.includes('posthog') || id.includes('google')) {
            return 'analytics';
          }
          // Animation
          if (id.includes('framer-motion')) {
            return 'animation';
          }
          // Payment
          if (id.includes('stripe')) {
            return 'payment';
          }
          // Email service
          if (id.includes('emailjs')) {
            return 'email';
          }
          // HTTP client
          if (id.includes('axios')) {
            return 'http';
          }
        }
      }
    },
    // Chunk size warnings
    chunkSizeWarningLimit: 1000
  }
})