import '../global.css'
import { useEffect } from 'react'

import { ThemeProvider } from '@react-navigation/native'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import OnboardingScreen from '@/components/Onboarding/Onboarding'
import ErrorScreen from '@/components/splash/ErrorScreen'
import SplashScreenComponent from '@/components/splash/SplashScreen'
import { hydrateAuth } from '@/lib/auth'
import { GuestModeProvider } from '@/lib/context/GuestModeContext'
import { NotificationProvider } from '@/lib/context/NotificationProvider'
import { useAppInitialization, useGuestBackHandler } from '@/lib/hooks'
import { useThemeConfig } from '@/lib/hooks/useThemeConfig'
import 'react-native-reanimated'
import '@/services/i18n'
import { UserMode } from '@/lib/types/guest-mode'

export { ErrorBoundary } from 'expo-router'

// App state types for better state management
export type AppState =
  | 'initializing' // Initial app load and verification
  | 'loading' // Loading resources
  | 'onboarding' // First time user
  | 'guest' // Anonymous browsing mode
  | 'authenticated' // User is logged in
  | 'unauthenticated' // Needs authentication
  | 'error' // Critical error occurred

hydrateAuth()

// Keep the splash screen visible while we load resources
SplashScreen.preventAutoHideAsync()
// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 800,
  fade: true,
})

export default function RootLayout() {
  const { appState, progress, error, errorInfo, enterGuestMode, retryInitialization } =
    useAppInitialization()

  const userMode =
    appState === 'guest'
      ? 'guest'
      : appState === 'authenticated'
        ? 'authenticated'
        : 'unauthenticated'

  // Hide the native splash screen once our custom splash is ready
  useEffect(() => {
    if (appState !== 'initializing') {
      SplashScreen.hideAsync()
    }
  }, [appState])

  // Show custom splash screen during initialization and loading
  if (appState === 'initializing' || appState === 'loading') {
    return <SplashScreenComponent progress={progress} onAnimationComplete={() => {}} />
  }
  // Show error screen if critical error occurred
  if (appState === 'error') {
    return (
      <Providers userMode={userMode}>
        <ErrorScreen
          error={errorInfo || error}
          onRetry={retryInitialization}
          onGuestMode={enterGuestMode}
          isRecovering={false}
        />
      </Providers>
    )
  }
  // Show onboarding for first-time users
  if (appState === 'onboarding') {
    return <OnboardingScreen onGuestMode={enterGuestMode} />
  }
  // Show main app with appropriate initial route
  const initialRoute =
    appState === 'authenticated' ? '(tabs)' : appState === 'guest' ? '(tabs)' : '(auth)'

  return (
    <Providers userMode={userMode}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: 'neutral-off-white',
          },
          headerTintColor: 'neutral-dark-gray',
          headerTitleStyle: {
            fontFamily: 'NunitoSans-Variable',
            fontWeight: '600',
          },
        }}
        initialRouteName={initialRoute}
      >
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen
          name="settings"
          options={{
            title: 'Configuración',
            headerTitleAlign: 'left',
            headerTitleStyle: {
              fontFamily: 'NunitoSans-Variable',
              fontWeight: '800',
              fontSize: 16,
            },
          }}
        />
      </Stack>
    </Providers>
  )
}

function Providers({ children, userMode }: { children: React.ReactNode; userMode: UserMode }) {
  const theme = useThemeConfig()
  return (
    <GestureHandlerRootView style={styles.container} className={theme.dark ? `dark` : undefined}>
      <GuestModeProvider userMode={userMode}>
        <NotificationProvider>
          <ThemeProvider value={theme}>
            <GuestBackHandlerWrapper>{children}</GuestBackHandlerWrapper>
          </ThemeProvider>
        </NotificationProvider>
      </GuestModeProvider>
    </GestureHandlerRootView>
  )
}

function GuestBackHandlerWrapper({ children }: { children: React.ReactNode }) {
  // This hook must be used inside GuestModeProvider
  useGuestBackHandler()
  return <>{children}</>
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
