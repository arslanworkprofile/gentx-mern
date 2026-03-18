/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['"DM Sans"', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        black: '#0a0a0a',
        white: '#fafafa',
        accent: '#c9a96e',
        'accent-light': '#e8d5b0',
        'accent-dark': '#a07c45',
        gray: {
          50: '#f7f7f7', 100: '#efefef', 200: '#dcdcdc',
          300: '#bdbdbd', 400: '#989898', 500: '#7c7c7c',
          600: '#656565', 700: '#525252', 800: '#3d3d3d',
          900: '#1a1a1a', 950: '#0d0d0d',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'slide-in': 'slideIn 0.3s ease forwards',
      },
      keyframes: {
        fadeUp:  { from: { opacity: 0, transform: 'translateY(24px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } },
        slideIn: { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
};
