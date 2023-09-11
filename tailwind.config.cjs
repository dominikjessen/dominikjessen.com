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
      },
      keyframes: {
        wave: {
          '0%, 75%, 100%': { transform: 'rotate(0deg)' },
          '12.5%': { transform: 'rotate(16deg)' },
          '25%': { transform: 'rotate(-10deg)' },
          '37.5%': { transform: 'rotate(16deg)' },
          '50%': { transform: 'rotate(-10deg)' },
          '62.5%': { transform: 'rotate(16deg)' }
        }
      },
      animation: {
        wave: 'wave 2s ease-in-out infinite'
      }
    }
  },
  plugins: []
};
