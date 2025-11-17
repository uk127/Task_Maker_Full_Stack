import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // important: tells Vite to build into 'dist'
  },
  base: './', // ensures paths work correctly in production
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'), // optional: for cleaner imports
    },
  },
})
