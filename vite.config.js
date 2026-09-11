import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Where `npm run dev` sends API calls. Defaults to the local Pravesha back-end,
// so a developer never reads production data by accident; point it elsewhere
// deliberately with VITE_PROXY_TARGET.
const API = process.env.VITE_PROXY_TARGET || 'http://localhost:5005';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5180,
    // Destinations, fees, rules and every policy come from the back-end.
    proxy: {
      '/public': { target: API, changeOrigin: true },
      '/legal': { target: API, changeOrigin: true },
    },
  },
  preview: {
    port: 5181,
    proxy: {
      '/public': { target: API, changeOrigin: true },
      '/legal': { target: API, changeOrigin: true },
    },
  },
  build: { outDir: 'dist', sourcemap: false },
});
