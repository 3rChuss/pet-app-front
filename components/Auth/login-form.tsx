import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'expo-router'
import { useForm, Controller } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { Text, View, Pressable, Image, Keyboard, ActivityIndicator } from 'react-native'
import * as z from 'zod'

import LegalNotice from '@/components/Auth/LegalNotice'
import Button from '@/components/Button/Button'
import PasswordField from '@/components/Form/PasswordField'
import TextField from '@/components/Form/TextField'

import type { SubmitHandler } from 'react-hook-form'

const schema = z.object({
  email: z
    .string({
      required_error: 'login.email_required',
    })
    .email('login.email_invalid'),
  password: z
    .string({
      required_error: 'login.password_required',
    })
    .min(6, 'login.password_min_length'),
})

export type FormType = z.infer<typeof schema>

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>
  onGoogleSignIn?: () => void
  onFacebookSignIn?: () => void
  isLoading?: boolean
}

export const LoginForm = ({
  onSubmit = () => {},
  onGoogleSignIn = () => {},
  onFacebookSignIn = () => {},
  isLoading = false,
}: LoginFormProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
  })

  const { t } = useTranslation()

  // Enhanced submit handler that handles keyboard dismissal properly
  const handleFormSubmit = (data: FormType) => {
    // Dismiss keyboard immediately without interfering with button press
    Keyboard.dismiss()
    // Execute the submit function
    onSubmit(data)
  }

  return (
    <View className="w-full">
      {/* Form Fields Section */}
      <View className="gap-y-2 mb-6">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextField
              testID="email-input"
              placeholder={t('login.email_placeholder')}
              error={errors.email?.message && t(errors.email.message)}
              keyboardType="email-address"
              autoCapitalize="none"
              value={value}
              onChangeText={text => {
                onChange(text.toLowerCase().trim()) // Normalize email input
              }}
              multiline={false}
              textContentType="emailAddress"
              autoComplete="email"
              autoCorrect={false}
              spellCheck={false}
              scrollEnabled={false}
              numberOfLines={1}
              editable={!isLoading}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <PasswordField
              testID="password-input"
              placeholder={t('login.password_placeholder')}
              error={errors.password?.message && t(errors.password.message)}
              value={value}
              onChangeText={onChange}
              multiline={false}
              textContentType="password"
              autoComplete="password"
              autoCapitalize="none"
              autoCorrect={false}
              spellCheck={false}
              numberOfLines={1}
              scrollEnabled={false}
              editable={!isLoading}
            />
          )}
        />
        <Link href="/(auth)/forgot-password" asChild>
          <Pressable
            className={`mt-2 mb-4 self-end ${isLoading ? 'opacity-50' : ''}`}
            disabled={isLoading}
          >
            <Text className="text-sm text-primary">{t('login.forgot_password_button')}</Text>
          </Pressable>
        </Link>
        {/* Sign In Button */}
        <Button
          testID="login-button"
          label={isLoading ? t('login.signing_in') : t('login.login_button')}
          onPress={handleSubmit(handleFormSubmit)}
          variant="primary"
          textClassName="!text-neutral-off-white uppercase text-sm !font-nunito-bold"
          className="bg-primary flex-row items-center justify-center h-12"
          isLoading={isLoading}
          icon={isLoading ? <ActivityIndicator color="#FFFFFF" className="mr-2" /> : null}
        />
        <LegalNotice
          variant="login"
          className="text-xs text-neutral-off-white text-center px-4 mt-4"
        />
      </View>
      {/* Social Login Section */}
      <View className="gap-y-2 mt-6 ">
        {/* Separator line with OR */}
        <View className="my-4 flex-row items-center justify-center opacity-70">
          <View className="flex-1 border-t border-neutral-light-gray" />
          <Text className="mx-4 text-xl text-neutral-light-gray uppercase">{t('login.or')}</Text>
          <View className="flex-1 border-t border-neutral-light-gray" />
        </View>
        {/* Social Login Buttons */}
        <Button
          testID="google-signin-button"
          label={t('login.google_signin')}
          onPress={onGoogleSignIn}
          variant="primary"
          icon={
            <Image
              source={require('@/assets/images/android_neutral_rd_na.png')}
              className="w-[29px] h-[29px]"
            />
          }
          className="!bg-[#F2F2F2] border-[#747775] !p-1 h-12"
          textClassName="!text-[#1F1F1F] uppercase text-sm !font-nunito-bold"
          disabled={isLoading}
        />
        <Button
          testID="facebook-signin-button"
          label={t('login.facebook_signin')}
          onPress={onFacebookSignIn}
          variant="primary"
          icon={
            <Image
              source={require('@/assets/images/Facebook_Logo_Secondary.png')}
              className="w-[25px] h-[25px]"
            />
          }
          className="!bg-[#4267b2] !p-1 h-12"
          textClassName="!text-neutral-off-white uppercase text-sm !font-nunito-bold"
          disabled={isLoading}
        />
      </View>
      {/* Register Link */}
      <View className="flex-row items-center justify-center mt-6">
        <Text className="text-sm text-neutral-off-white">{t('login.no_account')}</Text>
        <Link href="/(auth)/register" asChild>
          <Pressable disabled={isLoading} className={isLoading ? 'opacity-50' : ''}>
            <Text className="text-sm text-primary font-semibold ml-1">
              {t('login.register_button')}
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  )
}
