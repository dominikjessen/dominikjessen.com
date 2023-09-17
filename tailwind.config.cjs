/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        signika: ['Signika Variable', ...defaultTheme.fontFamily.sans],
        sans: ['Inter Variable', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        background: 'hsl(72 99% 98%)', // #fdfff5
        foreground: 'hsl(70 5% 7%)', // #121311
        foreground_lighter: 'hsl(70 11% 11%)', // #1d1e18
        primary: 'hsl(119 19% 42%)', // #588157
        accent_seagreen: 'hsl(150 66% 75%)', // #93e9be
        brass: 'hsl(43 66% 66%)', // #E1C16E
        rose: 'hsl(0 87% 91%)' // #fcd4d4
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
          '100%': { transform: 'translateX(calc(-100% - 1rem))' }
        },
        marquee_ltr: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' }
        },
        slow_spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        spin_move: {
          '0%': { transform: 'rotate(0deg) translate(-5%, -10%)' },
          '50%': { transform: 'rotate(180deg) translate(10%, 10%)' },
          '100%': { transform: 'rotate(360deg) translate(-5%, -10%)' }
        }
      },
      animation: {
        wave: 'wave 2s ease-in-out infinite',
        marquee_rtl: 'marquee_rtl 10s linear infinite',
        marquee_ltr: 'marquee_ltr 10s linear infinite',
        slow_spin: 'slow_spin 30s linear infinite',
        spin_move: 'spin_move 30s linear infinite'
      }
    }
  },
  plugins: []
};
