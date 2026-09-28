import type { TokenType } from '@/lib/auth/utils'

export interface AuthCredentials {
  email: string
  password: string
}

export interface RegisterParams extends AuthCredentials {
  name: string
  passwordConfirmation: string
  acceptedPrivacyPolicy: boolean
  //acceptedTermsOfService: boolean
}

export interface ResetPasswordParams {
  id: number
  hash: string
  signature: string
}

export interface User {
  id: number
  name: string
  email: string
  emailVerifiedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface AuthSession extends TokenType {
  user: User
}
