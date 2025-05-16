import { Stack, Redirect } from 'expo-router'

import { useAuth } from '@/lib/auth' // Assuming your auth hook is here

export default function AppLayout() {
  const { status } = useAuth() // Or however you get the auth status

  // You can add a check here to redirect to login if the user is somehow
  // not authenticated when they reach this layout.
  if (status === 'signOut') {
    return <Redirect href="/(auth)/login" />
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      {/* This will look for app/(app)/index.tsx */}
      {/* You could also directly name your home screen if it's in this group: */}
      {/* <Stack.Screen name="home" /> */}
      {/* Add other screens/groups within the (app) group here */}
    </Stack>
  )
}
