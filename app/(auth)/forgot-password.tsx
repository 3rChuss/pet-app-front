import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useRouter } from 'expo-router'
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import {
  View,
  Text,
  TextInput,
  Pressable,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import * as z from 'zod'

import Button from '@/components/Button/Button'
import { Container } from '@/components/containers/Container'

const schema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
})

type ForgotPasswordFormType = z.infer<typeof schema>

export default function ForgotPasswordScreen() {
  const router = useRouter()
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<ForgotPasswordFormType> = async data => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    console.log('Forgot password for:', data.email)
    Alert.alert(
      'Revisa tu Email',
      `Si existe una cuenta para ${data.email}, recibirás un enlace para restablecer tu contraseña.`,
      [{ text: 'OK', onPress: () => router.back() }]
    )
  }

  return (
    <Container className="bg-neutral-off-white flex-1">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View className="flex-1 justify-center p-6">
          <View className="items-center mb-10">
            <Text className="text-4xl font-bold text-primary mb-3">¿Olvidaste tu Contraseña?</Text>
            <Text className="text-center text-neutral-dark-gray max-w-xs">
              No te preocupes. Ingresa tu email y te enviaremos instrucciones para restablecerla.
            </Text>
          </View>

          <View className="mb-4">
            <Text className="mb-2 text-sm font-semibold text-neutral-dark-gray">Email</Text>
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder="tuemail@ejemplo.com"
                  className="border-b border-neutral-medium-gray p-3 text-neutral-dark-gray bg-neutral-light-gray rounded-md"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.email && <Text className="mt-1 text-accent-coral">{errors.email.message}</Text>}
          </View>

          <Button
            label="Enviar Instrucciones"
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            className="mb-6"
            disabled={isSubmitting}
            isLoading={isSubmitting}
          />

          <Link href="/login" asChild>
            <Pressable className="self-center">
              <Text className="text-sm text-primary">Volver a Iniciar Sesión</Text>
            </Pressable>
          </Link>
        </View>
      </KeyboardAvoidingView>
    </Container>
  )
}
