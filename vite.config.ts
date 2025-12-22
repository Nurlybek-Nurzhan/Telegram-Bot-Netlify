import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
  server: {
    port: 5173,
    strictPort: true,
    fs: {
      strict: false,
    },
  },
  assetsInclude: ['**/*.html'],
})
