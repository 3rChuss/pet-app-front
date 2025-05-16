import { Text, View } from 'react-native'

import { Link } from 'expo-router'

export default function Page() {
  return (
    <View className="flex-1 items-center justify-center">
      <Link href="/(auth)/login">
        <View className="bg-blue-500 p-4 rounded">
          <Text className="text-white">Go to Login</Text>
        </View>
      </Link>
    </View>
  )
}
