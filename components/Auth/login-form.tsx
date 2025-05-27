import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'expo-router'
import { useForm, Controller } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { Text, TextInput, View, Pressable, Image, Linking } from 'react-native'
import * as z from 'zod'

import Button from '@/components/Button/Button'

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
}

export const LoginForm = ({
  onSubmit = () => {},
  onGoogleSignIn = () => {},
  onFacebookSignIn = () => {},
}: LoginFormProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
  })

  const { t } = useTranslation()

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
    <View className="w-full">
      {/* Form Fields Section */}
      <View className="gap-y-2 mb-6">
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput
              testID="email-input"
              placeholder={t('login.email_placeholder')}
              className="border-b border-neutral-medium-gray p-3 text-neutral-dark-gray bg-neutral-light-gray/50 rounded-md border"
              keyboardType="email-address"
              autoCapitalize="none"
              value={value}
              onChangeText={onChange}
              multiline={false}
              textContentType="emailAddress"
              autoComplete="email"
              autoCorrect={false}
              spellCheck={false}
            />
          )}
        />
        {errors.email && (
          <Text className="text-accent-coral text-xs">{t(errors.email.message!)}</Text>
        )}
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput
              testID="password-input"
              placeholder={t('login.password_placeholder')}
              secureTextEntry={true}
              className="border-b border-neutral-medium-gray p-3 text-neutral-dark-gray bg-neutral-light-gray/50 rounded-md border"
              value={value}
              onChangeText={onChange}
              multiline={false}
              textContentType="password"
              autoComplete="password"
              autoCapitalize="none"
            />
          )}
        />
        {errors.password && (
          <Text className="text-accent-coral text-xs">{t(errors.password.message!)}</Text>
        )}

        <Link href="/(auth)/forgot-password" asChild>
          <Pressable className="mt-2 mb-4 self-end">
            <Text className="text-sm text-primary">{t('login.forgot_password_button')}</Text>
          </Pressable>
        </Link>

        {/* Sign In Button */}
        <Button
          testID="login-button"
          label={t('login.login_button')}
          onPress={handleSubmit(onSubmit)}
          variant="primary"
          textClassName="!text-neutral-off-white uppercase text-sm !font-bold"
          className="bg-primary"
        />
        <Text className="text-xs text-neutral-off-white text-center px-4 mt-4">
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

      {/* Social Login Section */}
      <View className="gap-y-2 mt-6 ">
        {/* Separator line with OR */}
        <View className="my-4 flex-row items-center justify-center opacity-70">
          <View className="flex-1 border-t border-neutral-light-gray" />
          <Text className="mx-4 text-xl text-neutral-light-gray">O</Text>
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
              className="w-[35px] h-[35px]"
            />
          }
          className="!bg-[#F2F2F2] border-[#747775] !p-1 h-10"
          textClassName="!text-[#1F1F1F] uppercase text-sm !font-bold"
        />
        <Button
          testID="facebook-signin-button"
          label={t('login.facebook_signin')}
          onPress={onFacebookSignIn}
          variant="primary"
          icon={
            <Image
              source={require('@/assets/images/Facebook_Logo_Secondary.png')}
              className="w-[25px] h-[25px] mr-2"
            />
          }
          className="!bg-[#4267b2] !p-1 h-10"
          textClassName="!text-neutral-off-white uppercase text-sm !font-bold"
        />
      </View>

      {/* Register Link */}
      <View className="flex-row items-center justify-center mt-6">
        <Text className="text-sm text-neutral-off-white">{t('login.no_account')}</Text>
        <Link href="/(auth)/register" asChild>
          <Pressable>
            <Text className="text-sm text-primary font-semibold ml-1">
              {t('login.register_button')}
            </Text>
          </Pressable>
        </Link>
      </View>
    </View>
  )
}
