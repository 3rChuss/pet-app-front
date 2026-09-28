import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'

const TOKEN = 'petopia_auth_tokens'
const LEGACY_TOKEN = 'token'

export type TokenType = {
  access: string
  refresh: string
}

export type StoredSession = TokenType & {
  user?: unknown
}

const parseSession = (value: unknown): StoredSession | null => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null
  }
  const record = value as Record<string, unknown>
  if (typeof record.access !== 'string' || typeof record.refresh !== 'string') {
    return null
  }
  return { access: record.access, refresh: record.refresh, user: record.user }
}

const readLegacySession = async (): Promise<StoredSession | null> => {
  const json = await AsyncStorage.getItem(LEGACY_TOKEN)
  if (!json) {
    return null
  }
  await AsyncStorage.removeItem(LEGACY_TOKEN)
  try {
    return parseSession(JSON.parse(json))
  } catch {
    return null
  }
}

const readSession = async (): Promise<StoredSession | null> => {
  const stored = await SecureStore.getItemAsync(TOKEN)

  if (stored) {
    try {
      const parsed = parseSession(JSON.parse(stored))
      if (parsed) {
        return parsed
      }
    } catch {
      // Corrupted entry: drop it so the next sign-in writes a valid one
    }
    await SecureStore.deleteItemAsync(TOKEN)
    return null
  }

  const legacySession = await readLegacySession()
  if (legacySession) {
    await setSession(legacySession)
  }
  return legacySession
}

export const getSession = (): Promise<StoredSession | null> => readSession()

export const getToken = async (): Promise<TokenType | null> => {
  const session = await readSession()
  return session ? { access: session.access, refresh: session.refresh } : null
}

export const removeToken = () => SecureStore.deleteItemAsync(TOKEN)

export const setSession = (session: StoredSession) =>
  SecureStore.setItemAsync(TOKEN, JSON.stringify(session))
