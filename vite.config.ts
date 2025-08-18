/// <reference types="vitest" />

import { defineConfig } from 'vite';
import analog, { PrerenderContentFile } from '@analogjs/platform';
import tailwindcss from '@tailwindcss/vite';
import { formatDateToYYYYMMDD } from './src/app/shared/utils/date.utils';

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
          {
            contentDir: 'src/content',
            transform: (file: PrerenderContentFile) => {
              if (file.attributes['draft']) {
                return false;
              }
              const slug = file.attributes['slug'] || file.name;
              return `/blog/${slug}`;
            },
            sitemap: (file: PrerenderContentFile) => {
              const rawDate = file.attributes['lastMod'] ?? file.attributes['date'];
              return {
                lastmod: formatDateToYYYYMMDD(rawDate),
                changefreq: 'yearly',
              };
            },
          },
        ],
        sitemap: {
          host: 'https://bneuhausz.dev',
        },
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
