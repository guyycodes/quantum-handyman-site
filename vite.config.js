import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'framer-motion'],
        },
      },
    },
    // Minify for production builds
    minify: 'esbuild',
    // Generate source maps for debugging (disable in production if needed)
    sourcemap: false,
    // Reduce chunk size warnings
    chunkSizeWarningLimit: 1000,
    // Better tree-shaking
    treeShaking: true,
    // Remove console logs in production
    esbuild: {
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
  },
  server: {
    headers: {
      // Development CSP - more permissive
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com https://us.i.posthog.com https://us-assets.i.posthog.com https://app.posthog.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' ws: wss: http: https:;"
    }
  }
})