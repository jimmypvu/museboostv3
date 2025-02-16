import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html')
      },
      output: {
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/img/[name][extname]`;
          }
          if (/css/i.test(ext)) {
            return `styles/[name][extname]`;
          }
          return `assets/[name][extname]`;
        },
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
      },
    },
    // Copy static assets to output
    copyPublicDir: true
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './components'),
      '@styles': resolve(__dirname, './styles')
    }
  },
  // Ensure CSS files are processed correctly
  css: {
    postcss: './postcss.config.js'
  },
  // Configure static asset handling
  publicDir: 'styles'
})
