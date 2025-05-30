import { useEffect, useState } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { useFonts } from 'expo-font'

import { useAuth } from '@/lib/auth'
import { ONBOARDING_KEY } from '@/lib/const/onBoarding'

import { useErrorRecovery } from './useErrorRecovery'
import { useGuestMode } from './useGuestMode'

export type AppState =
  | 'initializing' // Initial app load and verification
  | 'loading' // Loading resources
  | 'onboarding' // First time user
  | 'guest' // Anonymous browsing mode
  | 'authenticated' // User is logged in
  | 'unauthenticated' // Needs authentication
  | 'error' // Critical error occurred

interface InitializationResult {
  appState: AppState
  progress: number
  error?: string
  errorInfo?: any
  enterGuestMode: () => void
  retryInitialization: () => void
  clearError: () => void
}

export function useAppInitialization(): InitializationResult {
  const { enterGuestMode } = useGuestMode()
  const { reportError, clearError: clearRecoveryError } = useErrorRecovery()
  const [appState, setAppState] = useState<AppState>('initializing')
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string>()
  const [errorInfo, setErrorInfo] = useState<any>()

  const authStatus = useAuth.use.status()
  const onEnterGuestMode = () => {
    setAppState('guest')
    enterGuestMode()
  }

  const retryInitialization = () => {
    setError(undefined)
    setErrorInfo(undefined)
    setAppState('initializing')
    setProgress(0)
    clearRecoveryError()
  }

  const clearError = () => {
    setError(undefined)
    setErrorInfo(undefined)
    clearRecoveryError()
  }

  const [fontsLoaded, fontError] = useFonts({
    'Quicksand-Medium': require('../../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-SemiBold': require('../../assets/fonts/Quicksand-SemiBold.ttf'),
    'Quicksand-Bold': require('../../assets/fonts/Quicksand-Bold.ttf'),
    'NunitoSans-Variable': require('../../assets/fonts/NunitoSans-VariableFont_YTLC,opsz,wdth,wght.ttf'),
    'NunitoSans-Italic-Variable': require('../../assets/fonts/NunitoSans-Italic-VariableFont_YTLC,opsz,wdth,wght.ttf'),
  })

  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null)

  useEffect(() => {
    const initializeApp = async () => {
      try {
        setAppState('loading')
        setProgress(10)

        // Step 1: Check onboarding status
        setProgress(30)
        const onboardingValue = await AsyncStorage.getItem(ONBOARDING_KEY)
        const isOnboardingCompleted = onboardingValue === 'true'
        setOnboardingCompleted(isOnboardingCompleted)

        setProgress(60)

        // Step 2: Wait for fonts to load
        if (fontError) {
          console.error('Font loading error:', fontError)
          const errorInfo = {
            type: 'font-loading',
            message: 'Error loading fonts',
            originalError: fontError,
            severity: 'medium',
          }
          setError('Error loading fonts')
          setErrorInfo(errorInfo)
          setAppState('error')
          await reportError('font-loading', new Error('Font loading failed'), { fontError })
          return
        }

        if (!fontsLoaded) {
          return // Wait for fonts
        }

        setProgress(80)

        // Step 3: Determine final app state
        if (!isOnboardingCompleted) {
          setProgress(100)
          setAppState('onboarding')
          return
        }

        // Step 4: Check authentication status
        setProgress(90)
        if (authStatus === 'signOut') {
          setProgress(100)
          setAppState('unauthenticated')
        } else if (authStatus === 'signIn') {
          setProgress(100)
          setAppState('authenticated')
        } else {
          // Still loading auth state
          setProgress(95)
          // Will be handled by authStatus change
        }
      } catch (err) {
        console.error('App initialization error:', err)
        const errorInfo = {
          type: 'initialization',
          message: 'Failed to initialize app',
          originalError: err,
          severity: 'high',
        }
        setError('Failed to initialize app')
        setErrorInfo(errorInfo)
        setAppState('error')
        await reportError('initialization', err as Error, { step: 'initialization' })
      }
    }

    initializeApp()
  }, [fontsLoaded, fontError, authStatus, reportError])

  // Handle auth status changes
  useEffect(() => {
    if (appState === 'loading' && onboardingCompleted === true && fontsLoaded) {
      if (authStatus === 'signOut') {
        setProgress(100)
        setAppState('unauthenticated')
      } else if (authStatus === 'signIn') {
        setProgress(100)
        setAppState('authenticated')
      }
    }
  }, [authStatus, appState, onboardingCompleted, fontsLoaded])

  return {
    appState,
    progress,
    error,
    errorInfo,
    enterGuestMode: onEnterGuestMode,
    retryInitialization,
    clearError,
  }
}
