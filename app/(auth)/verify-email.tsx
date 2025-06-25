import { useLocalSearchParams, useRouter } from 'expo-router'
import { ActivityIndicator, Text, View } from 'react-native'

import Button from '@/components/Button/Button'
import { Container } from '@/components/containers/Container'
import { useEmailVerification } from '@/lib/hooks/useEmailVerification'

export default function VerifyEmailScreen() {
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
            <Text className="mt-4 text-lg text-neutral-dark-gray">Verificando tu email...</Text>
          </>
        )}

        {!loading && status === 'success' && (
          <>
            <Text className="text-2xl font-bold text-secondary-green mb-4">¡Éxito!</Text>
            <Text className="text-center text-neutral-dark-gray mb-6">{message}</Text>
            <Button
              label="Ir a Iniciar Sesión"
              onPress={() => router.replace('/(auth)/login')}
              variant="primary"
            />
            <View className="my-2" />
            <Button
              label="Ir a la App"
              onPress={() => router.replace('/(tabs)')}
              variant="secondary"
            />
          </>
        )}

        {!loading && status === 'error' && (
          <>
            <Text className="text-2xl font-bold text-accent-coral mb-4">Error de Verificación</Text>
            <Text className="text-center text-neutral-dark-gray mb-6">{message}</Text>
            <Button
              label="Volver a Inicio de Sesión"
              onPress={() => router.replace('/(auth)/login')}
              variant="primary"
            />
          </>
        )}
      </View>
    </Container>
  )
}
