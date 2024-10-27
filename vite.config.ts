import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@appointments': path.resolve(__dirname, './src/pages/appointments'),
      '@core': path.resolve(__dirname, './src/core'),
      '@professionals': path.resolve(__dirname, './src/pages/professionals'),
      '@users': path.resolve(__dirname, './src/pages/users'),
    },
  },
});
