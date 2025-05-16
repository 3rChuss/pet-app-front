import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Text, TextInput, View, KeyboardAvoidingView } from 'react-native'
import * as z from 'zod'

import type { SubmitHandler } from 'react-hook-form'

const schema = z.object({
  name: z.string().optional(),
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
  password: z
    .string({
      required_error: 'Password is required',
    })
    .min(6, 'Password must be at least 6 characters'),
})

export type FormType = z.infer<typeof schema>

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>
}

export const LoginForm = ({ onSubmit = () => {} }: LoginFormProps) => {
  const { handleSubmit, control } = useForm<FormType>({
    resolver: zodResolver(schema),
  })
  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" keyboardVerticalOffset={10}>
      <View className="flex-1 justify-center p-4">
        <View className="items-center justify-center">
          <Text testID="form-title" className="pb-6 text-center text-4xl font-bold">
            Sign In
          </Text>

          <Text className="mb-6 max-w-xs text-center text-gray-500">
            Welcome! 👋 This is a demo login screen! Feel free to use any email and password to sign
            in and try it out.
          </Text>
        </View>

        <Text testID="name-label" className="mb-2 text-sm font-semibold">
          Name
        </Text>
        <TextInput
          testID="name-input"
          placeholder="John Doe"
          className="mb-4 border-b border-gray-300 p-2"
          {...control.register('name')}
        />

        <Text testID="email-label" className="mb-2 text-sm font-semibold">
          Email
        </Text>
        <TextInput
          testID="email-input"
          placeholder="john.doe@example.com"
          className="mb-4 border-b border-gray-300 p-2"
          {...control.register('email')}
        />

        <Text testID="password-label" className="mb-2 text-sm font-semibold">
          Password
        </Text>
        <TextInput
          testID="password-input"
          placeholder="***"
          secureTextEntry={true}
          className="mb-4 border-b border-gray-300 p-2"
          {...control.register('password')}
        />

        {/* <Button testID="login-button" label="Login" onPress={handleSubmit(onSubmit)} /> */}
      </View>
    </KeyboardAvoidingView>
  )
}
