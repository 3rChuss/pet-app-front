import { useMemo } from 'react'

import { useActiveTheme } from '@/lib/context/ThemeContext'

/**
 * Hook para obtener estilos dinámicos basados en el tema
 * Permite crear estilos que cambien automáticamente con el tema
 */
export function useThemeStyles() {
  const activeTheme = useActiveTheme()
  const isDark = activeTheme === 'dark'

  return useMemo(
    () => ({
      // Fondos principales
      backgrounds: {
        primary: isDark ? 'bg-gray-900' : 'bg-neutral-off-white',
        secondary: isDark ? 'bg-gray-800' : 'bg-white',
        elevated: isDark ? 'bg-gray-700' : 'bg-white',
        card: isDark ? 'bg-gray-800' : 'bg-white',
        input: isDark ? 'bg-gray-700' : 'bg-neutral-light-gray/50',
      },

      // Textos
      text: {
        primary: isDark ? 'text-white' : 'text-neutral-dark-gray',
        secondary: isDark ? 'text-gray-300' : 'text-neutral-medium-gray',
        muted: isDark ? 'text-gray-400' : 'text-neutral-medium-gray',
        inverse: isDark ? 'text-neutral-dark-gray' : 'text-white',
        accent: 'text-primary', // Mantiene el color de marca
        error: 'text-accent-coral',
      },

      // Bordes
      borders: {
        default: isDark ? 'border-gray-600' : 'border-neutral-medium-gray',
        light: isDark ? 'border-gray-700' : 'border-neutral-light-gray',
        input: isDark ? 'border-gray-500' : 'border-neutral-medium-gray',
      },

      // Botones
      buttons: {
        primary: {
          background: 'bg-primary',
          text: 'text-white',
          border: 'border-primary',
        },
        secondary: {
          background: isDark ? 'bg-gray-700' : 'bg-white',
          text: isDark ? 'text-white' : 'text-primary',
          border: isDark ? 'border-gray-600' : 'border-primary',
        },
        ghost: {
          background: 'bg-transparent',
          text: isDark ? 'text-white' : 'text-neutral-dark-gray',
          border: 'border-transparent',
        },
      },

      // Estados de iconos
      icons: {
        primary: isDark ? '#FFFFFF' : '#424242',
        secondary: isDark ? '#D1D5DB' : '#BDBDBD',
        accent: '#A0D2DB', // Color de marca
        muted: isDark ? '#9CA3AF' : '#BDBDBD',
      },

      // Shadows (para componentes que usan shadows)
      shadows: {
        small: isDark ? 'shadow-gray-900/50' : 'shadow-gray-500/10',
        medium: isDark ? 'shadow-gray-900/50' : 'shadow-gray-500/20',
        large: isDark ? 'shadow-gray-900/50' : 'shadow-gray-500/30',
      },

      // Utilidades para clases dinámicas
      utils: {
        // Genera clases de Tailwind dinámicas
        bg: (lightClass: string, darkClass: string) => (isDark ? darkClass : lightClass),
        text: (lightClass: string, darkClass: string) => (isDark ? darkClass : lightClass),
        border: (lightClass: string, darkClass: string) => (isDark ? darkClass : lightClass),
      },

      // Estado del tema
      theme: {
        isDark,
        isLight: !isDark,
        activeTheme,
      },
    }),
    [activeTheme, isDark]
  )
}

/**
 * Hook simplificado para obtener colores de iconos
 */
export function useThemeColors() {
  const { icons, theme } = useThemeStyles()
  return { ...icons, ...theme }
}

/**
 * Hook para obtener clases de texto dinámicas
 */
export function useThemeTextClasses() {
  const { text } = useThemeStyles()
  return text
}

/**
 * Hook para obtener clases de fondo dinámicas
 */
export function useThemeBackgroundClasses() {
  const { backgrounds } = useThemeStyles()
  return backgrounds
}
