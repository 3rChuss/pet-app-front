import { DarkTheme as _DarkTheme, DefaultTheme } from '@react-navigation/native'
import { useColorScheme } from 'nativewind'

import colors from 'theme/colors'

import type { Theme } from '@react-navigation/native'

const DarkTheme: Theme = {
  ..._DarkTheme,
  colors: {
    ..._DarkTheme.colors,
  },
}

const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
  },
}

export function useThemeConfig() {
  const { colorScheme } = useColorScheme()

  if (colorScheme === 'dark') return DarkTheme

  return LightTheme
}
