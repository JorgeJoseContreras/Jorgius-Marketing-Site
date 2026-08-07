import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Relative base for static hosting (GitHub Pages, Surge, Vercel, Render)
  build: {
    outDir: 'dist',
  }
})
