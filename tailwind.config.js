/** @type {import('tailwindcss').Config} */
const themes = require('./theme/colors')

const allThemedColors = {}
const generateThemedColors = () => {
  for (const themeName in themes) {
    // e.g., 'base', 'summer', 'xmas'
    for (const colorKey in themes[themeName]) {
      // e.g., 'primary', 'secondary_coral'
      const twColorName = colorKey.replace(/_/g, '-') // e.g., 'secondary-coral'
      allThemedColors[`${themeName}-${twColorName}`] = themes[themeName][colorKey]
    }
  }
  return allThemedColors
}

module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: generateThemedColors(),
      fontFamily: {
        quicksand: ['Quicksand', 'sans-serif'],
        nunito: ['Nunito Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
