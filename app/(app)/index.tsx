import React from 'react'

import { Link } from 'expo-router'
import { View, Text } from 'react-native'

export default function AppIndexScreen() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text className="text-2xl font-quicksand mb-4">App Home (Index)</Text>
      <Text className="font-nunito mb-8">Welcome to the main app area!</Text>
      <Link href="/home" className="text-blue-500 font-nunito mb-4">
        Go to Video Home (app/home.tsx)
      </Link>
      <Link href="/feed" className="text-blue-500 font-nunito">
        Go to Feed
      </Link>
      {/* Add navigation to other parts of your app here */}
    </View>
  )
}
