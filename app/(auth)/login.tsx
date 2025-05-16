import { useRouter } from 'expo-router'
import { View } from 'react-native'

import { LoginForm } from '@/components/Auth/login-form'
import { useAuth } from '@/lib/auth'

export default function Login() {
  const router = useRouter()
  const signIn = useAuth.use.signIn()

  const onSubmit = (data: unknown) => {
    console.log(data)
    signIn({ access: 'access-token', refresh: 'refresh-token' })
    router.push('/feed')
  }
  return (
    <View className="flex-1 justify-center items-center bg-base-neutral-off-white">
      <View className="w-full max-w-md p-4">
        <LoginForm onSubmit={onSubmit} />
      </View>
    </View>
  )
}
