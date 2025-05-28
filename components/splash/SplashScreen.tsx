import React, { useEffect } from 'react'

import { LinearGradient } from 'expo-linear-gradient'
import { View, Text, StyleSheet } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  interpolate,
  Easing,
} from 'react-native-reanimated'

interface SplashScreenProps {
  progress: number
  onAnimationComplete?: () => void
}

export default function SplashScreen({ progress, onAnimationComplete }: SplashScreenProps) {
  const logoScale = useSharedValue(0.8)
  const logoOpacity = useSharedValue(0)
  const pulseAnimation = useSharedValue(0)
  useEffect(() => {
    // Logo entrance animation
    logoOpacity.value = withTiming(1, { duration: 800 })
    logoScale.value = withTiming(1, { duration: 800 })

    // Pulse animation for loading
    pulseAnimation.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
      -1,
      true
    )
  }, [logoOpacity, logoScale, pulseAnimation])

  useEffect(() => {
    if (progress >= 100 && onAnimationComplete) {
      // Small delay before calling completion
      const timer = setTimeout(onAnimationComplete, 300)
      return () => clearTimeout(timer)
    }
  }, [progress, onAnimationComplete])

  const animatedLogoStyle = useAnimatedStyle(() => {
    return {
      opacity: logoOpacity.value,
      transform: [{ scale: logoScale.value }],
    }
  })

  const animatedPulseStyle = useAnimatedStyle(() => {
    const scale = interpolate(pulseAnimation.value, [0, 1], [1, 1.1])
    const opacity = interpolate(pulseAnimation.value, [0, 1], [0.7, 1])

    return {
      transform: [{ scale }],
      opacity,
    }
  })

  const progressBarStyle = useAnimatedStyle(() => {
    const width = interpolate(progress, [0, 100], [0, 200])
    return {
      width: withTiming(width, { duration: 300 }),
    }
  })

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#FFDA63', '#FDFDFD', '#A0D2DB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1.2, y: 1 }}
        style={styles.gradient}
      />

      <View style={styles.content}>
        <Animated.View style={[styles.logoContainer, animatedLogoStyle]}>
          <Animated.View style={[styles.logoCircle, animatedPulseStyle]}>
            <Text style={styles.logoText}>🐾</Text>
          </Animated.View>
          <Text style={styles.brandText}>Petopia</Text>
          <Text style={styles.taglineText}>Tu mascota merece una vida social</Text>
        </Animated.View>

        {/* Progress Indicator */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <Animated.View style={[styles.progressFill, progressBarStyle]} />
          </View>
          <Text style={styles.progressText}>{Math.round(progress)}%</Text>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 80,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(160, 210, 219, 0.2)', // primary color with opacity
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 2,
    borderColor: '#A0D2DB',
  },
  logoText: {
    fontSize: 48,
  },
  brandText: {
    fontSize: 36,
    fontFamily: 'Quicksand-Bold',
    color: '#A0D2DB', // primary color
  },
  taglineText: {
    fontSize: 16,
    fontFamily: 'NunitoSans-Variable',
    color: '#666666', // neutral-dark-gray
    textAlign: 'center',
    maxWidth: 250,
  },
  progressContainer: {
    alignItems: 'center',
    position: 'absolute',
    bottom: 100,
  },
  progressBar: {
    width: 200,
    height: 4,
    backgroundColor: 'rgba(160, 210, 219, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#A0D2DB', // primary color
    borderRadius: 2,
  },
  progressText: {
    fontSize: 14,
    fontFamily: 'NunitoSans-Variable',
    color: '#666666',
  },
})
