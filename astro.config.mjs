// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import basePathsPlugin from './src/lib/base-paths-plugin.mjs';

const base = process.env.BASE_PATH || '/';

// SITE_URL and BASE_PATH are set by the deploy workflow.
// With a custom domain, set SITE_URL to it and leave BASE_PATH empty.
export default defineConfig({
  site: process.env.SITE_URL || 'https://example.com',
  base,
  trailingSlash: 'ignore',
  integrations: [mdx(), sitemap()],
  markdown: {
    processor: satteri({ hastPlugins: [basePathsPlugin(base)] }),
    shikiConfig: { themes: { light: 'github-light', dark: 'github-dark-dimmed' } },
  },
});
