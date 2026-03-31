/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans:    ['"DM Sans"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono:    ['"DM Mono"', '"Courier New"', 'monospace'],
      },
      colors: {
        accent: {
          DEFAULT: '#c9a96e',
          light:   '#e8d5b0',
          dark:    '#a07c45',
        },
        black:   '#0a0a0a',
        white:   '#fafafa',
        gray: {
          50:  '#f7f7f7',
          100: '#efefef',
          200: '#dcdcdc',
          300: '#bdbdbd',
          400: '#989898',
          500: '#7c7c7c',
          600: '#656565',
          700: '#525252',
          800: '#3d3d3d',
          900: '#1a1a1a',
          950: '#0d0d0d',
        },
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl':'1536px',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        '8xl': '90rem',
      },
      aspectRatio: {
        '3/4':  '3 / 4',
        '4/5':  '4 / 5',
        '9/16': '9 / 16',
      },
      transitionDuration: { '400': '400ms' },
      animation: {
        'fade-up':    'fadeUp 0.6s ease forwards',
        'fade-in':    'fadeIn 0.4s ease forwards',
        'slide-in':   'slideIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards',
        'marquee':    'marquee 20s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        fadeUp:  { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideIn: { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        marquee: { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(-50%)' } },
      },
    },
  },
  plugins: [],
};
