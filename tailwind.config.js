/** @type {import('tailwindcss').Config} */
const themes = require('./theme/colors')

const activeTheme = process.env.ACTIVE_THEME || 'base'

const generateThemeColors = themeName => {
  const themedColors = {}
  for (const colorKey in themes[themeName]) {
    const twColorName = colorKey.replace(/_/g, '-')
    themedColors[twColorName] = themes[themeName][colorKey]
  }
  return themedColors
}

module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
    './features/**/*.{js,jsx,ts,tsx}',
    './lib/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class', // Mantiene el modo class para control manual
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ...generateThemeColors(activeTheme),
        // Colores adicionales para Dark Mode
        dark: {
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
      },
      fontFamily: {
        quicksand: ['Quicksand', 'sans-serif'],
        nunito: ['Nunito Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
