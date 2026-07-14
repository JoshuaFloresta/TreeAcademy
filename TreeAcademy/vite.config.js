import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path' // 1. Import Node's path module

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // 2. Map '@' to the 'src' folder
    },
  },
  server: {
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
