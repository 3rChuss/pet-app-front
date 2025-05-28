import { useEffect } from 'react'

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
  Alert,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated'
import * as z from 'zod'

import Button from '@/components/Button/Button'
import { Container } from '@/components/containers/Container'
import BackTop from '@/components/features/BackTop'
import { useAuth } from '@/lib/auth' // To potentially sign in the user after registration
import { useKeyboard } from '@/lib/hooks'

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
    confirmPassword: passwordSchema,
    acceptTerms: z.boolean().refine(val => val === true, {
      message: 'register.accept_terms_required',
    }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'register.passwords_mismatch',
    path: ['confirmPassword'], // path to field that gets the error
  })
  .refine(data => data.password.length >= 8, {
    message: 'register.password_length',
  })

type RegisterFormType = z.infer<typeof schema>

export default function RegisterScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const signIn = useAuth.use.signIn() // Or a specific signUp function if you have one
  const { keyboardVisible } = useKeyboard()

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

    Alert.alert(t('register.success_title'), t('register.success_message'), [
      {
        text: t('common.ok'),
        onPress: () => router.replace('/(tabs)'), // Navigate to main app screen
      },
    ])
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
                <Text className="text-xs text-accent-coral">{t(errors.password.message!)}</Text>
              )}
            </View>

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
                <Text className="text-xs text-accent-coral">
                  {t(errors.confirmPassword.message!)}
                </Text>
              )}
            </View>

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
              <Text className="-mt-4 mb-4 text-accent-coral text-xs">
                {t(errors.acceptTerms.message!)}
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
    borderColor: '#BDBDBD', // neutral-medium-gray
    borderWidth: 1,
  },
})
