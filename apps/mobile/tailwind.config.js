/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        'game-bg': '#050508',
        'game-card': '#0d0d1a',
        'game-border': '#1a1a2e',
      },
    },
  },
  plugins: [],
}
