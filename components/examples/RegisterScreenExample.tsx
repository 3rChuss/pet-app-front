import { useCallback, useEffect, useState } from 'react'

import { Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Checkbox } from 'expo-checkbox'
import { LinearGradient } from 'expo-linear-gradient'
import { Link, useRouter } from 'expo-router'
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Keyboard,
  TouchableOpacity,
} from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import * as z from 'zod'

import { register } from '@/features/auth/services/auth'
import Button from '@/components/Button/Button'
import { Container } from '@/components/containers/Container'
import BackTop from '@/components/features/BackTop'
import { useKeyboard, useLoadingState } from '@/lib/hooks'
import { useApiError, useFormErrors } from '@/lib/hooks/notifications'

const passwordSchema = z
  .string({
    required_error: 'common.password_required',
  })
  .min(8, 'register.password_length')
  .regex(/[a-z]/, 'register.password_lowercase')
  .regex(/[A-Z]/, 'register.password_uppercase')
  .regex(/[0-9]/, 'register.password_number')
  .regex(/[^a-zA-Z0-9]/, 'register.password_special')

const schema = z
  .object({
    email: z
      .string({
        required_error: 'common.email_required',
      })
      .email('register.email_invalid'),
    password: passwordSchema,
    passwordConfirmation: passwordSchema,
    acceptedPrivacyPolicy: z.boolean().refine(val => val === true, {
      message: 'register.accept_terms_required',
    }),
  })
  .refine(data => data.password === data.passwordConfirmation, {
    message: 'register.passwords_mismatch',
    path: ['passwordConfirmation'],
  })

type RegisterFormType = z.infer<typeof schema>

