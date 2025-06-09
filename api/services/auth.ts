import client from '@/api/client'

export const login = async (email: string, password: string) =>
  await client.post('/login', { email, password })

export const resetPassword = async (params: { id: number; hash: string; signature: string }) =>
  await client.post('/reset-password', params)
