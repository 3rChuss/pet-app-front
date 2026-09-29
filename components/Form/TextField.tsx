import { useState } from 'react'

import { Text, TextInput, View } from 'react-native'

import { useTheme } from '@/lib/context/ThemeContext'

import type { ReactNode, Ref } from 'react'
import type { TextInputProps } from 'react-native'

export type TextFieldProps = TextInputProps & {
  /** Message shown under the field. When it is set, the field is in the error state. */
  error?: string
  /** Element laid over the right end of the field, such as the show/hide password button. */
  endAdornment?: ReactNode
  ref?: Ref<TextInput>
}

// The error border wins over the focus border, so the field keeps signalling the error while the
// user edits it.
function borderClassName(hasError: boolean, focused: boolean) {
  if (hasError) return 'border-accent-coral'
  return focused ? 'border-primary' : 'border-neutral-medium-gray'
}

/**
 * Text input of the access forms (login, register and forgot password), following the Branding
 * guide: thin gray border, primary border while focused, coral border and message when it has an
 * error, and reduced opacity when it is not editable.
 *
 * The background is opaque so the field looks the same over the dark login video and over the
 * light register background. Every TextInput prop is forwarded to the input.
 */
export default function TextField({
  error,
  endAdornment,
  className = '',
  editable = true,
  onFocus,
  onBlur,
  ref,
  ...inputProps
}: TextFieldProps) {
  const { theme } = useTheme()
  const [focused, setFocused] = useState(false)

  const handleFocus: TextInputProps['onFocus'] = event => {
    setFocused(true)
    onFocus?.(event)
  }

  const handleBlur: TextInputProps['onBlur'] = event => {
    setFocused(false)
    onBlur?.(event)
  }

  return (
    <View>
      <View className={editable ? '' : 'opacity-50'}>
        <TextInput
          ref={ref}
          placeholderTextColor={theme.neutral_medium_gray}
          {...inputProps}
          className={`h-12 rounded-xl border bg-neutral-off-white px-4 py-0 font-nunito text-base text-neutral-dark-gray ${borderClassName(Boolean(error), focused && editable)} ${endAdornment ? 'pr-12' : ''} ${className}`}
          editable={editable}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {endAdornment ? (
          // The right padding of the input (pr-12) leaves room for a 48 px wide adornment.
          <View className="absolute bottom-0 right-0 top-0 justify-center">{endAdornment}</View>
        ) : null}
      </View>
      {error ? (
        <Text aria-live="polite" className="mt-1 font-nunito text-xs text-accent-coral">
          {error}
        </Text>
      ) : null}
    </View>
  )
}
