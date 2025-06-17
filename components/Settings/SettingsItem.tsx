import React from 'react'

import { Ionicons } from '@expo/vector-icons'
import { View, Text, TouchableOpacity } from 'react-native'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from 'react-native-reanimated'

interface SettingsItemProps {
  title: string
  subtitle?: string
  icon: keyof typeof Ionicons.glyphMap
  iconColor?: string
  onPress: () => void
  showChevron?: boolean
  destructive?: boolean
}

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity)

export default function SettingsItem({
  title,
  subtitle,
  icon,
  iconColor = '#0077BE',
  onPress,
  showChevron = true,
  destructive = false,
}: SettingsItemProps) {
  const scale = useSharedValue(1)
  const opacity = useSharedValue(1)

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    }
  })

  const handlePressIn = () => {
    scale.value = withSpring(0.98, {
      damping: 15,
      stiffness: 300,
    })
    opacity.value = withTiming(0.8, { duration: 100 })
  }

  const handlePressOut = () => {
    scale.value = withSpring(1, {
      damping: 15,
      stiffness: 300,
    })
    opacity.value = withTiming(1, { duration: 100 })
  }

  return (
    <AnimatedTouchableOpacity
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
      className="flex-row items-center py-4 px-4 bg-white rounded-xl mb-2"
      activeOpacity={1}
    >
      {/* Icon */}
      <View
        className="w-10 h-10 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: `${iconColor}15` }}
      >
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>

      {/* Content */}
      <View className="flex-1">
        <Text
          className={`text-base font-medium font-nunito ${
            destructive ? 'text-accent-coral' : 'text-neutral-dark-gray'
          }`}
        >
          {title}
        </Text>
        {subtitle && (
          <Text className="text-sm text-neutral-medium-gray font-nunito mt-1">{subtitle}</Text>
        )}
      </View>

      {/* Chevron */}
      {showChevron && (
        <Ionicons name="chevron-forward" size={16} color="#BDBDBD" className="ml-2" />
      )}
    </AnimatedTouchableOpacity>
  )
}
