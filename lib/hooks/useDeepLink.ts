import { useEffect, useState, useCallback } from 'react'

import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'

/**
 * Hook personalizado para manejar deep links entrantes
 * Especialmente útil para URLs de restablecimiento de contraseña
 */
export function useDeepLink() {
  const [initialUrl, setInitialUrl] = useState<string | null>(null)
  const [isReady, setIsReady] = useState(false)
  const router = useRouter()

  const handleDeepLink = useCallback(
    (url: string) => {
      try {
        // Solo procesar URLs que empiecen con nuestro esquema
        if (!url.startsWith('petopia://')) {
          console.log('Ignoring non-petopia URL:', url)
          return
        }

        // Parsear la URL usando Expo Linking
        const parsed = Linking.parse(url)
        console.log('Parsed Deep Link URL:', parsed)

        // Manejar rutas específicas
        if (parsed.path === 'auth/reset-password') {
          const { token, email } = parsed.queryParams || {}

          if (token && email) {
            console.log('Navigating to reset password with params:', { token, email })
            router.push(`/(auth)/reset-password?token=${token}&email=${email}`)
          } else {
            console.warn('Missing required parameters for reset password:', { token, email })
            router.push('/(auth)/login')
          }
        } else if (parsed.path === 'auth/verify-email') {
          // Manejar verificación de email si es necesario
          const { id, hash, signature } = parsed.queryParams || {}

          if (id && hash && signature) {
            console.log('Navigating to verify email with params:', { id, hash, signature })
            router.push(`/(auth)/verify-email?id=${id}&hash=${hash}&signature=${signature}`)
          } else {
            console.warn('Missing required parameters for email verification:', {
              id,
              hash,
              signature,
            })
            router.push('/(auth)/login')
          }
        } else {
          // Ruta desconocida, solo navegar al login si es un deep link válido
          console.log('Unknown deep link path, but valid petopia scheme:', parsed.path)
          router.push('/(auth)/login')
        }
      } catch (error) {
        console.error('Error handling deep link:', error)
        // Solo navegar al login si era un deep link válido
        if (url.startsWith('petopia://')) {
          router.push('/(auth)/login')
        }
      }
    },
    [router]
  )

  useEffect(() => {
    // Obtener la URL inicial cuando la app se abre por primera vez
    const getInitialURL = async () => {
      try {
        const url = await Linking.getInitialURL()
        setInitialUrl(url)
        setIsReady(true)

        // Solo procesar si es un deep link válido (no URLs internas de desarrollo)
        if (url && url.startsWith('petopia://')) {
          console.log('Initial Deep Link URL received:', url)
          handleDeepLink(url)
        } else if (url) {
          console.log('Initial URL ignored (not a deep link):', url)
        }
      } catch (error) {
        console.error('Error getting initial URL:', error)
        setIsReady(true)
      }
    }

    // Escuchar cambios de URL cuando la app ya está abierta
    const subscription = Linking.addEventListener('url', event => {
      console.log('URL received while app is open:', event.url)
      handleDeepLink(event.url)
    })

    getInitialURL()

    return () => {
      subscription?.remove()
    }
  }, [handleDeepLink])

  return {
    initialUrl,
    isReady,
    handleDeepLink,
  }
}

export default useDeepLink
