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
      // Family names must match the keys registered with useFonts in useAppInitialization.
      // Each weight is a separate font file, so pick the weight through the family class
      // (font-quicksand-bold, font-nunito-semibold) instead of combining it with font-bold:
      // on Android a custom font plus fontWeight does not select the right file.
      fontFamily: {
        quicksand: ['Quicksand-SemiBold', 'sans-serif'],
        'quicksand-medium': ['Quicksand-Medium', 'sans-serif'],
        'quicksand-semibold': ['Quicksand-SemiBold', 'sans-serif'],
        'quicksand-bold': ['Quicksand-Bold', 'sans-serif'],
        nunito: ['NunitoSans-Regular', 'sans-serif'],
        'nunito-medium': ['NunitoSans-Medium', 'sans-serif'],
        'nunito-semibold': ['NunitoSans-SemiBold', 'sans-serif'],
        'nunito-bold': ['NunitoSans-Bold', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
