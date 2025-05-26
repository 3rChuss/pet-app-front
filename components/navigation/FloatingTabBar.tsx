import React from 'react'

import Ionicons from '@expo/vector-icons/Ionicons'
import { View, Text, Pressable, Dimensions } from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

interface FloatingTabBarProps {
  state: any
  descriptors: any
  navigation: any
  unreadNotifications?: number
}

const { width } = Dimensions.get('window')
const TAB_WIDTH = width * 0.16 // Approximate width for each tab
const INDICATOR_SIZE = 48

export function FloatingTabBar({
  state,
  descriptors,
  navigation,
  unreadNotifications = 0,
}: FloatingTabBarProps) {
  const insets = useSafeAreaInsets()
  const translateX = useSharedValue(0)

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    }
  })

  const getTabIcon = (routeName: string, focused: boolean) => {
    const color = focused ? '#FDFDFD' : '#BDBDBD'
    const size = focused ? 26 : 24

    switch (routeName) {
      case 'index':
        return <Ionicons name="home" size={size} color={color} />
      case 'search':
        return <Ionicons name="search" size={size} color={color} />
      case 'map':
        return <Ionicons name="map" size={size} color={color} />
      case 'create':
        return <Ionicons name="add-circle" size={size} color={color} />
      case 'notifications':
        return (
          <View className="relative">
            <Ionicons name="notifications" size={size} color={color} />
            {unreadNotifications > 0 && (
              <View className="absolute -top-1 -right-1 bg-accent-coral rounded-full min-w-[18px] h-[18px] items-center justify-center">
                <Text className="text-neutral-off-white text-xs font-bold font-nunito">
                  {unreadNotifications > 99 ? '99+' : unreadNotifications}
                </Text>
              </View>
            )}
          </View>
        )
      case 'profile':
        return <Ionicons name="person" size={size} color={color} />
      default:
        return <Ionicons name="ellipse" size={size} color={color} />
    }
  }

  React.useEffect(() => {
    const targetX = state.index * 60 + (TAB_WIDTH - INDICATOR_SIZE) / 2
    translateX.value = withSpring(targetX, {
      damping: 20,
      stiffness: 200,
    })
  }, [state.index, translateX])

  return (
    <View
      className="absolute left-4 right-4 bg-neutral-off-white rounded-2xl shadow-lg border border-neutral-light-gray"
      style={{
        bottom: insets.bottom + 4,
        height: 60,
      }}
    >
      {/* Animated Indicator */}
      <Animated.View
        className="absolute bg-primary rounded-full"
        style={[
          {
            width: INDICATOR_SIZE,
            height: INDICATOR_SIZE,
            left: 8,
            bottom: 30,
          },
          animatedIndicatorStyle,
        ]}
      />

      {/* Tab Items */}
      <View className="flex-row flex-1 items-center justify-around px-3">
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key]
          const isFocused = state.index === index

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            })

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params)
            }
          }

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            })
          }

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              onLongPress={onLongPress}
              className="flex-1 items-center justify-center"
              style={{ minHeight: 48 }}
            >
              <Animated.View
                className="items-center justify-center"
                style={[
                  {
                    zIndex: 10,
                    transform: [{ translateY: isFocused ? -25 : 0 }],
                    animationDelay: isFocused ? '0.1s' : '0s',
                    transitionProperty: 'transform',
                    transitionDuration: '0.2s',
                  },
                ]}
              >
                {getTabIcon(route.name, isFocused)}
              </Animated.View>

              {/* Label - only show for non-focused tabs */}
              {!isFocused && (
                <Text
                  className="text-neutral-medium-gray font-nunito text-xs mt-1"
                  numberOfLines={1}
                >
                  {options.title}
                </Text>
              )}
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}
