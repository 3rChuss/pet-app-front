import { DarkTheme as _DarkTheme, DefaultTheme, type Theme } from 'expo-router/react-navigation'
import { useColorScheme } from 'nativewind'

import colors from 'theme/colors'

const DarkTheme: Theme = {
  ..._DarkTheme,
  colors: {
    ...colors,
    ..._DarkTheme.colors,
  },
}

const LightTheme: Theme = {
  ...DefaultTheme,
  colors: {
    ...colors,
    ...DefaultTheme.colors,
  },
}

export function useThemeConfig() {
  const { colorScheme } = useColorScheme()

  if (colorScheme === 'dark') return DarkTheme

  return LightTheme
}
