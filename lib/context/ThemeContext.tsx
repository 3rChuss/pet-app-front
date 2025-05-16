import React, { createContext, useContext, useState, ReactNode, FC } from 'react'

import themes from '@/theme/colors'

type ThemeName = keyof typeof themes
type Theme = (typeof themes)[ThemeName]

interface ThemeContextType {
  themeName: ThemeName
  theme: Theme
  setThemeName: (name: ThemeName) => void
}

const defaultName: ThemeName = 'base'
const ThemeContext = createContext<ThemeContextType>({
  themeName: defaultName,
  theme: themes[defaultName],
  setThemeName: () => {},
})

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: FC<ThemeProviderProps> = ({ children }) => {
  const [themeName, setThemeName] = useState<ThemeName>(defaultName)

  const value: ThemeContextType = {
    themeName,
    theme: themes[themeName],
    setThemeName,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export const useTheme = (): ThemeContextType => {
  return useContext(ThemeContext)
}
