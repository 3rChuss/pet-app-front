import { zodResolver } from '@hookform/resolvers/zod'
import { LinearGradient } from 'expo-linear-gradient'
import { Link, useRouter } from 'expo-router'
import { StatusBar } from 'expo-status-bar'
import { useForm, Controller, type SubmitHandler } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { View, Text, TextInput, Pressable, Alert } from 'react-native'
import * as z from 'zod'

import Button from '@/components/Button/Button'
import { Container } from '@/components/containers/Container'
import { KeyboardAvoidingView } from '@/components/containers/KeyboardAvoidingView'
import BackTop from '@/components/features/BackTop'

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
    <Container className="flex-1 bg-transparent">
      <LinearGradient
        colors={['#FFDA63', '#FDFDFD', '#A0D2DB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1.2, y: 1 }}
        className="absolute inset-0"
      />

      <BackTop />

      <KeyboardAvoidingView className="flex-1">
        <StatusBar style="auto" />
        <Container className="flex-1 justify-center p-6 gap-4">
          <View className="items-center mb-10">
            <Text className="text-4xl font-bold text-primary mb-3">
              {t('forgot_password.title')}
            </Text>
            <Text className="text-center text-neutral-dark-gray max-w-xs">
              {t('forgot_password.description')}
            </Text>
          </View>

          <View className="mb-4">
            <Controller
              control={control}
              name="email"
              render={({ field: { onChange, onBlur, value } }) => (
                <TextInput
                  placeholder={t('email_placeholder')}
                  className="border-b border-neutral-medium-gray p-3 text-neutral-dark-gray bg-neutral-light-gray rounded-md"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
            />
            {errors.email && (
              <Text className="mt-1 text-accent-coral">{t(errors.email.message as string)}</Text>
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

          <Link href="/login" asChild>
            <Pressable className="self-center">
              <Text className="text-sm text-primary">{t('forgot_password.back_to_login')}</Text>
            </Pressable>
          </Link>
        </Container>
      </KeyboardAvoidingView>
    </Container>
  )
}
