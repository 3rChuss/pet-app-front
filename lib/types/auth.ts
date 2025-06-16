export interface AuthCredentials {
  email: string
  password: string
}

export interface RegisterParams extends AuthCredentials {
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
