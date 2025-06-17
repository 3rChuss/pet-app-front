import { startTransition, useCallback, useEffect, useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'
import { LinearGradient } from 'expo-linear-gradient'
import { Link, useRouter } from 'expo-router'
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
} from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import * as z from 'zod'

import { forgotPassword } from '@/api/services/auth'
import Button from '@/components/Button/Button'
import { Container } from '@/components/containers/Container'
import BackTop from '@/components/features/BackTop'
import { useApiError, useKeyboard, useLoadingState } from '@/lib/hooks'
import { useFormErrors } from '@/lib/hooks/useFormErrors'

const schema = z.object({
  email: z
    .string({
      required_error: 'forgot_password.email_required',
    })
    .email('forgot_password.email_invalid'),
})

type ForgotPasswordFormType = z.infer<typeof schema>

export default function ForgotPasswordScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { keyboardVisible } = useKeyboard()
  const { setLoading, loadingStates } = useLoadingState()
  const { handleApiError, handleValidationErrors } = useApiError()
  const [emailSent, setEmailSent] = useState(false)

  const isLoading = loadingStates.forgotPassword || loadingStates.default

  // Animated values for smooth transitions
  const logoScale = useSharedValue(1)
  const textScale = useSharedValue(1)
  const formOpacity = useSharedValue(0.9)
  const formFlex = useSharedValue(1)

  // Update animations when keyboard state changes
  useEffect(() => {
    if (keyboardVisible) {
      logoScale.value = withSpring(1, { damping: 15, stiffness: 150 })
      textScale.value = withSpring(1, { damping: 15, stiffness: 150 })
      formOpacity.value = withSpring(1, { damping: 20, stiffness: 200 })
      formFlex.value = withSpring(0.5, { damping: 20, stiffness: 200 })
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
  } = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(schema),
  })
  const { mapApiErrorsToForm } = useFormErrors({ setError })

  const onSubmit: SubmitHandler<ForgotPasswordFormType> = useCallback(
    async (data: ForgotPasswordFormType) => {
      Keyboard.dismiss()

      if (isLoading) {
        return
      }

      const operationKey = 'forgotPassword'

      try {
        setLoading(operationKey, true)

        const response = await forgotPassword(data.email)
        if (response.status === 200) {
          startTransition(() => {
            setEmailSent(true)
            setTimeout(() => {
              router.push('/login')
            }, 5000)
          })
        }
      } catch (error) {
        const apiError = handleApiError(error, 'Registration failed')

        if (apiError.status === 422 || apiError.validationErrors) {
          handleValidationErrors(apiError, mapApiErrorsToForm)
        }
      } finally {
        setLoading(operationKey, false)
      }
    },
    [router, handleApiError, handleValidationErrors, mapApiErrorsToForm, setLoading, isLoading]
  )

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

        {emailSent ? (
          <View className="flex-1 items-center justify-center">
            <Text className="text-lg font-semibold text-neutral-dark-gray">
              {t('forgot_password.email_sent', { email: control._fields.email || '' })}
            </Text>
            <Text className="text-sm text-neutral-medium-gray mt-2">
              {t('forgot_password.check_your_email')}
            </Text>
          </View>
        ) : (
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
                  {t('forgot_password.title')}
                </Animated.Text>
                <Animated.Text
                  style={[animatedTextStyle]}
                  className="text-neutral-dark-gray text-center"
                >
                  {t('forgot_password.description')}
                </Animated.Text>
              </Animated.View>

              <View className="mb-6">
                <Controller
                  control={control}
                  name="email"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder={t('common.email_placeholder')}
                      className={`border-b border-neutral-medium-gray p-3 pr-12 text-neutral-dark-gray bg-neutral-light-gray/50 rounded-md border max-h-[100px] ${isLoading ? 'opacity-50' : ''}`}
                      keyboardType="email-address"
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      autoCorrect={false}
                      spellCheck={false}
                      numberOfLines={1}
                      scrollEnabled={false}
                      multiline={false}
                      returnKeyType="done"
                      textContentType="username"
                    />
                  )}
                />
                {errors.email && (
                  <Text className="text-xs text-accent-coral">
                    {t(errors.email.message as string)}
                  </Text>
                )}
              </View>

              <Button
                label={
                  isSubmitting
                    ? t('forgot_password.sending_button')
                    : t('forgot_password.send_button')
                }
                onPress={handleSubmit(onSubmit)}
                variant="primary"
                className="!mb-6 bg-primary"
                textClassName="!text-neutral-off-white uppercase text-sm !font-bold"
                disabled={isSubmitting}
                isLoading={isSubmitting}
                icon={isSubmitting ? <ActivityIndicator color="#FFFFFF" className="mr-2" /> : null}
              />

              <View className="flex-row items-center justify-center" style={styles.linkContainer}>
                <Link href="/login" asChild>
                  <Pressable className="self-center" disabled={isLoading || isSubmitting}>
                    <Text className="text-sm font-semibold mix-blend-difference backdrop-invert">
                      {t('forgot_password.back_to_login')}
                    </Text>
                  </Pressable>
                </Link>
              </View>
            </Animated.View>
          </ScrollView>
        )}
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
