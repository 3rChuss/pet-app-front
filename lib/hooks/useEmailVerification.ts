// lib/hooks/useEmailVerification.ts
import { useEffect, useState } from 'react'

import client from '@/api/client'

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

  useEffect(() => {
    const { id, hash, expires, signature } = params

    // Verificar que todos los parámetros requeridos estén presentes
    if (!id || !hash || !expires || !signature) {
      setMessage('Enlace de verificación inválido o incompleto.')
      setStatus('error')
      setLoading(false)
      return
    }

    const verify = async () => {
      setLoading(true)

      try {
        // Usar el cliente API configurado con el endpoint correcto
        // Laravel expects a GET request to /email/verify/{id}/{hash}
        const response = await client.get(`/email/verify/${id}/${hash}`, {
          params: {
            expires,
            signature,
          },
        })

        if (response.status >= 200 && response.status < 300) {
          const data: VerificationSuccessResponse = response.data
          setMessage(data.message || '¡Email verificado con éxito!')
          setStatus('success')
        } else {
          setMessage('Error en la verificación del email.')
          setStatus('error')
        }
      } catch (error: any) {
        console.error('Email verification error:', error)

        // Manejar errores específicos de la API
        if (error.response) {
          const errorData: VerificationErrorResponse = error.response.data
          setMessage(
            errorData.message || `Error ${error.response.status}: No se pudo verificar el email.`
          )
        } else if (error.request) {
          setMessage('Error de conexión. Por favor, verifica tu conexión a internet.')
        } else {
          setMessage('Ocurrió un error inesperado. Por favor, intenta de nuevo.')
        }

        setStatus('error')
      } finally {
        setLoading(false)
      }
    }

    verify()
  }, [params])

  return { status, message, loading }
}
