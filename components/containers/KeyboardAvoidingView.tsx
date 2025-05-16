import { KeyboardAvoidingView as KeyboardAvoidingViewNative, Platform } from 'react-native'

export const KeyboardAvoidingView = ({
  children,
  className = '',
}: {
  children: React.ReactNode
  className?: string
}) => {
  return (
    <KeyboardAvoidingViewNative
      className={className}
      behavior={Platform.OS === 'ios' ? 'padding' : 'position'}
    >
      {children}
    </KeyboardAvoidingViewNative>
  )
}
