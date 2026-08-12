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
        // Skip Vite virtual modules (`\0`-prefixed). Astro's production client build
        // wraps each island entry in a `\0astro-entry:<path>` module that just
        // re-exports the component. That id still ends in `.ts`, so the Angular
        // plugin would try to emit it, find no matching source file, and replace it
        // with an empty string - leaving an empty entry chunk and an undefined
        // component at hydration time.
        transformFilter: (_code, id) =>
          !id.startsWith('\0') && id.includes('src/components/angular'),
      },
    }),
  ],
  markdown: {
    shikiConfig: {
      langs: ['bash', 'dotenv', 'yaml', 'csharp', 'powershell', 'json'],
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
