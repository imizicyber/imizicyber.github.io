import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import { resolve } from 'path';

export default defineConfig({
  site: 'https://imizicyber.com',
  output: 'static',
  trailingSlash: 'always',
  build: {
    format: 'directory',
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/company-profile/'),
    }),
    mdx(),
  ],
  vite: {
    resolve: {
      alias: {
        '@': resolve('./src'),
      },
    },
  },
});
