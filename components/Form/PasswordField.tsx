import { useState } from 'react'

import { Eye, EyeOff } from 'lucide-react-native'
import { useTranslation } from 'react-i18next'
import { TouchableOpacity } from 'react-native'

import TextField from '@/components/Form/TextField'
import { useTheme } from '@/lib/context/ThemeContext'

import type { TextFieldProps } from '@/components/Form/TextField'

// The field owns the visibility of the password, and the button is its only adornment.
export type PasswordFieldProps = Omit<TextFieldProps, 'secureTextEntry' | 'endAdornment'>

/** TextField with a button that shows or hides the password. */
export default function PasswordField({ editable = true, ...fieldProps }: PasswordFieldProps) {
  const { t } = useTranslation()
  const { theme } = useTheme()
  const [visible, setVisible] = useState(false)
  const Icon = visible ? EyeOff : Eye

  return (
    <TextField
      {...fieldProps}
      editable={editable}
      secureTextEntry={!visible}
      endAdornment={
        <TouchableOpacity
          testID="toggle-password-visibility"
          accessibilityRole="button"
          accessibilityLabel={t(visible ? 'common.hide_password' : 'common.show_password')}
          className="h-12 w-12 items-center justify-center"
          activeOpacity={0.7}
          disabled={!editable}
          onPress={() => setVisible(current => !current)}
        >
          <Icon size={20} color={theme.neutral_dark_gray} />
        </TouchableOpacity>
      }
    />
  )
}
