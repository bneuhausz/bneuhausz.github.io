import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import angular from '@analogjs/astro-angular';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://bneuhausz.dev',
  output: 'static',
  integrations: [
    sitemap(),
    angular({
      vite: {
        transformFilter: (_code, id) => id.includes('src/components/angular'),
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      langs: ['bash', 'dotenv', 'yaml', 'csharp'],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
