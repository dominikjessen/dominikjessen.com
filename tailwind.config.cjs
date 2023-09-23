/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  safelist: ['bg-[hsl(var(--mint))], bg-[hsl(var(--blush))], bg-[hsl(var(--aliceblue))], fill-primary'],
  theme: {
    extend: {
      fontFamily: {
        signika: ['Signika Variable', ...defaultTheme.fontFamily.sans],
        sans: ['Inter Variable', ...defaultTheme.fontFamily.sans]
      },
      colors: {
        background: 'hsl(var(--background))', // #fdfff5
        foreground: 'hsl(var(--foreground))', // #121311
        foreground_lighter: 'hsl(var(--foreground_lighter))', // #1d1e18
        primary: 'hsl(var(--primary))', // #588157
        accent_seagreen: 'hsl(var(--accent_seagreen))', // #93e9be
        brass: 'hsl(var(--brass))', // #E1C16E
        rose: 'hsl(var(--rose))', // #fcd4d4
        mint: 'hsl(var(--mint))', // #f2fcf7
        blush: 'hsl(var(--blush))', // #fef1f1
        aliceblue: 'hsl(var(--aliceblue))' //#f0f8ff
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
        marquee_rtl: 'marquee_rtl 20s linear infinite',
        marquee_ltr: 'marquee_ltr 20s linear infinite',
        slow_spin: 'slow_spin 30s linear infinite',
        spin_move: 'spin_move 30s linear infinite'
      }
    }
  },
  plugins: []
};
