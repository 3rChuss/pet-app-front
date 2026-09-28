import AsyncStorage from '@react-native-async-storage/async-storage'
import * as SecureStore from 'expo-secure-store'

const TOKEN = 'petopia_auth_tokens'
const LEGACY_TOKEN = 'token'

export type TokenType = {
  access: string
  refresh: string
}

const isTokenType = (value: unknown): value is TokenType =>
  typeof value === 'object' &&
  value !== null &&
  typeof (value as TokenType).access === 'string' &&
  typeof (value as TokenType).refresh === 'string'

const readLegacyToken = async (): Promise<TokenType | null> => {
  const json = await AsyncStorage.getItem(LEGACY_TOKEN)
  if (!json) {
    return null
  }
  await AsyncStorage.removeItem(LEGACY_TOKEN)
  try {
    const parsed: unknown = JSON.parse(json)
    return isTokenType(parsed) ? parsed : null
  } catch {
    return null
  }
}

export const getToken = async (): Promise<TokenType | null> => {
  const stored = await SecureStore.getItemAsync(TOKEN)

  if (stored) {
    try {
      const parsed: unknown = JSON.parse(stored)
      if (isTokenType(parsed)) {
        return parsed
      }
    } catch {
      // Corrupted entry: drop it so the next sign-in writes a valid one
    }
    await SecureStore.deleteItemAsync(TOKEN)
    return null
  }

  const legacyToken = await readLegacyToken()
  if (legacyToken) {
    await setToken(legacyToken)
    return legacyToken
  }

  return null
}

export const removeToken = () => SecureStore.deleteItemAsync(TOKEN)

export const setToken = (value: TokenType) => SecureStore.setItemAsync(TOKEN, JSON.stringify(value))