export default function RegisterScreenExample() {
  const { t } = useTranslation()
  const router = useRouter()
  const { setLoading, loadingStates } = useLoadingState()

  // Nuevo sistema de manejo de errores
  const { handleApiError, handleValidationErrors, showSuccess } = useApiError()

  const isRegisterLoading = loadingStates.register || false
  const { keyboardVisible } = useKeyboard()
  const [showPassword, setShowPassword] = useState(false)

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      acceptedPrivacyPolicy: false,
    },
  })

  // Hook para manejar errores de formulario
  const { mapApiErrorsToForm } = useFormErrors({ setError })

  // Animaciones (código similar al original)
  const logoScale = useSharedValue(1)
  const logoHeight = useSharedValue(200)
  const textScale = useSharedValue(1)
  const formOpacity = useSharedValue(0.9)
  const formFlex = useSharedValue(1)

  useEffect(() => {
    if (keyboardVisible) {
      logoScale.value = withSpring(1, { damping: 15, stiffness: 150 })
      logoHeight.value = withSpring(120, { damping: 15, stiffness: 150 })
      textScale.value = withSpring(1, { damping: 15, stiffness: 150 })
      formOpacity.value = withSpring(1, { damping: 20, stiffness: 200 })
      formFlex.value = withSpring(0, { damping: 20, stiffness: 200 })
    } else {
      logoScale.value = withSpring(1, { damping: 15, stiffness: 150 })
      logoHeight.value = withSpring(150, { damping: 15, stiffness: 150 })
      textScale.value = withSpring(1, { damping: 15, stiffness: 150 })
      formOpacity.value = withSpring(0.9, { damping: 20, stiffness: 200 })
      formFlex.value = withSpring(1, { damping: 20, stiffness: 200 })
    }
  }, [keyboardVisible, logoScale, logoHeight, textScale, formOpacity, formFlex])

  const animatedLogoContainerStyle = useAnimatedStyle(() => {
    return {
      height: logoHeight.value,
      transform: [{ scale: logoScale.value }],
    }
  })

  const animatedTextStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: textScale.value }],
    }
  })

  const animatedFormStyle = useAnimatedStyle(() => {
    return {
      opacity: formOpacity.value,
      flex: formFlex.value,
    }
  })

  const onSubmit: SubmitHandler<RegisterFormType> = useCallback(
    async (data: RegisterFormType) => {
      Keyboard.dismiss()

      if (isRegisterLoading) {
        return
      }

      const operationKey = 'register'

      try {
        setLoading(operationKey, true)
        const response = await register(data)

        if (response.status === 200 || response.status === 201) {
          // Mostrar mensaje de éxito con el nuevo sistema
          showSuccess('¡Cuenta creada exitosamente! Revisa tu email para verificar tu cuenta.')

          // Redireccionar después de un breve delay para que el usuario vea el mensaje
          setTimeout(() => {
            router.push('/(auth)/login')
          }, 2000)
        }
      } catch (error) {
        console.error('Registration error:', error)

        // El nuevo sistema maneja automáticamente los diferentes tipos de error
        const apiError = handleApiError(error, 'Registration failed')

        // Si es un error de validación, intentar mapear a campos del formulario
        if (apiError.status === 422 || apiError.validationErrors) {
          handleValidationErrors(apiError, mapApiErrorsToForm)
        }
      } finally {
        setLoading(operationKey, false)
      }
    },
    [
      router,
      handleApiError,
      handleValidationErrors,
      mapApiErrorsToForm,
      showSuccess,
      setLoading,
      isRegisterLoading,
    ]
  )

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const handlePrivacyPolicyPress = () => {
    Linking.openURL('https://tu-pagina-web.com/politica-de-privacidad')
  }

  const handleCookiesPolicyPress = () => {
    Linking.openURL('https://tu-pagina-web.com/politica-de-cookies')
  }

  const handleTermsAndConditionsPress = () => {
    Linking.openURL('https://tu-pagina-web.com/terminos-y-condiciones')
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <Container className="bg-transparent flex-1">
        <BackTop />

        <LinearGradient
          colors={['#FFDA63', '#FDFDFD', '#A0D2DB']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1.2, y: 1 }}
          className="absolute inset-0"
        />

        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View style={[styles.formContainer, animatedFormStyle]} className="gap-y-2">
            <Animated.View style={[styles.logoContainer, animatedLogoContainerStyle]}>
              <Animated.Text
                style={[animatedTextStyle]}
                className="text-4xl font-bold text-primary mb-2 text-center"
              >
                {t('register.title')}
              </Animated.Text>
              <Animated.Text
                style={[animatedTextStyle]}
                className="text-neutral-dark-gray text-center"
              >
                {t('register.description')}
              </Animated.Text>
            </Animated.View>

            <View>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder={t('common.email_placeholder')}
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
                <Text className="text-xs text-accent-coral">{t(errors.email.message!)}</Text>
              )}
            </View>

            <View>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="relative">
                    <TextInput
                      placeholder={t('register.password_placeholder')}
                      className={`border-b border-neutral-medium-gray p-3 pr-12 text-neutral-dark-gray bg-neutral-light-gray/50 rounded-md border max-h-[100px] ${isRegisterLoading ? 'opacity-50' : ''}`}
                      secureTextEntry={!showPassword}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      textContentType="newPassword"
                      multiline={false}
                      autoComplete="password"
                      autoCapitalize="none"
                      autoCorrect={false}
                      spellCheck={false}
                      numberOfLines={1}
                      scrollEnabled={false}
                      editable={!isRegisterLoading}
                    />
                    <TouchableOpacity
                      testID="toggle-password-visibility"
                      onPress={togglePasswordVisibility}
                      className="absolute right-3 top-2 p-1"
                      style={{ zIndex: 1 }}
                      disabled={isRegisterLoading}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={isRegisterLoading ? '#D1D5DB' : '#9CA3AF'}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password && (
                <Text className="text-xs text-accent-coral">{t(errors.password.message!)}</Text>
              )}
            </View>

            <View className="mb-6">
              <Controller
                control={control}
                name="passwordConfirmation"
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
              {errors.passwordConfirmation && (
                <Text className="text-xs text-accent-coral">
                  {t(errors.passwordConfirmation.message!)}
                </Text>
              )}
            </View>

            <View className="mb-6 flex-row items-center justify-start">
              <Controller
                control={control}
                name="acceptedPrivacyPolicy"
                render={({ field: { onChange, value } }) => (
                  <Checkbox
                    value={value}
                    onValueChange={onChange}
                    color={value ? '#A0D2DB' : undefined}
                    style={styles.checkbox}
                  />
                )}
              />

              <View className="ml-1 flex-1">
                <Text className="text-xs text-neutral-dark-gray">
                  <Trans
                    i18nKey="login.disclaimer"
                    components={{
                      Bold: (
                        <Text
                          className="text-primary font-bold underline"
                          onPress={handleTermsAndConditionsPress}
                        />
                      ),
                      LinkPrivacy: (
                        <Text
                          className="text-primary font-bold underline"
                          onPress={handlePrivacyPolicyPress}
                        />
                      ),
                      LinkCookies: (
                        <Text
                          className="text-primary font-bold underline"
                          onPress={handleCookiesPolicyPress}
                        />
                      ),
                    }}
                    t={t}
                  />
                </Text>
              </View>
            </View>
            {errors.acceptedPrivacyPolicy && (
              <Text className="-mt-4 mb-4 text-accent-coral text-xs">
                {t(errors.acceptedPrivacyPolicy.message!)}
              </Text>
            )}

            <Button
              label="Registrarse"
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              className=" bg-primary"
              textClassName="!text-neutral-off-white uppercase text-sm !font-bold"
              disabled={isSubmitting}
              isLoading={isSubmitting}
            />

            <View className="flex-row items-center justify-center" style={styles.linkContainer}>
              <Text className="text-sm text-neutral-dark-gray">
                {t('register.already_have_account')}{' '}
              </Text>
              <Link href="/login" asChild>
                <Pressable>
                  <Text className="text-sm font-semibold mix-blend-difference backdrop-invert">
                    {t('register.login_button')}
                  </Text>
                </Pressable>
              </Link>
            </View>
          </Animated.View>
        </ScrollView>
      </Container>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: '100%',
    backgroundColor: 'transparent',
  },
  scrollContainer: {
    flexGrow: 1,
    minHeight: '100%',
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingTop: 40,
    paddingBottom: 20,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 6,
    justifyContent: 'center',
  },
  linkContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 20,
    paddingBottom: 40,
  },
  checkbox: {
    marginRight: 8,
    borderColor: '#BDBDBD',
    borderWidth: 1,
  },
})
