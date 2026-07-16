// @ts-check
import { defineConfig } from 'astro/config';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

// Domyślnie strona jest statyczna (SSG). Endpointy sprzedaży (Faza 2)
// włączają rendering na żądanie przez `export const prerender = false`.
export default defineConfig({
  site: 'https://zrolowani.pl',
  adapter: cloudflare({
    platformProxy: { enabled: true }, // dostęp do bindings (D1, secrets) w `astro dev`
  }),
  vite: {
    plugins: [tailwindcss()],
  },
});
