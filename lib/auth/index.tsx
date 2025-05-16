import { create } from 'zustand'

import { createSelectors } from '../utils'

import { getToken, removeToken, setToken } from './utils'

import type { TokenType } from './utils'

interface AuthState {
  token: TokenType | null
  status: 'idle' | 'signOut' | 'signIn'
  signIn: (data: TokenType) => void
  signOut: () => void
  hydrate: () => void
}

const _useAuth = create<AuthState>((set, get) => ({
  status: 'idle',
  token: null,
  signIn: async token => {
    await setToken(token)
    set({ status: 'signIn', token })
  },
  signOut: async () => {
    await removeToken()
    set({ status: 'signOut', token: null })
  },
  hydrate: async () => {
    try {
      const userToken = await getToken()
      if (userToken !== null) {
        get().signIn(userToken)
      } else {
        get().signOut()
      }
    } catch (e) {
      // catch error here
      // Maybe sign_out user!
    }
  },
}))

export const useAuth = createSelectors(_useAuth)

export const signOut = () => _useAuth.getState().signOut()
export const signIn = (token: TokenType) => _useAuth.getState().signIn(token)
export const hydrateAuth = () => _useAuth.getState().hydrate()
