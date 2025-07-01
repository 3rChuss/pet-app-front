import { useCallback, useMemo } from 'react'

import { Ionicons } from '@expo/vector-icons'
import { LinearGradient } from 'expo-linear-gradient'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Text, View } from 'react-native'

import Button from '@/components/Button/Button'
import { Container } from '@/components/containers/Container'
import BackTop from '@/components/features/BackTop'
import { EmailVerificationService, type EmailVerificationParams } from '@/features/auth'
import { useApiError } from '@/lib/hooks/notifications'
import { useApiCall } from '@/lib/hooks/useApiCall'

export default function VerifyEmailScreen() {
  const { t } = useTranslation()
  const router = useRouter()
  const params = useLocalSearchParams()
  const { showSuccess } = useApiError()

  const verificationParams = useMemo(() => {
    return {
      id: params.id as string | undefined,
      hash: params.hash as string | undefined,
      expires: params.expires as string | undefined,
      signature: params.signature as string | undefined,
    }
  }, [params.id, params.hash, params.expires, params.signature])

  const areParamsValid = useMemo(() => {
    return EmailVerificationService.validateParams(verificationParams)
  }, [verificationParams])

  const verifyEmailCall = useCallback(async () => {
    if (!areParamsValid) {
      throw new Error('Enlace de verificación inválido o incompleto.')
    }
    return EmailVerificationService.verifyEmail(verificationParams as EmailVerificationParams)
  }, [areParamsValid, verificationParams])

  const { data, error, isLoading, retry } = useApiCall(
    verifyEmailCall,
    [verificationParams],
    areParamsValid
  )

  const handleSuccess = useCallback(() => {
    if (data?.message) {
      showSuccess(data.message)
    }
    router.replace('/(auth)/login')
  }, [data?.message, showSuccess, router])

  const handleResendEmail = useCallback(() => {
    router.replace('/(auth)/register')
  }, [router])

  const handleBackToHome = useCallback(() => {
    router.replace('/')
  }, [router])

  return (
    <Container className="flex-1 justify-center items-center p-6">
      <LinearGradient
        colors={['#FFDA63', '#FDFDFD', '#A0D2DB']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1.2, y: 1 }}
        className="absolute inset-0"
      />
      <BackTop />
      <View className="items-center text-center">
        {isLoading && (
          <>
            <View className="items-center mb-6">
              <Ionicons name="mail-outline" size={80} color="#A0D2DB" />
              <ActivityIndicator size="large" color="#A0D2DB" className="mt-4" />
            </View>
            <Text
              className="text-xl mb-2 text-center"
              style={{
                fontFamily: 'Quicksand-Bold',
                color: '#424242',
              }}
            >
              {t('verify_email.loading_title')}
            </Text>
            <Text
              className="text-center"
              style={{
                fontFamily: 'NunitoSans-Regular',
                color: '#BDBDBD',
              }}
            >
              {t('verify_email.loading_message')}
            </Text>
          </>
        )}

        {!isLoading && data && (
          <>
            <View className="items-center mb-6">
              <View className="rounded-full p-6 mb-4" style={{ backgroundColor: '#C8E6C9' + '33' }}>
                <Ionicons name="checkmark-circle" size={80} color="#C8E6C9" />
              </View>
            </View>

            <Text
              className="text-2xl mb-4 text-center"
              style={{
                fontFamily: 'Quicksand-Bold',
                color: '#C8E6C9',
              }}
            >
              {t('verify_email.success_title')}
            </Text>

            <Text
              className="text-center mb-6 px-4"
              style={{
                fontFamily: 'NunitoSans-Regular',
                color: '#424242',
              }}
            >
              {t('verify_email.success_message')}
            </Text>

            {data.message && (
              <Text
                className="text-center mb-6 text-sm italic"
                style={{
                  fontFamily: 'NunitoSans-Regular',
                  color: '#BDBDBD',
                }}
              >
                {data.message}
              </Text>
            )}

            <Button
              label={t('verify_email.go_to_login')}
              onPress={handleSuccess}
              variant="primary"
              className="w-full"
            />
          </>
        )}

        {!isLoading && (error || !areParamsValid) && (
          <>
            <View className="items-center mb-6">
              <View className="rounded-full p-6 mb-4" style={{ backgroundColor: '#F47C7C' + '33' }}>
                <Ionicons name="close-circle" size={80} color="#F47C7C" />
              </View>
            </View>

            <Text
              className="text-2xl mb-4 text-center"
              style={{
                fontFamily: 'Quicksand-Bold',
                color: '#F47C7C',
              }}
            >
              {t('verify_email.error_title')}
            </Text>

            <Text
              className="text-center mb-4 px-4"
              style={{
                fontFamily: 'NunitoSans-Regular',
                color: '#424242',
              }}
            >
              {!areParamsValid
                ? 'Enlace de verificación inválido o incompleto.'
                : t('verify_email.error_message')}
            </Text>

            <View className="w-full space-y-3">
              <Button
                label={t('verify_email.resend_email')}
                onPress={handleResendEmail}
                variant="primary"
                className="w-full mb-3"
              />

              <Button
                label={t('verify_email.back_to_home')}
                onPress={handleBackToHome}
                variant="secondary"
                className="w-full"
              />

              {areParamsValid && error && (
                <Button
                  label="Reintentar"
                  onPress={retry}
                  variant="secondary"
                  className="w-full mt-3"
                />
              )}
            </View>
          </>
        )}
      </View>
    </Container>
  )
}
