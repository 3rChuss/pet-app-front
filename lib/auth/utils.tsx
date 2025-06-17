import AsyncStorage from '@react-native-async-storage/async-storage'

const TOKEN = 'token'

export type TokenType = {
  accessToken: string
  refreshToken?: string
}

export const getToken = async (): Promise<string | null> => {
  const token = await AsyncStorage.getItem(TOKEN)
  return token ? token : null
}

export const removeToken = () => AsyncStorage.removeItem(TOKEN)

export const setToken = (token: string) => {
  return AsyncStorage.setItem(TOKEN, token)
}
