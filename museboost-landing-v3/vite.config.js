import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
  },
  css: {
    postcss: './postcss.config.js'
  }
})
