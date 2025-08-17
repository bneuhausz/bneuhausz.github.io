/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog from '@analogjs/platform';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  build: {
    target: ['es2020'],
  },
  resolve: {
    mainFields: ['module'],
  },
  plugins: [
    analog({
      content: {
        highlighter: 'shiki',
        shikiOptions: {
          highlighter: {
            additionalLangs: ['bash'],
          },
        },
      },
      prerender: {
        routes: [
          '/',
          '/blog',
          '/privacy',
          '/blog/angular-project-creation',
          '/blog/angular-material-20-theming',
          '/blog/angular-material-recreating-color-attribute',
        ],
      },
      vite: { experimental: { supportAnalogFormat: true } },
    }),
    tailwindcss(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['src/test-setup.ts'],
    include: ['**/*.spec.ts'],
    reporters: ['default'],
  },
  define: {
    'import.meta.vitest': mode !== 'production',
  },
}));
