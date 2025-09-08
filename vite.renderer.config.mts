import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [vue(), tailwindcss()],
  esbuild: {
    logOverride: {
      eval: 'silent',
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      logOverride: {
        eval: 'silent',
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  build: {
    rollupOptions: {
      onwarn(warning, warn) {
        if (
          warning.code === 'EVAL' &&
          /@baiducloud\/(qianfan)/.test((warning.id as string) || '')
        ) {
          return;
        }
        warn(warning);
      },
    },
  },
});
