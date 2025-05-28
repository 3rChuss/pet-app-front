import { useEffect } from 'react'

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
import { useKeyboard } from '@/lib/hooks'

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
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormType>({
    resolver: zodResolver(schema),
  })

  const onSubmit: SubmitHandler<ForgotPasswordFormType> = async (data: ForgotPasswordFormType) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    Alert.alert(
      t('forgot_password.success_title'),
      t('forgot_password.success_message', { email: data.email }),
      [{ text: 'OK', onPress: () => router.replace('/(auth)/login') }]
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
                <Text className="text-xs text-accent-coral">
                  {t(errors.email.message as string)}
                </Text>
              )}
            </View>

            <Button
              label={t('forgot_password.send_button')}
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              className="!mb-6 bg-primary"
              textClassName="!text-neutral-off-white uppercase text-sm !font-bold"
              disabled={isSubmitting}
              isLoading={isSubmitting}
            />

            <View className="flex-row items-center justify-center" style={styles.linkContainer}>
              <Link href="/login" asChild>
                <Pressable className="self-center">
                  <Text className="text-sm font-semibold mix-blend-difference backdrop-invert">
                    {t('forgot_password.back_to_login')}
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
