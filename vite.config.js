import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          chartjs: ['chart.js', 'react-chartjs-2'],
          dnd: ['react-beautiful-dnd'],
          date: ['date-fns'],
          router: ['react-router-dom'],
          motion: ['framer-motion'],
          utils: ['uuid', 'webdav']
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  },
  css: {
    modules: {
      localsConvention: 'camelCase'
    },
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer
      ]
    }
  }
})
