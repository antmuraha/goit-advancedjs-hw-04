import path, { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const __dirname = dirname(fileURLToPath(import.meta.url)) + '/src';

export default defineConfig(({ command, mode }) => ({
  // Does not pass auto-check
  base: mode === 'production' ? './' : '/',
  define: {
    global: {},
  },
  root: __dirname,
  build: {
    outDir: resolve(__dirname, '../dist'),
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        entryFileNames: chunkInfo => {
          if (chunkInfo.name === 'commonHelpers') {
            return 'commonHelpers.js';
          }
          return '[name].js';
        },
        assetFileNames: assetInfo => {
          if (assetInfo.name && assetInfo.name.endsWith('.html')) {
            return '[name].[ext]';
          }
          return 'assets/[name]-[hash][extname]';
        },
      },
    },
  },
}));
