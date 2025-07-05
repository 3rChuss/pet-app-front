export interface LoginParams {
  email: string
  password: string
}

export interface RegisterParams extends LoginParams {
  name: string
  passwordConfirmation: string
  acceptedPrivacyPolicy: boolean
  //acceptedTermsOfService: boolean
}

export interface ResetPasswordParams {
  token: string
  email: string
  password: string
  passwordConfirmation: string
}

export interface User {
  id: number
  name: string
  email: string
  emailVerifiedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface EmailVerificationParams {
  id: string
  hash: string
  expires: string
  signature: string
}

export interface EmailVerificationResponse {
  message: string
}

export interface EmailVerificationErrorResponse {
  message: string
  errors?: Record<string, string[]>
}
