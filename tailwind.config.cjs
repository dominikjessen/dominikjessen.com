/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      colors: {
        background: 'hsl(52 94% 94%)',
        foreground: 'hsl(78 71% 3%)',
        primary: 'hsl(13 58% 63%)',
        accent: 'hsl(158 49% 39%)'
      }
    }
  },
  plugins: []
};
