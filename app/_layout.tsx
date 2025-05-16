import '../global.css'
import { useEffect, useState } from 'react'

import AsyncStorage from '@react-native-async-storage/async-storage'
import { ThemeProvider } from '@react-navigation/native'
import { useFonts } from 'expo-font'
import { Slot, Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StyleSheet } from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'

import OnboardingScreen from '@/components/Onboarding/Onboarding'
import { useAuth, hydrateAuth } from '@/lib/auth'
import { ONBOARDING_KEY } from '@/lib/const/onBoarding'
import { useThemeConfig } from '@/lib/hooks/use-theme-config'

import 'react-native-reanimated'
import '@/services/i18n'
import Login from './(auth)/login'

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router'

hydrateAuth()

// Keep the splash screen visible while we load resources
SplashScreen.preventAutoHideAsync()
// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 800,
  fade: true,
})

export default function RootLayout() {
  const status = useAuth.use.status()
  const [fontsLoaded, fontError] = useFonts({
    // Define keys for each font file. These are for expo-font's use.
    // Tailwind CSS will use the font family names (e.g., 'Quicksand', 'Nunito Sans')
    // which should be available after `npx react-native-asset` and proper font file naming.
    'Quicksand-Medium': require('../assets/fonts/Quicksand-Medium.ttf'),
    'Quicksand-SemiBold': require('../assets/fonts/Quicksand-SemiBold.ttf'),
    'Quicksand-Bold': require('../assets/fonts/Quicksand-Bold.ttf'),
    // For Nunito Sans (Variable font), load the main variable font files.
    // Specific weights and styles (like italic) will be derived from these variable fonts.
    'NunitoSans-Variable': require('../assets/fonts/NunitoSans-VariableFont_YTLC,opsz,wdth,wght.ttf'),
    'NunitoSans-Italic-Variable': require('../assets/fonts/NunitoSans-Italic-VariableFont_YTLC,opsz,wdth,wght.ttf'),
  })

  const [onboardingCompleted, setOnboardingCompleted] = useState<boolean | null>(null)

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      try {
        const value = await AsyncStorage.getItem(ONBOARDING_KEY)
        setOnboardingCompleted(value === 'true')
      } catch (e) {
        console.error('Failed to load onboarding status from AsyncStorage', e)
        setOnboardingCompleted(false) // Default to not completed if there's an error
      }
    }
    checkOnboardingStatus()
  }, [])

  useEffect(() => {
    // Hide the splash screen once fonts are loaded AND onboarding status is checked
    if ((fontsLoaded || fontError) && onboardingCompleted !== null) {
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontError, onboardingCompleted])

  useEffect(() => {
    if (fontError) {
      // Log font loading errors
      // You might want to add more sophisticated error handling here
      console.error('Font loading error:', fontError)
    }
  }, [fontError])

  // If fonts are not loaded OR onboarding status is not checked yet, return null (splash screen is visible)
  if ((!fontsLoaded && !fontError) || onboardingCompleted === null) {
    return null
  }

  // If onboarding is not completed, show the OnboardingScreen.
  // OnboardingScreen will navigate to '/(auth)/login' upon completion or skip.
  if (onboardingCompleted === false) {
    return <OnboardingScreen />
  }

  // Apply base styling according to the branding guide.
  // Default background: Blanco Roto (#FDFDFD) -> mapped to 'neutral-off-white' in Tailwind config.
  // NativeWind applies Tailwind classes directly to standard React Native components.
  return (
    <Providers>
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
      >
        {/* Define your main app screens here, they will only be accessible if onboarding is done and user is authenticated */}
        {status === 'signOut' ? (
          // Auth screens are part of the main stack
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        ) : (
          // App screens are part of the main stack
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
        )}
        {/* <Stack.Screen name="home" options={{ headerShown: false }} /> */}
        {/* Add other top-level screens/groups like (protected) if they are direct children of this Stack */}
      </Stack>
    </Providers>
  )
}

function Providers({ children }: { children: React.ReactNode }) {
  const theme = useThemeConfig()
  return (
    <GestureHandlerRootView style={styles.container} className={theme.dark ? `dark` : undefined}>
      <ThemeProvider value={theme}>{children}</ThemeProvider>
    </GestureHandlerRootView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
})
