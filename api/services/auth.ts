import client from '@/api/client'
import { normalizeAuthSession } from '@/lib/adapters/auth-adapter'
import { RegisterParams, AuthSession } from '@/lib/types/auth'

export const login = async (email: string, password: string): Promise<AuthSession> => {
  const response = await client.post('/login', { email, password })
  return normalizeAuthSession(response.data)
}

export const resetPassword = async (params: { id: number; hash: string; signature: string }) =>
  await client.post('/reset-password', params)

export const signOut = async () => {
  await client.post('/logout')
  // Optionally clear local storage or cookies if needed
  // localStorage.removeItem('token')
  // document.cookie
  //   = 'token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/'
  // router.replace('/(auth)/login')
}

export const register = async (params: RegisterParams) => await client.post('/register', params)

export const forgotPassword = async (email: string) =>
  await client.post('/send-password-reset-link', { email })
