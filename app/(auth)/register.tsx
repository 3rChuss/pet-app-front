import { startTransition, useCallback, useEffect, useState } from 'react'

import { Ionicons } from '@expo/vector-icons'
import { zodResolver } from '@hookform/resolvers/zod'
import { Checkbox } from 'expo-checkbox' // Assuming expo-checkbox is installed
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
  ActivityIndicator,
} from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import * as z from 'zod'

import { register } from '@/api/services/auth'
import Button from '@/components/Button/Button'
import { Container } from '@/components/containers/Container'
import BackTop from '@/components/features/BackTop'
// To potentially sign in the user after registration
import { useApiError, useKeyboard, useLoadingState } from '@/lib/hooks'
import { useFormErrors } from '@/lib/hooks/useFormErrors'

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
    userName: z
      .string({
        required_error: 'register.username_required',
      })
      .trim()
      .min(3, {
        message: 'register.username_min_length',
      })
      .refine(val => /^[a-zA-Z0-9_]+$/.test(val), {
        message: 'register.username_invalid',
      })
      .refine(val => val.replace(/[^a-zA-Z0-9_]/g, '').length === val.length, {
        message: 'register.username_invalid',
      }),
    email: z
      .string({
        required_error: 'common.email_required',
      })
      .trim()
      .toLowerCase()
      .email('register.email_invalid'),
    password: passwordSchema,
    passwordConfirmation: z.string({
      required_error: 'register.password_required',
    }),
    acceptedPrivacyPolicy: z.boolean().refine(val => val === true, {
      message: 'register.accept_terms_required',
    }),
  })
  .refine(data => data.password === data.passwordConfirmation, {
    message: 'register.password_mismatch',
    path: ['passwordConfirmation'], // path to field that gets the error
  })
  .refine(data => data.password.length >= 8, {
    message: 'register.password_length',
  })

type RegisterFormType = z.infer<typeof schema>

export default function RegisterScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const { setLoading, loadingStates } = useLoadingState()
  const { handleApiError, handleValidationErrors } = useApiError()

  // Loading states for different operations
  const isRegisterLoading = loadingStates.register || false
  const { keyboardVisible } = useKeyboard()
  const [showPassword, setShowPassword] = useState(false)
  const [registerSuccess, setRegisterSuccess] = useState(false)

  // Animated values for smooth transitions
  const logoScale = useSharedValue(1)
  const logoHeight = useSharedValue(200)
  const textScale = useSharedValue(1)
  const formOpacity = useSharedValue(0.9)
  const formFlex = useSharedValue(1)

  // Update animations when keyboard state changes
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

  // Animated styles
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

  const { mapApiErrorsToForm } = useFormErrors({ setError })

  const onSubmit: SubmitHandler<RegisterFormType> = useCallback(
    async (data: RegisterFormType) => {
      Keyboard.dismiss()

      if (isRegisterLoading) {
        return
      }

      const operationKey = 'register'

      try {
        setLoading(operationKey, true)
        const response = await register({
          name: data.userName,
          email: data.email,
          password: data.password,
          passwordConfirmation: data.passwordConfirmation,
          acceptedPrivacyPolicy: data.acceptedPrivacyPolicy,
        })
        if (response.status === 200) {
          startTransition(() => {
            setRegisterSuccess(true)
            setTimeout(() => {
              setLoading(operationKey, false)
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
    [router, handleApiError, setLoading, isRegisterLoading]
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
        {registerSuccess ? (
          <View className="p-4 rounded-md mb-4 flex-1 items-center justify-center">
            <Text className="text-neutral-dark-gray text-center text-lg">
              {t('register.success_message')}
            </Text>
            <Button
              label={t('common.done')}
              onPress={() => router.push('/login')}
              variant="primary"
              className="mt-4 bg-primary"
              textClassName="!text-neutral-off-white uppercase text-sm !font-bold pr-4"
              icon={<Ionicons name="checkmark" size={20} color="#FFFFFF" />}
            />
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
                  {t('register.title')}
                </Animated.Text>
                <Animated.Text
                  style={[animatedTextStyle]}
                  className="text-neutral-dark-gray text-center"
                >
                  {t('register.description')}
                </Animated.Text>
              </Animated.View>

              <Controller
                control={control}
                name="userName"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder={t('register.username_placeholder')}
                    className={inputClassName(isRegisterLoading)}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    editable={!isRegisterLoading}
                    multiline={false}
                    autoCapitalize="none"
                    autoCorrect={false}
                    spellCheck={false}
                    numberOfLines={1}
                    scrollEnabled={false}
                    autoFocus={!keyboardVisible}
                  />
                )}
              />
              {errors.userName && (
                <Text className="text-xs text-accent-coral">{t(errors.userName.message!)}</Text>
              )}

              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    placeholder={t('common.email_placeholder')}
                    className={inputClassName(isRegisterLoading)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    textContentType="username"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    editable={!isRegisterLoading}
                    multiline={false}
                    autoComplete="email"
                    autoCorrect={false}
                    spellCheck={false}
                    numberOfLines={1}
                    scrollEnabled={false}
                  />
                )}
              />
              {errors.email && (
                <Text className="text-xs text-accent-coral">{t(errors.email.message!)}</Text>
              )}

              <Controller
                control={control}
                name="password"
                render={({ field: { onChange, onBlur, value } }) => (
                  <View className="relative">
                    <TextInput
                      placeholder={t('register.password_placeholder')}
                      className={inputClassName(isRegisterLoading)}
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

              <View className="mb-6">
                <Controller
                  control={control}
                  name="passwordConfirmation"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      placeholder={t('register.confirm_password_placeholder')}
                      className={inputClassName(isRegisterLoading)}
                      secureTextEntry
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      editable={!isRegisterLoading}
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
                      color={value ? '#A0D2DB' : undefined} // primary color when checked
                      style={styles.checkbox}
                    />
                  )}
                />

                <View className="ml-1 flex-1">
                  <Text
                    className="text-xs text-neutral-dark-gray"
                    style={errors.acceptedPrivacyPolicy ? { color: '#F87171' } : {}}
                  >
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
                testID="register-button"
                label={isSubmitting ? t('register.registering') : t('register.register_button')}
                onPress={handleSubmit(onSubmit)}
                variant="primary"
                className=" bg-primary"
                textClassName="!text-neutral-off-white uppercase !font-bold"
                disabled={isSubmitting || isRegisterLoading}
                isLoading={isSubmitting}
                icon={isSubmitting ? <ActivityIndicator color="#FFFFFF" className="mr-2" /> : null}
              />

              <View className="flex-row items-center justify-center" style={styles.linkContainer}>
                <Text className="text-sm text-neutral-dark-gray">
                  {t('register.already_have_account')}{' '}
                </Text>
                <Link href="/login" asChild>
                  <Pressable disabled={isRegisterLoading}>
                    <Text
                      className={`text-sm font-semibold mix-blend-difference backdrop-invert ${isRegisterLoading ? 'opacity-50' : ''}`}
                    >
                      {t('register.login_button')}
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

const inputClassName = (disabled: boolean) =>
  `border-b border-neutral-medium-gray p-3 pr-12 text-neutral-dark-gray bg-neutral-light-gray/50 rounded-md border max-h-[100px] ${disabled ? 'opacity-50' : ''}`

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
    borderColor: '#BDBDBD', // neutral-medium-gray
    borderWidth: 1,
  },
})
