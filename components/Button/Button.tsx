import React, { useMemo } from 'react'
import { TouchableOpacity, Text } from 'react-native'

interface ButtonProps {
  title: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'tertiary'
  className?: string // Allows for additional custom styling on the container
  textClassName?: string // Allows for additional custom styling on the text
  disabled?: boolean
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  className = '',
  textClassName = '',
  disabled = false,
}) => {
  // Base theme colors are used by default, e.g., base-accent-coral
  // If you implement a theme switcher, you might pass the current theme prefix as a prop
  // or use a context to dynamically set these prefixes.
  const themePrefix = 'base-' // Assuming 'base' theme for now

  const classNames = useMemo(() => {
    let containerStyle = 'p-3 flex justify-center align-center' // Default button style
    let textStyle = 'font-nunito font-semibold text-2xl' // Nunito Sans SemiBold as per typography guidelines

    switch (variant) {
      case 'primary':
        containerStyle += ` bg-${themePrefix}neutral-off-white rounded-full shadow-md`
        textStyle += ` text-${themePrefix}primary text-center`
        if (disabled) {
          containerStyle = ` p-5 items-center justify-center bg-${themePrefix}neutral-medium-gray rounded-full shadow-md opacity-50`
          textStyle += ` text-${themePrefix}neutral-light-gray`
        }
        break
      case 'secondary':
        containerStyle += ` border border-${themePrefix}primary rounded-md bg-transparent`
        textStyle += ` text-${themePrefix}primary`
        if (disabled) {
          containerStyle = ` p-5 items-center justify-center border border-${themePrefix}neutral-medium-gray rounded-md bg-transparent opacity-50`
          textStyle += ` text-${themePrefix}neutral-medium-gray`
        }
        break
      case 'tertiary':
        containerStyle = 'p-2' // Minimal padding for text buttons
        textStyle += ` text-${themePrefix}primary`
        if (disabled) {
          containerStyle = 'p-2 opacity-50'
          textStyle += ` text-${themePrefix}neutral-medium-gray`
        }
        break
    }
    return { containerStyle, textStyle }
  }, [variant, disabled, themePrefix])

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${classNames.containerStyle} ${className}`}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text className={`${classNames.textStyle} ${textClassName}`}>{title}</Text>
    </TouchableOpacity>
  )
}

export default Button
