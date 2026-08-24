// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

// Static-only build: no Cloudflare adapter, no SSR. Deployable to any static
// host (Cloudflare Pages, Netlify, GitHub Pages, nginx, S3, ...). Image
// optimization falls back to the default sharp service at build time.
export default defineConfig({
  site: 'https://zrolowani.pl',
  output: 'static',
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Montserrat',
      cssVariable: '--font-heading',
      weights: [600, 800],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
    },
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-body',
      weights: [400, 500, 600],
      subsets: ['latin', 'latin-ext'],
    },
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
