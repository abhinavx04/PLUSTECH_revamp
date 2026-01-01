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
        manualChunks: (id) => {
          // React core
          if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
            return 'react-vendor';
          }
          // Firebase - separate chunk since it's large
          if (id.includes('firebase')) {
            return 'firebase-vendor';
          }
          // Animation libraries - separate chunks
          if (id.includes('framer-motion')) {
            return 'framer-motion';
          }
          if (id.includes('gsap')) {
            return 'gsap';
          }
          // 3D libraries - separate chunks
          if (id.includes('three')) {
            return 'three';
          }
          if (id.includes('ogl')) {
            return 'ogl';
          }
          // UI libraries
          if (id.includes('@fortawesome') || id.includes('lucide-react')) {
            return 'ui-vendor';
          }
          // PDF library
          if (id.includes('pdfjs-dist')) {
            return 'pdfjs';
          }
          // Charts
          if (id.includes('recharts')) {
            return 'recharts';
          }
          // Node modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
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
        pure_funcs: ['console.log', 'console.info', 'console.debug'], // Remove specific console methods
      },
    },
    // Optimize assets - inline small assets
    assetsInlineLimit: 4096, // Inline assets smaller than 4kb
    // Disable source maps for smaller builds
    sourcemap: false,
    // CSS code splitting for better performance
    cssCodeSplit: true,
    // Target modern browsers for smaller output
    target: 'esnext',
    // Minify CSS
    cssMinify: true,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    // Exclude heavy libs from pre-bundling - they'll be loaded on demand
    exclude: ['framer-motion', 'gsap', 'three', 'ogl'],
  },
})
