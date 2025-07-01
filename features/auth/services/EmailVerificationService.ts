import client from '@/api/client'

import type { EmailVerificationParams, EmailVerificationResponse } from '../types/verification'

export class EmailVerificationService {
  /**
   * Verifica el email del usuario usando los parámetros del deep link
   */
  static async verifyEmail(params: EmailVerificationParams): Promise<EmailVerificationResponse> {
    const { id, hash, expires, signature } = params

    const response = await client.post(`/email/verify`, {
      params: {
        id,
        hash,
        expires,
        signature,
      },
    })

    return response.data
  }

  /**
   * Valida que todos los parámetros requeridos estén presentes
   */
  static validateParams(
    params: Partial<EmailVerificationParams>
  ): params is EmailVerificationParams {
    const { id, hash, expires, signature } = params
    return !!(id && hash && expires && signature)
  }
}
