import React from 'react'

import { View, Text, Pressable, Dimensions } from 'react-native'
import Animated, { useSharedValue, withSpring } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import ZookiIcon from '../icons/ZookiIcon'

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

  const getTabIcon = (routeName: string, focused: boolean) => {
    const color = focused ? '#A0D2DB' : '#BDBDBD'
    const size = focused ? 26 : 24

    switch (routeName) {
      case 'index':
        return <ZookiIcon name="home" size={size} color={color} />
      case 'search':
        return <ZookiIcon name="search" size={size} color={color} />
      case 'map':
        return <ZookiIcon name="map" size={size} color={color} />
      // case 'create':
      //   return <ZookiIcon name="add-circle" size={size} color={color} />
      case 'notifications':
        return (
          <View className="relative">
            <ZookiIcon name="notifications" size={size} color={color} />
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
        return <ZookiIcon name="person" size={size} color={color} />
      default:
        return <ZookiIcon name="ellipse" size={size} color={color} />
    }
  }

  React.useEffect(() => {
    const targetX = state.index * 60 + (TAB_WIDTH - INDICATOR_SIZE) / 2
    translateX.value = withSpring(targetX, {
      damping: 20,
      stiffness: 200,
    })
  }, [state.index, translateX])

  const filteredRoutes = state.routes.filter((route: any) => !route.name.includes('disabled'))

  return (
    <View
      className="absolute left-4 right-4 bg-neutral-off-white rounded-2xl shadow-lg border border-neutral-light-gray"
      style={{
        bottom: insets.bottom + 4,
        height: 60,
      }}
    >
      {/* Tab Items */}
      <View className="flex-row flex-1 items-center justify-around px-3">
        {filteredRoutes.map((route: any, index: number) => {
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
              className="flex-1 items-center justify-center mt-1"
              style={{ minHeight: 48 }}
            >
              <Animated.View className="items-center justify-center z-10">
                {getTabIcon(route.name, isFocused)}
              </Animated.View>
              <Text
                className={`font-nunito text-xs mt-1 ${
                  isFocused ? 'text-primary font-semibold' : 'text-neutral-medium-gray'
                }`}
                numberOfLines={1}
              >
                {options.title}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}
