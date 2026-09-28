import { create } from 'zustand'

import { signOut as requestServerSignOut } from '@/api/services/auth'
import { normalizeStoredUser } from '@/lib/adapters/auth-adapter'
import { createSelectors } from '@/lib/utils'

import { getSession, removeToken, setSession } from './utils'

import type { TokenType } from './utils'
import type { AuthSession, User } from '@/lib/types/auth'

interface AuthState {
  token: TokenType | null
  user: User | null
  isLoading: boolean
  isHydrated: boolean
  status: 'idle' | 'signOut' | 'signIn'
  signIn: (session: AuthSession) => Promise<void>
  signOut: (options?: { notifyServer?: boolean }) => Promise<void>
  hydrate: () => Promise<void>
}

let hydration: Promise<void> | null = null

const _useAuth = create<AuthState>((set, get) => ({
  status: 'idle',
  token: null,
  user: null,
  isLoading: false,
  isHydrated: false,
  signIn: async session => {
    set({ isLoading: true })
    try {
      await setSession(session)
      set({
        status: 'signIn',
        token: { access: session.access, refresh: session.refresh },
        user: session.user,
      })
    } finally {
      set({ isLoading: false })
    }
  },
  signOut: async ({ notifyServer = true } = {}) => {
    const { token } = get()

    if (notifyServer && token?.access) {
      try {
        await requestServerSignOut()
      } catch (error) {
        // The local session must be cleared even if the server call fails
        console.warn('Server sign-out failed, clearing local session anyway:', error)
      }
    }

    await removeToken()
    set({ status: 'signOut', token: null, user: null, isLoading: false })
  },
  hydrate: () => {
    if (hydration === null) {
      hydration = (async () => {
        try {
          const session = await getSession()
          if (session === null) {
            await get().signOut({ notifyServer: false })
            return
          }

          set({
            status: 'signIn',
            token: { access: session.access, refresh: session.refresh },
          })

          const user = normalizeStoredUser(session.user)
          if (user) {
            set({ user })
          }
        } catch (error) {
          // Never leave the app stuck: fall back to a signed-out state
          console.error('Failed to hydrate the auth session:', error)
          await removeToken()
          set({ status: 'signOut', token: null, user: null })
        } finally {
          set({ isHydrated: true })
        }
      })().finally(() => {
        hydration = null
      })
    }
    return hydration
  },
}))

export const useAuth = createSelectors(_useAuth)

export const signOut = (options?: { notifyServer?: boolean }) =>
  _useAuth.getState().signOut(options)
export const signIn = (session: AuthSession) => _useAuth.getState().signIn(session)
export const hydrateAuth = () => _useAuth.getState().hydrate()
