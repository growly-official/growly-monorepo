/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    // reference the library only
    './lib/**/*.{js,ts,jsx,tsx}',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    // https://www.figma.com/design/AH4N0fma2EvI30IltjBGPy/%E2%9C%A8-CDS-Styles-(Variables)?node-id=46-168

    extend: {
      colors: {
        white: '#FFFFFF',
        black: '#000000',
        green: '#13d177',
      },
      borderRadius: {
        DEFAULT: '3px',
        full: '9999px',
      },
      screens: {
        '3xl': '2048px',
      },
      fontFamily: {
        display: ['Coinbase Regular', ...defaultTheme.fontFamily.sans],
        sans: ['Coinbase Regular', ...defaultTheme.fontFamily.sans],
        mono: ['Coinbase Regular', ...defaultTheme.fontFamily.sans],
        britney: ['Coinbase Regular', ...defaultTheme.fontFamily.sans],
      },
      spacing: {
        80: '20rem',
      },
      backgroundImage: {
        empowered_by_coinbase: "url('/images/empowered_by_coinbase.png')",
        bootcamp_background_image: "url('/images/bootcamp-background.png')",
      },
      transitionTimingFunction: {
        partners: 'cubic-bezier(0.25, 1, 0.25, 1)',
      },
      boxShadow: {
        'light-button-3d':
          '0px -8px 24px 0px rgba(0, 0, 0, 0.25) inset, 0px -2px 4px 0px rgba(255, 255, 255, 0) inset, 0px 2px 10px 0px rgba(35, 36, 38, 1) inset, 0px 4px 10px 0px rgba(0, 82, 255, 0.32), 0px 4px 24px 0px rgba(45, 72, 72, 0.5) inset, 0px 8px 10px 0px rgba(255, 255, 255, 0.25) inset;',
        'dark-button-3d':
          '0px 8px 24px 0px rgba(255, 255, 255, 0.5) inset, 0px -8px 24px 0px rgba(0, 0, 0, 0.25) inset, 0px -2px 4px 0px rgba(255, 255, 255, 0.25) inset, 0px 2px 10px 0px rgba(88, 89, 91, 1) inset, 0px 4px 10px 0px rgba(0, 82, 255, 0.32), 0px 4px 24px 0px rgba(155, 216, 217, 0.5) inset, 0px 8px 10px 0px rgba(255, 255, 255, 0.25) inset;',
        'pill-glow': '0px 0px 5px 0px #0052FF;',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' },
        },
        bounce: {
          '0%, 100%': { transform: 'translateY(-2.5%)' },
          '50%': { transform: 'translateY(2.5%)' },
        },
        slide: {
          '0%': { transform: 'translateX(-10rem) rotate(6deg)' },
          '50%': { transform: 'translateX(0) rotate(6deg)' },
          '100%': { transform: 'translateX(0) rotate(6deg)' },
        },
        longslide: {
          '0%': { transform: 'translateX(-23rem)' },
          '100%': { transform: 'translateX(13rem)' },
        },
        verticalSlide: {
          '0%': { transform: 'translateY(-80%)', opacity: 0 },
          '30%': { transform: 'translateY(-5%)', opacity: 1 },
          '70%': { transform: 'translateY(5%)', opacity: 1 },
          '100%': { transform: 'translateY(80%)', opacity: 0 },
        },
        pulsate: {
          '0%': { transform: 'scale(95%)' },
          '30%': { transform: 'scale(100%)' },
          '70%': { transform: 'scale(100%)' },
          '100%': { transform: 'scale(95%)' },
        },
      },
      animation: {
        wiggle: 'wiggle 3s linear infinite',
        bounce: 'bounce 1s ease-in-out infinite',
        slide: 'slide 1s ease-in-out infinite',
        longslide: 'longslide 2s linear infinite',
        verticalSlide: 'verticalSlide 2s linear infinite',
        pulsate: 'pulsate 2s linear infinite',
      },
      zIndex: {
        1: '1',
        2: '2',
        3: '3',
        4: '4',
        5: '5',
        6: '6',
        7: '7',
        8: '8',
        9: '9',
      },
    },
  },
  plugins: [],
};
