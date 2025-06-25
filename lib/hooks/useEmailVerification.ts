// lib/hooks/useEmailVerification.ts
import { useEffect, useState } from 'react'

interface VerificationSuccessResponse {
  message: string
}
interface VerificationErrorResponse {
  message: string
  errors?: Record<string, string[]>
}

type Status = 'pending' | 'success' | 'error'

export function useEmailVerification(params: {
  id?: string
  hash?: string
  expires?: string
  signature?: string
}) {
  const [status, setStatus] = useState<Status>('pending')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL

  useEffect(() => {
    const { id, hash, expires, signature } = params
    if (!id || !hash || !expires || !signature) {
      setMessage('Enlace de verificación inválido o incompleto.')
      setStatus('error')
      setLoading(false)
      return
    }

    const verify = async () => {
      setLoading(true)
      try {
        const response = await fetch(`${API_BASE_URL}/auth/verify-email`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          body: JSON.stringify({ id, hash, expires, signature }),
        })
        if (response.ok) {
          const data: VerificationSuccessResponse = await response.json()
          setMessage(data.message || '¡Email verificado con éxito!')
          setStatus('success')
        } else {
          const errorData: VerificationErrorResponse = await response.json()
          setMessage(errorData.message || `Error: ${response.status}`)
          setStatus('error')
        }
      } catch (error: any) {
        setMessage(error.message || 'Ocurrió un error de red. Por favor, intenta de nuevo.')
        setStatus('error')
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, [params.id, params.hash, params.expires, params.signature])

  return { status, message, loading }
}
