import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@appointments': path.resolve(__dirname, './src/pages/appointments'),
      '@config': path.resolve(__dirname, './src/config'),
      '@core': path.resolve(__dirname, './src/core'),
      '@layout': path.resolve(__dirname, './src/layout'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@professionals': path.resolve(__dirname, './src/pages/professionals'),
      '@settings': path.resolve(__dirname, './src/pages/settings'),
      '@users': path.resolve(__dirname, './src/pages/users'),
    },
  },
});
