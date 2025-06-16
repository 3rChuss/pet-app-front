import client from '@/api/client'
import { RegisterParams } from '@/lib/types/auth'

export const login = async (email: string, password: string) =>
  await client.post('/login', { email, password })

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
