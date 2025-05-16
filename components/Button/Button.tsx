import React, { useMemo } from 'react'

import { TouchableOpacity, Text } from 'react-native'

interface ButtonProps {
  label: string
  onPress: () => void
  variant?: 'primary' | 'secondary' | 'tertiary' | 'outline'
  className?: string // Allows for additional custom styling on the container
  textClassName?: string // Allows for additional custom styling on the text
  disabled?: boolean
  testID?: string // For testing purposes
  icon?: React.ReactNode // Optional icon to be displayed alongside the text
  isLoading?: boolean // Optional loading state
}

const Button: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary',
  className = '',
  textClassName = '',
  disabled = false,
  testID = '',
  icon = null,
  isLoading = false,
}) => {
  const classNames = useMemo(() => {
    let containerStyle =
      'p-3 flex justify-center align-center' + (icon ? ' flex-row gap-4 items-center' : ' flex-col')
    let textStyle = 'font-nunito font-semibold text-2xl' // Nunito Sans SemiBold as per typography guidelines

    switch (variant) {
      case 'primary':
        containerStyle += ` bg-neutral-off-white rounded-full shadow-md`
        textStyle += ` text-primary text-center`
        if (disabled) {
          containerStyle = ` p-5 items-center justify-center bg-neutral-medium-gray rounded-full shadow-md opacity-50`
          textStyle += ` text-neutral-light-gray`
        }
        break
      case 'secondary':
        containerStyle += ` border border-primary rounded-md bg-transparent`
        textStyle += ` text-primary`
        if (disabled) {
          containerStyle = ` p-5 items-center justify-center border border-neutral-medium-gray rounded-md bg-transparent opacity-50`
          textStyle += ` text-neutral-medium-gray`
        }
        break
      case 'tertiary':
        containerStyle = 'p-2' // Minimal padding for text buttons
        textStyle += ` text-primary`
        if (disabled) {
          containerStyle = 'p-2 opacity-50'
          textStyle += ` text-neutral-medium-gray`
        }
        break
      case 'outline':
        containerStyle += ` border border-primary rounded-md bg-transparent`
        textStyle += ` text-primary`
        if (disabled) {
          containerStyle = ` p-5 items-center justify-center border border-neutral-medium-gray rounded-md bg-transparent opacity-50`
          textStyle += ` text-neutral-medium-gray`
        }
    }
    return { containerStyle, textStyle }
  }, [variant, disabled, icon])

  return (
    <TouchableOpacity
      onPress={onPress}
      className={`${className} ${classNames.containerStyle}`}
      disabled={disabled || isLoading}
      style={{ opacity: isLoading ? 0.5 : 1 }} // Optional loading state
      activeOpacity={0.7}
      testID={testID}
    >
      {icon && <>{icon}</>}
      <Text className={`${classNames.textStyle} ${textClassName}`}>{label}</Text>
    </TouchableOpacity>
  )
}

export default Button
