import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import cleanup from 'rollup-plugin-cleanup';

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react(), tsconfigPaths()],
  chunkSizeWarningLimit: false,
  optimizeDeps: {
    exclude: ['node_modules'],
  },
}));
