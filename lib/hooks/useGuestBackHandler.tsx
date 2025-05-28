import { useEffect, useCallback } from 'react'

import { useRouter, useSegments } from 'expo-router'
import { BackHandler } from 'react-native'

import { useGuestModeContext } from '@/lib/context/GuestModeContext'

/**
 * Hook to handle back button behavior for guest users
 * When a guest user presses the back button, redirect them to login screen
 */
export function useGuestBackHandler() {
  const { isGuest, exitGuestMode } = useGuestModeContext()
  const router = useRouter()
  const segments = useSegments()

  const handleGuestBackPress = useCallback(async () => {
    try {
      console.log('Guest user pressed back button, exiting guest mode...')

      // Exit guest mode first
      await exitGuestMode()

      // Navigate to login screen
      router.replace('/(auth)/login')
    } catch (error) {
      console.error('Error handling guest back press:', error)
      // Fallback: just navigate to login
      router.replace('/(auth)/login')
    }
  }, [exitGuestMode, router])

  useEffect(() => {
    // Only handle back press if user is in guest mode
    if (!isGuest) return

    const handleBackPress = (): boolean => {
      // Get current route info
      const inAuthFlow = segments[0] === '(auth)'

      // If already in auth flow, allow normal back behavior
      if (inAuthFlow) {
        return false
      }

      // For any other route while in guest mode, redirect to login
      console.log('Guest back press detected in:', segments)
      handleGuestBackPress()

      // Return true to prevent default back behavior
      return true
    }

    // Add the back handler
    const backSubscription = BackHandler.addEventListener('hardwareBackPress', handleBackPress)

    // Cleanup function
    return () => {
      backSubscription.remove()
    }
  }, [isGuest, handleGuestBackPress, segments])

  return {
    handleGuestBackPress,
  }
}
