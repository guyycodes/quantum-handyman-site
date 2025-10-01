import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    modulePreload: {
      // Reduce preloading to improve initial load
      resolveDependencies: (filename, deps, context) => {
        // Only preload critical modules for initial render
        return deps.filter(dep => {
          return dep.includes('index') || 
                 dep.includes('react-vendor') ||
                 dep.includes('vendor.js');
        });
      }
    },
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        handyman: resolve(__dirname, 'handyman/index.html'),
        web: resolve(__dirname, 'web/index.html')
      },
      output: {
        manualChunks: (id) => {
          // Vendor chunks for better caching
          if (id.includes('node_modules')) {
            // Core React libraries
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // UI components and icons
            if (id.includes('lucide-react')) {
              return 'ui-vendor';
            }
            // Analytics libraries (loaded after initial paint)
            if (id.includes('posthog') || id.includes('@posthog')) {
              return 'analytics-vendor';
            }
            // Split heavy UI components into their own chunk
            if (id.includes('framer-motion') || id.includes('@radix-ui')) {
              return 'ui-heavy';
            }
            // Payment and email services
            if (id.includes('emailjs') || id.includes('stripe')) {
              return 'services-vendor';
            }
            // Other vendor code
            return 'vendor';
          }
          // Analytics providers and contexts
          if (id.includes('GoogleAnalytics') || id.includes('PostHog')) {
            return 'analytics';
          }
          // Split BookingModal and related heavy components
          if (id.includes('BookingModal') || id.includes('bookingSystem')) {
            return 'booking-system';
          }
        },
        // Use content hash for better caching
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    // Minify for production builds with terser for better compression
    build: {
      minify: 'esbuild' // Default in Vite, faster than terser
    },
    // Generate source maps for debugging (disable in production if needed)
    sourcemap: false,
    // Reduce chunk size warnings
    chunkSizeWarningLimit: 600,
    // Better tree-shaking
    treeShaking: true,
    // Remove console logs in production
    esbuild: {
      drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    },
    // Target modern browsers for smaller bundles
    target: 'es2020',
    // CSS optimization
    cssCodeSplit: true,
    cssMinify: true,
    // Asset inlining threshold (4kb)
    assetsInlineLimit: 4096,
  },
  server: {
    headers: {
      // Development CSP - more permissive
      'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.googletagmanager.com https://www.google-analytics.com https://js.stripe.com https://us.i.posthog.com https://us-assets.i.posthog.com https://app.posthog.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: https: blob:; connect-src 'self' ws: wss: http: https:;"
    }
  }
})