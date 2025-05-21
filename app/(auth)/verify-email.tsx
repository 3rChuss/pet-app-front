import { useEffect, useState } from 'react'

import { useLocalSearchParams, useRouter } from 'expo-router'
import { ActivityIndicator, Text, View } from 'react-native'

import Button from '@/components/Button/Button'
import { Container } from '@/components/containers/Container'

// Define the expected shape of a successful API response
interface VerificationSuccessResponse {
  message: string
  // Add other relevant fields from your backend's success response
}

// Define the expected shape of an API error response
interface VerificationErrorResponse {
  message: string
  errors?: Record<string, string[]> // Optional detailed errors
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL

export default function VerifyEmailScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const id = params.id as string | undefined
  const hash = params.hash as string | undefined
  const expires = params.expires as string | undefined
  const signature = params.signature as string | undefined

  const [isLoading, setIsLoading] = useState(true)
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'success' | 'error'>(
    'pending'
  )
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!id || !hash || !expires || !signature) {
      setMessage('Enlace de verificación inválido o incompleto.')
      setVerificationStatus('error')
      setIsLoading(false)
      return
    }

    const verifyEmailToken = async () => {
      setIsLoading(true)
      try {
        const response = await fetch(`${API_BASE_URL}/api/auth/verify-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({
            id,
            hash,
            expires,
            signature,
          }),
        })

        if (response.ok) {
          const data: VerificationSuccessResponse = await response.json()
          setMessage(data.message || '¡Email verificado con éxito!')
          setVerificationStatus('success')
        } else {
          const errorData: VerificationErrorResponse = await response.json()
          setMessage(errorData.message || `Error: ${response.status}`)
          setVerificationStatus('error')
        }
      } catch (error: any) {
        // Handle network errors or other unexpected issues
        setMessage(error.message || 'Ocurrió un error de red. Por favor, intenta de nuevo.')
        setVerificationStatus('error')
      } finally {
        setIsLoading(false)
      }
    }

    verifyEmailToken()
  }, [id, hash, expires, signature])

  const handleGoToLogin = () => {
    router.replace('/(auth)/login')
  }

  const handleGoHome = () => {
    router.replace('/(app)')
  }

  return (
    <Container className="flex-1 justify-center items-center p-6 bg-neutral-off-white">
      <View className="items-center text-center">
        {isLoading && (
          <>
            <ActivityIndicator size="large" color="#A0D2DB" />
            <Text className="mt-4 text-lg text-neutral-dark-gray">Verificando tu email...</Text>
          </>
        )}

        {!isLoading && verificationStatus === 'success' && (
          <>
            <Text className="text-2xl font-bold text-secondary-green mb-4">¡Éxito!</Text>
            <Text className="text-center text-neutral-dark-gray mb-6">{message}</Text>
            <Button label="Ir a Iniciar Sesión" onPress={handleGoToLogin} variant="primary" />
            <View className="my-2" />
            <Button label="Ir a la App" onPress={handleGoHome} variant="secondary" />
          </>
        )}

        {!isLoading && verificationStatus === 'error' && (
          <>
            <Text className="text-2xl font-bold text-accent-coral mb-4">Error de Verificación</Text>
            <Text className="text-center text-neutral-dark-gray mb-6">{message}</Text>
            {/* Consider adding a retry button if appropriate for certain errors */}
            <Button label="Volver a Inicio de Sesión" onPress={handleGoToLogin} variant="primary" />
          </>
        )}
      </View>
    </Container>
  )
}
