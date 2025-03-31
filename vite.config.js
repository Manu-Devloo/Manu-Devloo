import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Enable JSX in .js files
      include: '**/*.{jsx,js}',
    })
  ],
  resolve: {
    alias: {
      // Set up any path aliases you might need
      '@': resolve(__dirname, 'src'),
    },
    extensions: ['.js', '.jsx', '.json'],
  },
  // Ensure that assets in the public directory are served correctly
  publicDir: 'public',
  // Configure the build output to match your netlify setup
  build: {
    outDir: 'build',
  },
});