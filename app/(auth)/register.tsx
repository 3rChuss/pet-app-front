import { zodResolver } from '@hookform/resolvers/zod'
import { Checkbox } from 'expo-checkbox' // Assuming expo-checkbox is installed
import { LinearGradient } from 'expo-linear-gradient'
import { Link, useRouter } from 'expo-router'
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { View, Text, TextInput, Pressable, Alert, ScrollView, StyleSheet } from 'react-native'
import * as z from 'zod'

import Button from '@/components/Button/Button'
import { Container } from '@/components/containers/Container'
import { KeyboardAvoidingView } from '@/components/containers/KeyboardAvoidingView'
import BackTop from '@/components/features/BackTop'
import { useAuth } from '@/lib/auth' // To potentially sign in the user after registration

const passwordSchema = z
  .string()
  .min(8, 'La contraseña debe tener al menos 8 caracteres')
  .regex(/[a-z]/, 'Debe contener al menos una minúscula')
  .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
  .regex(/[0-9]/, 'Debe contener al menos un número')
  .regex(/[^a-zA-Z0-9]/, 'Debe contener al menos un carácter especial')

const schema = z
  .object({
    email: z.string().email('Formato de email inválido'),
    password: passwordSchema,
    confirmPassword: passwordSchema,
    acceptTerms: z.boolean().refine(val => val === true, {
      message: 'Debes aceptar los términos y condiciones',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'], // path to field that gets the error
  })

type RegisterFormType = z.infer<typeof schema>

export default function RegisterScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const signIn = useAuth.use.signIn() // Or a specific signUp function if you have one

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      acceptTerms: false,
    },
  })

  const onSubmit: SubmitHandler<RegisterFormType> = async data => {
    console.log('Registering user:', data)
    // Simulate API call for registration
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Example: Sign in the user and navigate
    // In a real app, your backend would return a session/token upon successful registration
    signIn({ access: 'new-user-access-token', refresh: 'new-user-refresh-token' })
    // Navigate to onboarding or main feed
    // router.replace('/onboarding-features'); // If you have this route
    // router.replace('/(app)/'); // Or directly to the app

    Alert.alert(t('register.success_title'), t('register.success_message'), [
      {
        text: t('common.ok'),
        onPress: () => router.replace('/(tabs)'), // Navigate to main app screen
      },
    ])
  }

  // TODO: Implement actual navigation to terms and privacy policy screens
  const openTermsAndConditions = () => {
    console.log('Navigate to Terms and Conditions')
    // router.push('/terms-and-conditions');
  }

  const openPrivacyPolicy = () => {
    console.log('Navigate to Privacy Policy')
    // router.push('/privacy-policy');
  }

  return (
    <Container className="bg-neutral-off-white flex-1">
      <BackTop />

      <LinearGradient
        colors={['#FFDA63', '#FDFDFD', '#A0D2DB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1.2, y: 1 }}
        className="absolute inset-0"
      />

      <KeyboardAvoidingView className="flex-1">
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View
            className="p-6  justify-center gap-1"
            style={{
              flex: 6,
            }}
          >
            {/* Header can be managed by Stack.Screen options in _layout.tsx if preferred */}
            {/* For simplicity, adding a manual back button here if not using header from layout */}
            <Text className="text-4xl font-bold text-primary mb-2 text-center">
              {t('register.title')}
            </Text>
            <Text className="text-neutral-dark-gray text-center mb-8">
              {t('register.description')}
            </Text>

            {/* Email */}
            <View>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder="tuemail@ejemplo.com"
                    className="border-b border-neutral-medium-gray p-3 text-neutral-dark-gray bg-neutral-light-gray/50 rounded-md border"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.email && (
                <Text className="mt-1 text-accent-coral">{errors.email.message}</Text>
              )}
            </View>
            {/* Password */}
            <View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder={t('register.password_placeholder')}
                    className="border-b border-neutral-medium-gray p-3 text-neutral-dark-gray bg-neutral-light-gray/50 rounded-md border"
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    textContentType="newPassword" // Helps with password manager suggestions
                  />
                )}
              />
              {errors.password && (
                <Text className="mt-1 text-accent-coral">{errors.password.message}</Text>
              )}
            </View>
            {/* Confirm Password */}
            <View className="mb-6">
              <Controller
                control={control}
                name="confirmPassword"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder={t('register.confirm_password_placeholder')}
                    className="border-b border-neutral-medium-gray p-3 text-neutral-dark-gray bg-neutral-light-gray/50 rounded-md border"
                    secureTextEntry
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                )}
              />
              {errors.confirmPassword && (
                <Text className="mt-1 text-accent-coral">{errors.confirmPassword.message}</Text>
              )}
            </View>

            {/* Accept Terms Checkbox */}
            <View className="mb-6 flex-row items-center">
              <Controller
                control={control}
                name="acceptTerms"
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    value={value}
                    onValueChange={onChange}
                    color={value ? '#A0D2DB' : undefined} // primary color when checked
                    style={styles.checkbox}
                  />
                )}
              />
              <View className="ml-1">
                <Text className="text-xs text-neutral-dark-gray pr-8 mt-4">
                  <Trans
                    i18nKey="login.disclaimer"
                    components={{
                      Bold: <Text className="text-primary font-bold underline" />,
                      LinkPrivacy: <Text className="text-primary font-bold underline" />,
                      LinkCookies: <Text className="text-primary font-bold underline" />,
                    }}
                    t={t}
                  />
                </Text>
              </View>
            </View>
            {errors.acceptTerms && (
              <Text className="-mt-4 mb-4 text-accent-coral">{errors.acceptTerms.message}</Text>
            )}
            {/* Register Button */}
            <Button
              label="Registrarse"
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              className="!mb-6 bg-primary"
              textClassName="!text-neutral-off-white uppercase text-sm !font-bold"
              disabled={isSubmitting}
              isLoading={isSubmitting}
            />
          </View>
          {/* Login Link */}
          <View className="flex-row items-center justify-center" style={{ flex: 1 }}>
            <Text className="text-sm text-neutral-dark-gray">
              {t('register.already_have_account')}{' '}
            </Text>
            <Link href="/login" asChild>
              <Pressable>
                <Text className="text-sm text-neutral-off-white font-semibold">
                  {t('register.login_button')}
                </Text>
              </Pressable>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  )
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  checkbox: {
    marginRight: 8,
    // Tailwind equivalent for border might be needed if default is not good
    // borderColor: '#BDBDBD', // neutral-medium-gray
    // borderWidth: 1,
  },
})
