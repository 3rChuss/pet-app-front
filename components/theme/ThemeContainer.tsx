import { ReactNode } from 'react'

import { View, ViewProps } from 'react-native'

import { useActiveTheme } from '@/lib/context/ThemeContext'

interface ThemeContainerProps extends ViewProps {
  children: ReactNode
  lightClass?: string
  darkClass?: string
}

/**
 * Contenedor que aplica automáticamente clases de tema
 * Útil para componentes que necesitan comportamiento diferente en light/dark
 */
export function ThemeContainer({
  children,
  lightClass = '',
  darkClass = '',
  className = '',
  ...props
}: ThemeContainerProps) {
  const activeTheme = useActiveTheme()
  const isDark = activeTheme === 'dark'

  const themeClass = isDark ? darkClass : lightClass
  const finalClassName = `${className} ${themeClass}`.trim()

  return (
    <View className={finalClassName} {...props}>
      {children}
    </View>
  )
}

/**
 * Hook para obtener clases dinámicas basadas en el tema
 */
export function useThemeClass(lightClass: string, darkClass: string) {
  const activeTheme = useActiveTheme()
  return activeTheme === 'dark' ? darkClass : lightClass
}
