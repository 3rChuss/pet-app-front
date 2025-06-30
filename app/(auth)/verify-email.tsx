import { useLocalSearchParams, useRouter } from 'expo-router'
import { useTranslation } from 'react-i18next'
import { ActivityIndicator, Text, View } from 'react-native'

import Button from '@/components/Button/Button'
import { Container } from '@/components/containers/Container'
import { useEmailVerification } from '@/lib/hooks/useEmailVerification'

export default function VerifyEmailScreen() {
  const { t } = useTranslation('verify_email')
  const router = useRouter()
  const params = useLocalSearchParams()
  const { status, message, loading } = useEmailVerification({
    id: params.id as string | undefined,
    hash: params.hash as string | undefined,
    expires: params.expires as string | undefined,
    signature: params.signature as string | undefined,
  })

  return (
    <Container className="flex-1 justify-center items-center p-6 bg-neutral-off-white">
      <View className="items-center text-center">
        {loading && (
          <>
            <ActivityIndicator size="large" color="#A0D2DB" />
            <Text className="mt-4 text-lg text-neutral-dark-gray">{t('loading')}</Text>
          </>
        )}

        {!loading && status === 'success' && (
          <>
            <Text className="text-2xl font-bold text-secondary-green mb-4">
              {t('success_title')}
            </Text>

            <Text className="text-center text-neutral-dark-gray mb-6">{t('success_message')}</Text>
            <Button
              label={t('go_to_login')}
              onPress={() => router.replace('/(auth)/login')}
              variant="primary"
            />
            <View className="my-2" />
          </>
        )}

        {!loading && status === 'error' && (
          <>
            <Text className="text-2xl font-bold text-accent-coral mb-4">{t('error_title')}</Text>
            <Text className="text-center text-neutral-dark-gray mb-6">{t('error_message')}</Text>
            <Button
              label={t('go_to_login')}
              onPress={() => router.replace('/(auth)/login')}
              variant="primary"
            />
          </>
        )}
      </View>
    </Container>
  )
}
