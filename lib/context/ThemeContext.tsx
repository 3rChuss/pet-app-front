import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useColorScheme } from 'react-native'

export type ThemeMode = 'light' | 'dark' | 'system'
export type ActiveTheme = 'light' | 'dark'

interface ThemeContextType {
  themeMode: ThemeMode
  activeTheme: ActiveTheme
  setThemeMode: (mode: ThemeMode) => void
  toggleTheme: () => void
  isLoading: boolean
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

const THEME_STORAGE_KEY = '@theme_mode'

interface ThemeProviderProps {
  children: ReactNode
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme()
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system')
  const [isLoading, setIsLoading] = useState(true)

  // Determinar el tema activo basado en el modo y el sistema
  const activeTheme: ActiveTheme =
    themeMode === 'system'
      ? systemColorScheme === 'dark'
        ? 'dark'
        : 'light'
      : themeMode === 'dark'
        ? 'dark'
        : 'light'

  // Cargar preferencia guardada al inicializar
  useEffect(() => {
    loadThemePreference()
  }, [])

  // Aplicar el tema cuando cambie
  useEffect(() => {
    applyTheme(activeTheme)
  }, [activeTheme])

  const loadThemePreference = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY)
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setThemeModeState(savedTheme as ThemeMode)
      }
    } catch (error) {
      console.warn('Error loading theme preference:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      setThemeModeState(mode)
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode)
    } catch (error) {
      console.warn('Error saving theme preference:', error)
    }
  }

  const toggleTheme = () => {
    const newMode = activeTheme === 'light' ? 'dark' : 'light'
    setThemeMode(newMode)
  }

  const applyTheme = (theme: ActiveTheme) => {
    // En React Native con NativeWind, el tema se aplica a través de clases CSS
    // Esto se manejará en el componente raíz y en los estilos
    if (__DEV__) {
      console.log(`🎨 Theme applied: ${theme}`)
    }
  }

  const value: ThemeContextType = {
    themeMode,
    activeTheme,
    setThemeMode,
    toggleTheme,
    isLoading,
  }

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

// Hook para obtener solo el tema activo (optimizado para re-renders)
export function useActiveTheme() {
  const { activeTheme } = useTheme()
  return activeTheme
}

// Hook para verificar si está en modo oscuro
export function useIsDarkMode() {
  const { activeTheme } = useTheme()
  return activeTheme === 'dark'
}
