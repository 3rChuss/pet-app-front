// features/auth/types/verification.ts

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
