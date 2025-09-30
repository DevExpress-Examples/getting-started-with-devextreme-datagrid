import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vueJsx()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      'devextreme/ui': 'devextreme/esm/ui',
      'devextreme-exceljs-fork': fileURLToPath(new URL('./node_modules/devextreme-exceljs-fork/dist/dx-exceljs-fork.min.js', import.meta.url)),
    },
  },
  define: {
    global: 'globalThis',
  },
});
