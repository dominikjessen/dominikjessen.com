import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  site: 'https://dominikjessen.com',
  // Keep HTML-aware whitespace (Astro 7 defaults to JSX rules, which can drop spaces between inline elements)
  compressHTML: true,
  integrations: [react()],
  vite: {
    plugins: [tailwindcss()]
  }
});
