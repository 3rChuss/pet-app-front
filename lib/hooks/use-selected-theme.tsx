import React from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { colorScheme, useColorScheme } from 'nativewind'

const SELECTED_THEME = 'SELECTED_THEME'
export type ColorSchemeType = 'light' | 'dark' | 'system'
/**
 * this hooks should only be used while selecting the theme
 * This hooks will return the selected theme which is stored in MMKV
 * selectedTheme should be one of the following values 'light', 'dark' or 'system'
 * don't use this hooks if you want to use it to style your component based on the theme use useColorScheme from nativewind instead
 *
 */
export const useSelectedTheme = () => {
  const { colorScheme: _color, setColorScheme } = useColorScheme()
  const theme = React.useMemo(() => {
    const theme = colorScheme.get()
    if (theme === undefined) {
      return _color
    }
    return theme
  }, [_color])

  const setSelectedTheme = React.useCallback(
    (t: ColorSchemeType) => {
      setColorScheme(t)
      AsyncStorage.setItem(SELECTED_THEME, t)
    },
    [setColorScheme]
  )

  const selectedTheme = (theme ?? 'system') as ColorSchemeType
  return { selectedTheme, setSelectedTheme } as const
}
// to be used in the root file to load the selected theme from MMKV
export const loadSelectedTheme = async () => {
  const theme = await AsyncStorage.getItem(SELECTED_THEME)
  if (theme !== undefined) {
    colorScheme.set(theme as ColorSchemeType)
  }
}
