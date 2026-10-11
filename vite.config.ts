import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({plugins:[react(),tailwindcss()],base:'./',build:{rollupOptions:{output:{manualChunks:{canvas:['konva','react-konva'],motion:['motion/react']}}}}});
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    allowedHosts: ['omamoments.onrender.com'],
  },
  preview: {
    host: '0.0.0.0',
    allowedHosts: ['omamoments.onrender.com'],
  },
});
