import { defineConfig } from 'vite';
import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig(async () => ({
  plugins: [react(), tsconfigPaths()],
  chunkSizeWarningLimit: false,
}));
