import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Проксируем API на backend во время разработки (npm run dev),
// в проде nginx делает то же самое через nginx.conf.
const backend = 'http://localhost:8080';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': backend,
      '/swagger-ui': backend,
      '/v3/api-docs': backend,
    },
  },
});
