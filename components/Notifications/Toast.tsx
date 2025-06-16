import { useEffect, useCallback } from 'react'

import { Ionicons } from '@expo/vector-icons'
import { View, Text, StyleSheet, Dimensions } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  visible: boolean
  message: string
  type: ToastType
  duration?: number
  onHide: () => void
}

const { width } = Dimensions.get('window')

export default function Toast({ visible, message, type, duration = 3000, onHide }: ToastProps) {
  const translateY = useSharedValue(-100)
  const opacity = useSharedValue(0)

  const getToastConfig = (toastType: ToastType) => {
    switch (toastType) {
      case 'success':
        return {
          backgroundColor: '#C8E6C9', // secondary_green
          borderColor: '#228B22',
          iconName: 'checkmark-circle-outline' as const,
          iconColor: '#228B22',
        }
      case 'error':
        return {
          backgroundColor: '#F47C7C', // accent_coral
          borderColor: '#DC143C',
          iconName: 'close-circle-outline' as const,
          iconColor: '#DC143C',
        }
      case 'warning':
        return {
          backgroundColor: '#FFDA63', // accent_yellow
          borderColor: '#DAA520',
          iconName: 'warning-outline' as const,
          iconColor: '#DAA520',
        }
      case 'info':
        return {
          backgroundColor: '#A0D2DB', // primary
          borderColor: '#0077BE',
          iconName: 'information-circle-outline' as const,
          iconColor: '#0077BE',
        }
    }
  }

  const config = getToastConfig(type)

  const hideToast = useCallback(() => {
    translateY.value = withSpring(-100, {
      damping: 15,
      stiffness: 150,
    })
    opacity.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(onHide)()
    })
  }, [translateY, opacity, onHide])

  useEffect(() => {
    if (visible) {
      // Show animation
      translateY.value = withSpring(0, {
        damping: 15,
        stiffness: 150,
      })
      opacity.value = withTiming(1, { duration: 300 })

      // Auto-hide after duration
      const timer = setTimeout(() => {
        hideToast()
      }, duration)

      return () => clearTimeout(timer)
    } else {
      hideToast()
    }
  }, [visible, duration, hideToast, translateY, opacity])

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
      opacity: opacity.value,
    }
  })

  if (!visible && translateY.value === -100 && opacity.value === 0) {
    return null
  }

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View
        style={[
          styles.toast,
          {
            backgroundColor: config.backgroundColor,
            borderColor: config.borderColor,
          },
        ]}
      >
        <Ionicons name={config.iconName} size={20} color={config.iconColor} />
        <Text style={[styles.message, { color: config.iconColor }]} numberOfLines={2}>
          {message}
        </Text>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 50,
    left: 16,
    right: 16,
    zIndex: 9999,
    alignItems: 'center',
  },
  toast: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    maxWidth: width - 32,
    minWidth: width * 0.7,
  },
  message: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'left',
  },
})
