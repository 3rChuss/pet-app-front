import { useEffect, useCallback } from 'react'

import { router } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useVideoPlayer, VideoView } from 'expo-video'
import { View, StyleSheet, ScrollView, KeyboardAvoidingView, Platform } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'

import DeepLinkTester from '@/components/test/DeepLinkTester'
import { LoginForm } from '@/features/auth'
import { login } from '@/features/auth/services/auth'
import { useAuth } from '@/lib/auth'
import { useApiError, useKeyboard, useLoadingState } from '@/lib/hooks'

const assetId = require('@/assets/videos/home_background.mp4')

export default function Login() {
  const signIn = useAuth.use.signIn()
  const { keyboardVisible } = useKeyboard()
  const { handleApiError } = useApiError()
  const { setLoading, loadingStates } = useLoadingState()

  // Loading states for different operations
  const isLoginLoading = loadingStates.login || false

  const player = useVideoPlayer({ assetId }, player => {
    player.loop = true
    player.volume = 0 // Muted
    player.play()
  })

  // Animated values for smooth transitions
  const logoScale = useSharedValue(1)
  const logoHeight = useSharedValue(250)
  const textScale = useSharedValue(1)
  const formOpacity = useSharedValue(0.9)

  // Update animations when keyboard state changes
  useEffect(() => {
    if (keyboardVisible) {
      logoScale.value = withSpring(1, { damping: 15, stiffness: 150 })
      logoHeight.value = withSpring(120, { damping: 15, stiffness: 150 })
      textScale.value = withSpring(0.8, { damping: 15, stiffness: 150 })
      formOpacity.value = withSpring(1, { damping: 20, stiffness: 200 })
    } else {
      logoScale.value = withSpring(1, { damping: 15, stiffness: 150 })
      logoHeight.value = withSpring(250, { damping: 15, stiffness: 150 })
      textScale.value = withSpring(1, { damping: 15, stiffness: 150 })
      formOpacity.value = withSpring(0.9, { damping: 20, stiffness: 200 })
    }
  }, [keyboardVisible, logoScale, logoHeight, textScale, formOpacity])

  // Animated styles
  const animatedLogoContainerStyle = useAnimatedStyle(() => {
    return {
      height: logoHeight.value,
      transform: [{ scale: logoScale.value }],
    }
  })
  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: textScale.value }],
    }
  })

  const animatedFormStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
    }
  })

  const handleLogin = useCallback(
    async (data: { email: string; password: string }) => {
      // Prevent multiple submissions
      if (isLoginLoading) {
        console.warn('Login already in progress, ignoring duplicate submission')
        return
      }

      const operationKey = 'login'

      try {
        setLoading(operationKey, true)
        const { email, password } = data

        const response = await login(email, password)
        await signIn(response.data)

        // Navigate to home after successful login
        router.push('/(tabs)')
      } catch (error) {
        console.error('Login error:', error)
        handleApiError(error, 'Login failed')
      } finally {
        setLoading(operationKey, false)
      }
    },
    [isLoginLoading, setLoading, signIn, handleApiError]
  )

  const handleGoogleSignIn = useCallback(() => {
    if (isLoginLoading) return // Prevent action during login
    console.log('Google Sign In Pressed')
    // Implement Google Sign-In logic here
  }, [isLoginLoading])

  const handleFacebookSignIn = useCallback(() => {
    if (isLoginLoading) return // Prevent action during login
    console.log('Facebook Sign In Pressed')
    // Implement Facebook Sign-In logic here
  }, [isLoginLoading])

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <DeepLinkTester />
      <StatusBar style="inverted" />
      <VideoView
        player={player}
        style={styles.video}
        playsInline
        contentFit="cover"
        nativeControls={false}
      />
      <View style={styles.overlay} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="interactive"
        bounces={false}
        overScrollMode="never"
      >
        <Animated.View style={[styles.logoContainer, animatedLogoContainerStyle]}>
          {/* TODO: Replace with your actual logo if available */}
          {/* <Image source={require('@/assets/images/petopia_logo.png')} className="w-40 h-20" resizeMode="contain" /> */}
          <Animated.Text
            style={[animatedTextStyle]}
            className="text-5xl font-bold text-neutral-off-white"
          >
            petopia logo
          </Animated.Text>
        </Animated.View>

        {/* Login Form */}
        <Animated.View style={[styles.formContainer, animatedFormStyle]}>
          <LoginForm
            onSubmit={handleLogin}
            onGoogleSignIn={handleGoogleSignIn}
            onFacebookSignIn={handleFacebookSignIn}
            isLoading={isLoginLoading}
          />
        </Animated.View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: 'transparent',
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    zIndex: -1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for better text visibility
    zIndex: -1,
  },
  scrollContent: {
    flexGrow: 1,
    minHeight: '100%',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  logoContainer: {
    flex: 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 40,
  },
  formContainer: {
    flex: 2,
    width: '100%',
    paddingBottom: 40,
  },
})
