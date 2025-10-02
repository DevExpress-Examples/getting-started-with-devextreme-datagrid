import { defineConfig } from 'vite';
import React from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [React()],
  resolve: {
    alias: {
      'dx-exceljs-fork': path.resolve(__dirname, 'node_modules/dx-exceljs-fork/dist/dx-exceljs-fork.min.js'),
    },
  },
  define: {
    global: 'globalThis',
  },
});
