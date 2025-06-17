import * as SecureStore from 'expo-secure-store'
import { create } from 'zustand'

import { createSelectors } from '../utils'

import { getToken, removeToken, setToken } from './utils'

import type { TokenType } from './utils'
import type { AppTypes } from 'app-types'

interface AuthState {
  token: TokenType | null
  user: AppTypes.User | null
  isLoading: boolean
  status: 'idle' | 'signOut' | 'signIn'
  signIn: (data: TokenType) => void
  signOut: () => void
  hydrate: () => void
}

const _useAuth = create<AuthState>((set, get) => ({
  status: 'idle',
  token: null,
  user: null,
  isLoading: false,
  signIn: async data => {
    const { accessToken } = data
    await setToken(accessToken)
    set({ status: 'signIn', token: { accessToken } })
  },
  signOut: async () => {
    await removeToken()
    set({ status: 'signOut', token: null })
  },
  hydrate: async () => {
    try {
      const userToken = await getToken()
      if (userToken) {
        get().signIn({ accessToken: userToken })
      } else {
        get().signOut()
      }
    } catch (e) {
      // catch error here
      // Maybe sign_out user!
    }
  },
  initializeAuth: async () => {
    try {
      const token = await SecureStore.getItemAsync('authToken')
      if (token) {
        // Aquí podrías validar el token y obtener datos del usuario
        // Por ahora, asumimos que si hay token, está autenticado
        // const userData = await fetchUserProfile(token);
        set({
          token: {
            accessToken: token,
          },
          status: 'signIn',
        })
      }
    } catch (e) {
      console.error('Error al inicializar auth:', e)
    } finally {
      set({ isLoading: false })
    }
  },
}))

export const useAuth = createSelectors(_useAuth)

export const signOut = () => _useAuth.getState().signOut()
export const signIn = (token: TokenType) => _useAuth.getState().signIn(token)
export const hydrateAuth = () => _useAuth.getState().hydrate()
