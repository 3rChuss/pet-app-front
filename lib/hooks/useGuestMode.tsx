import { useState, useCallback, useEffect } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'

import { GUEST_MODE_CONFIG, MOCK_POSTS, MOCK_PROFILES } from '@/lib/const/mockData'
import { UserMode } from '@/lib/types/guest-mode'

const GUEST_MODE_KEY = '@petopia_guest_mode'
const GUEST_INTERACTIONS_KEY = '@petopia_guest_interactions'

export function useGuestMode() {
  const [userMode, setUserMode] = useState<UserMode>('unauthenticated')
  const [interactionCount, setInteractionCount] = useState(0)
  const [showCTA, setShowCTA] = useState(false)

  const loadGuestModeState = useCallback(async () => {
    try {
      const [guestMode, interactions] = await Promise.all([
        AsyncStorage.getItem(GUEST_MODE_KEY),
        AsyncStorage.getItem(GUEST_INTERACTIONS_KEY),
      ])

      if (guestMode === 'guest') {
        setUserMode('guest')
      }

      if (interactions) {
        setInteractionCount(parseInt(interactions, 10) || 0)
      }
    } catch (error) {
      console.error('Error loading guest mode state:', error)
    }
  }, [])

  // Load guest mode state on mount
  useEffect(() => {
    loadGuestModeState()
  }, [loadGuestModeState])

  const enterGuestMode = useCallback(async () => {
    try {
      console.log('Entering guest mode')
      await AsyncStorage.setItem(GUEST_MODE_KEY, 'guest')
      setUserMode('guest')
      setInteractionCount(0)
    } catch (error) {
      console.error('Error entering guest mode:', error)
    }
  }, [])

  const exitGuestMode = useCallback(async () => {
    try {
      await Promise.all([
        AsyncStorage.removeItem(GUEST_MODE_KEY),
        AsyncStorage.removeItem(GUEST_INTERACTIONS_KEY),
      ])
      setUserMode('unauthenticated')
      setInteractionCount(0)
      setShowCTA(false)
    } catch (error) {
      console.error('Error exiting guest mode:', error)
    }
  }, [])

  const trackInteraction = useCallback(async () => {
    if (userMode !== 'guest') return

    const newCount = interactionCount + 1
    setInteractionCount(newCount)

    try {
      await AsyncStorage.setItem(GUEST_INTERACTIONS_KEY, newCount.toString())
    } catch (error) {
      console.error('Error tracking interaction:', error)
    }

    // Show CTA based on frequency
    if (newCount % GUEST_MODE_CONFIG.ctaFrequency === 0) {
      setShowCTA(true)
    }
  }, [userMode, interactionCount])

  const dismissCTA = useCallback(() => {
    setShowCTA(false)
  }, [])

  const isFeatureRestricted = useCallback(
    (feature: string) => {
      return userMode === 'guest' && GUEST_MODE_CONFIG.restrictedFeatures.includes(feature)
    },
    [userMode]
  )

  const isScreenAllowed = useCallback(
    (screen: string) => {
      return userMode !== 'guest' || GUEST_MODE_CONFIG.allowedScreens.includes(screen)
    },
    [userMode]
  )

  const getRestrictedFeatureMessage = useCallback((feature: string) => {
    const messages: Record<string, string> = {
      create: '¡Únete a Petopia para compartir momentos con tu mascota!',
      like: 'Regístrate para dar me gusta a las publicaciones',
      comment: 'Únete para comentar y conectar con otros dueños',
      share: 'Crea tu cuenta para compartir contenido',
      follow: 'Regístrate para seguir a otros usuarios',
      message: 'Únete para enviar mensajes privados',
    }
    return messages[feature] || '¡Únete a Petopia para acceder a esta función!'
  }, [])
  return {
    config: GUEST_MODE_CONFIG,
    mockPosts: MOCK_POSTS,
    mockProfiles: MOCK_PROFILES,
    userMode,
    interactionCount,
    showCTA,
    enterGuestMode,
    exitGuestMode,
    trackInteraction,
    dismissCTA,
    isFeatureRestricted,
    isScreenAllowed,
    getRestrictedFeatureMessage,
    isGuestMode: userMode === 'guest',
    isAuthenticated: userMode === 'authenticated',
  }
}
