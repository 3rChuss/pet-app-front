import AsyncStorage from '@react-native-async-storage/async-storage'

const TOKEN = 'token'

export type TokenType = {
  access: string
  refresh: string
}

export const getToken = async (): Promise<TokenType | null> => {
  const json = await AsyncStorage.getItem(TOKEN)
  return json ? (JSON.parse(json) as TokenType) : null
}

export const removeToken = () => AsyncStorage.removeItem(TOKEN)

export const setToken = (value: TokenType) => {
  const json = JSON.stringify(value)
  return AsyncStorage.setItem(TOKEN, json)
}
