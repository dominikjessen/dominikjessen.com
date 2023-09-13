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
        },
        marquee_rtl: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(calc(-100% - 4rem))' }
        },
        marquee_ltr: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' }
        }
      },
      animation: {
        wave: 'wave 2s ease-in-out infinite',
        marquee_rtl: 'marquee_rtl 10s linear infinite',
        marquee_ltr: 'marquee_ltr 10s linear infinite'
      }
    }
  },
  plugins: []
};
