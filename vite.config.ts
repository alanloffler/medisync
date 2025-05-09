import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  resolve: {
    alias: {
      '@appointments': path.resolve(__dirname, './src/pages/appointments'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@auth': path.resolve(__dirname, './src/pages/auth'),
      '@config': path.resolve(__dirname, './src/config'),
      '@core': path.resolve(__dirname, './src/core'),
      '@dashboard': path.resolve(__dirname, './src/pages/dashboard'),
      '@email': path.resolve(__dirname, './src/pages/email'),
      '@layout': path.resolve(__dirname, './src/layout'),
      '@lib': path.resolve(__dirname, './src/lib'),
      '@microsites': path.resolve(__dirname, './src/pages/microsites'),
      '@professionals': path.resolve(__dirname, './src/pages/professionals'),
      '@settings': path.resolve(__dirname, './src/pages/settings'),
      '@users': path.resolve(__dirname, './src/pages/users'),
      '@whatsapp': path.resolve(__dirname, './src/pages/whatsapp'),
    },
  },
});
