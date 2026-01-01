import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": "/src",
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  preview: {
    port: 4173,
    open: true,
  },
  build: {
    // Optimize chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks for better caching
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // Firebase v12+ has ESM exports that don't work well with manual chunking
          // Let Vite handle it automatically
          'animation-vendor': ['framer-motion', 'gsap'],
          '3d-vendor': ['three', 'ogl'],
          'ui-vendor': ['@fortawesome/react-fontawesome', '@fortawesome/fontawesome-svg-core', 'lucide-react'],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable minification with terser
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.logs in production
        drop_debugger: true,
      },
    },
    // Optimize assets - inline small assets
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    // Enable source maps for production debugging (optional, disable for smaller builds)
    sourcemap: false,
    // CSS code splitting for better performance
    cssCodeSplit: true,
  },
})
