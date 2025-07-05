import { startTransition, useCallback, useEffect, useState } from 'react'

import { Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { LinearGradient } from 'expo-linear-gradient'
import { Link, useLocalSearchParams, useRouter } from 'expo-router'
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import * as z from 'zod'

import Button from '@/components/Button/Button'
import { Container } from '@/components/containers/Container'
import BackTop from '@/components/features/BackTop'
import { AuthService } from '@/features/auth/services/AuthService'
import { useApiError, useKeyboard, useLoadingState } from '@/lib/hooks'
import { useFormErrors } from '@/lib/hooks/useFormErrors'

const passwordSchema = z
  .string({
    required_error: 'reset_password.password_required',
  })
  .min(8, 'reset_password.password_min_length')
  .regex(/[a-z]/, 'reset_password.password_lowercase')
  .regex(/[A-Z]/, 'reset_password.password_uppercase')
  .regex(/[0-9]/, 'reset_password.password_number')
  .regex(/[^a-zA-Z0-9]/, 'reset_password.password_special')

const schema = z
  .object({
    password: passwordSchema,
    passwordConfirmation: z
      .string({
        required_error: 'reset_password.password_confirmation_required',
      })
      .min(8, 'reset_password.password_confirmation_min_length'),
  })
  .refine(data => data.password === data.passwordConfirmation, {
    message: 'reset_password.passwords_dont_match',
    path: ['password_confirmation'],
  })

type ResetPasswordFormType = z.infer<typeof schema>

export default function ResetPasswordScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { keyboardVisible } = useKeyboard()
  const { setLoading, loadingStates } = useLoadingState()
  const { handleApiError, handleValidationErrors } = useApiError()
  const [passwordReset, setPasswordReset] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)

  // Obtener parámetros de la URL del deep link
  const { token, email } = useLocalSearchParams<{
    token: string
    email: string
  }>()

  const isLoading = loadingStates.resetPassword || loadingStates.default

  // Animated values for smooth transitions
  const logoScale = useSharedValue(1)
  const textScale = useSharedValue(1)
  const formOpacity = useSharedValue(0.9)
  const formFlex = useSharedValue(1)

  // Verificar que tenemos los parámetros necesarios
  useEffect(() => {
    if (!token || !email) {
      Alert.alert(
        t('reset_password.invalid_link_title'),
        t('reset_password.invalid_link_message'),
        [
          {
            text: t('common.ok'),
            onPress: () => router.replace('/login'),
          },
        ]
      )
    }
  }, [token, email, router, t])

  // Update animations when keyboard state changes
  useEffect(() => {
    if (keyboardVisible) {
      logoScale.value = withSpring(0.8, { damping: 15, stiffness: 150 })
      textScale.value = withSpring(0.9, { damping: 15, stiffness: 150 })
      formOpacity.value = withSpring(1, { damping: 20, stiffness: 200 })
      formFlex.value = withSpring(1.2, { damping: 20, stiffness: 200 })
    } else {
      logoScale.value = withSpring(1, { damping: 15, stiffness: 150 })
      textScale.value = withSpring(1, { damping: 15, stiffness: 150 })
      formOpacity.value = withSpring(0.9, { damping: 20, stiffness: 200 })
      formFlex.value = withSpring(1, { damping: 20, stiffness: 200 })
    }
  }, [keyboardVisible, logoScale, textScale, formOpacity, formFlex])

  // Animated styles
  const animatedLogoContainerStyle = useAnimatedStyle(() => {
    return {
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

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormType>({
    resolver: zodResolver(schema),
  })
  const { mapApiErrorsToForm } = useFormErrors({ setError })

  // Decodificar el email para mostrarlo correctamente
  const decodedEmail = decodeURIComponent(email || '')

  const onSubmit: SubmitHandler<ResetPasswordFormType> = useCallback(
    async (data: ResetPasswordFormType) => {
      Keyboard.dismiss()

      if (isLoading || !token || !email) {
        return
      }

      const operationKey = 'resetPassword'

      try {
        setLoading(operationKey, true)

        const response = await AuthService.resetPassword({
          email: decodedEmail,
          token,
          password: data.password,
          passwordConfirmation: data.passwordConfirmation,
        })

        if (response.status === 200) {
          startTransition(() => {
            setPasswordReset(true)
            Alert.alert(t('reset_password.success_title'), t('reset_password.success_message'), [
              {
                text: t('common.ok'),
                onPress: () => router.replace('/login'),
              },
            ])
          })
        }
      } catch (error) {
        const apiError = handleApiError(error, 'Password reset failed')

        if (apiError.status === 422 || apiError.validationErrors) {
          handleValidationErrors(apiError, mapApiErrorsToForm)
        } else {
          // Mostrar mensaje de error específico
          const errorMessage = apiError.message || t('reset_password.generic_error')
          Alert.alert(t('reset_password.error_title'), errorMessage)
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
      setLoading,
      isLoading,
      token,
      email,
      decodedEmail,
      t,
    ]
  )

  // Si ya se restableció la contraseña exitosamente, mostrar mensaje de éxito
  if (passwordReset) {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Container className="flex-1 bg-transparent">
          <LinearGradient
            colors={['#FFDA63', '#FDFDFD', '#A0D2DB']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1.2, y: 1 }}
            className="absolute inset-0"
          />
          <View className="flex-1 items-center justify-center px-4">
            <Text className="text-2xl text-center font-bold text-primary mb-4">
              {t('reset_password.success_title')}
            </Text>
            <Text className="text-lg text-center font-semibold text-neutral-dark-gray mb-4">
              {t('reset_password.success_message')}
            </Text>
            <Text className="text-md text-neutral-medium-gray text-center">
              {t('reset_password.redirecting_message')}
            </Text>
          </View>
        </Container>
      </KeyboardAvoidingView>
    )
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={100}
    >
      <Container className="flex-1 bg-transparent">
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
          <Animated.View style={[styles.formContainer, animatedFormStyle]} className="gap-y-4">
            <Animated.View style={[styles.logoContainer, animatedLogoContainerStyle]}>
              <Animated.Text
                style={[animatedTextStyle]}
                className="text-4xl font-bold text-primary mb-2 text-center"
              >
                {t('reset_password.title')}
              </Animated.Text>
              <Animated.Text
                style={[animatedTextStyle]}
                className="text-neutral-dark-gray text-center mb-2"
              >
                {t('reset_password.description')}
              </Animated.Text>
              <Animated.Text
                style={[animatedTextStyle]}
                className="text-sm text-neutral-medium-gray text-center font-medium"
              >
                {t('reset_password.email_label')}: {decodedEmail}
              </Animated.Text>
            </Animated.View>

            {/* Campo Nueva Contraseña */}
            <View className="mb-4">
              <Text className="text-sm font-medium text-neutral-dark-gray mb-2">
                {t('reset_password.new_password_label')}
              </Text>
              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="relative">
                    <TextInput
                      placeholder={t('reset_password.new_password_placeholder')}
                      className={`border-b border-neutral-medium-gray p-3 pr-12 text-neutral-dark-gray bg-neutral-light-gray/50 rounded-md border max-h-[100px] ${isLoading ? 'opacity-50' : ''}`}
                      secureTextEntry={!showPassword}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      autoCorrect={false}
                      spellCheck={false}
                      numberOfLines={1}
                      scrollEnabled={false}
                      multiline={false}
                      returnKeyType="next"
                      textContentType="newPassword"
                      autoCapitalize="none"
                      autoComplete="password-new"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2 p-1"
                      style={{ zIndex: 1 }}
                      disabled={isLoading}
                    >
                      <Ionicons
                        name={showPassword ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={isLoading ? '#D1D5DB' : '#9CA3AF'}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.password && (
                <Text className="text-xs text-accent-coral mt-1">
                  {t(errors.password.message as string)}
                </Text>
              )}
            </View>

            {/* Campo Confirmar Contraseña */}
            <View className="mb-6">
              <Text className="text-sm font-medium text-neutral-dark-gray mb-2">
                {t('reset_password.confirm_password_label')}
              </Text>
              <Controller
                control={control}
                name="passwordConfirmation"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="relative">
                    <TextInput
                      placeholder={t('reset_password.confirm_password_placeholder')}
                      className={`border-b border-neutral-medium-gray p-3 pr-12 text-neutral-dark-gray bg-neutral-light-gray/50 rounded-md border max-h-[100px] ${isLoading ? 'opacity-50' : ''}`}
                      secureTextEntry={!showPasswordConfirmation}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      autoCorrect={false}
                      spellCheck={false}
                      numberOfLines={1}
                      scrollEnabled={false}
                      multiline={false}
                      returnKeyType="done"
                      textContentType="newPassword"
                      autoCapitalize="none"
                      autoComplete="password-new"
                    />
                    <TouchableOpacity
                      onPress={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                      className="absolute right-3 top-2 p-1"
                      style={{ zIndex: 1 }}
                      disabled={isLoading}
                    >
                      <Ionicons
                        name={showPasswordConfirmation ? 'eye-off-outline' : 'eye-outline'}
                        size={20}
                        color={isLoading ? '#D1D5DB' : '#9CA3AF'}
                      />
                    </TouchableOpacity>
                  </View>
                )}
              />
              {errors.passwordConfirmation && (
                <Text className="text-xs text-accent-coral mt-1">
                  {t(errors.passwordConfirmation.message as string)}
                </Text>
              )}
            </View>

            <Button
              label={
                isSubmitting
                  ? t('reset_password.updating_button')
                  : t('reset_password.update_button')
              }
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              className="!mb-6 bg-primary"
              textClassName="!text-neutral-off-white uppercase text-sm !font-bold"
              disabled={isSubmitting || isLoading}
              isLoading={isSubmitting}
              icon={isSubmitting ? <ActivityIndicator color="#FFFFFF" className="mr-2" /> : null}
            />

            <View className="flex-row items-center justify-center" style={styles.linkContainer}>
              <Link href="/login" asChild>
                <Pressable className="self-center" disabled={isLoading || isSubmitting}>
                  <Text className="text-sm font-semibold mix-blend-difference backdrop-invert">
                    {t('reset_password.back_to_login')}
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
})
