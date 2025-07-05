import client from '@/api/client'

import {
  EmailVerificationParams,
  EmailVerificationResponse,
  LoginParams,
  RegisterParams,
  ResetPasswordParams,
} from '../types'

export class AuthService {
  static async login({ email, password }: LoginParams): Promise<any> {
    return await client.post('/login', {
      email,
      password,
    })
  }

  static async register(params: RegisterParams): Promise<any> {
    return await client.post('/register', params)
  }

  static async resetPassword(params: ResetPasswordParams): Promise<any> {
    return await client.post('/reset-password', params)
  }

  static async forgotPassword(email: string): Promise<any> {
    return await client.post('/forgot-password', { email })
  }

  static async signOut(): Promise<any> {
    return await client.post('/logout')
  }

  static async verifyEmail(params: EmailVerificationParams): Promise<EmailVerificationResponse> {
    const { id, hash, expires, signature } = params
    const response = await client.post(`/email/verify`, {
      id,
      hash,
      expires,
      signature,
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
