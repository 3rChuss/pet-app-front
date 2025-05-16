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
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        ...generateThemeColors(activeTheme),
      },
      fontFamily: {
        quicksand: ['Quicksand', 'sans-serif'],
        nunito: ['Nunito Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
