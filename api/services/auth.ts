import client from '@/api/client'

export const login = (email: string, password: string) => client.post('/login', { email, password })

export const resetPassword = (params: { id: number; hash: string; signature: string }) =>
  client.post('/reset-password', params)
