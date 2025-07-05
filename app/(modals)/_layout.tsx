import { Stack } from 'expo-router'

export default function ModalsLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="edit-profile"
        options={{
          title: 'Editar Perfil',
          headerShown: false,
          presentation: 'modal',
          gestureEnabled: true,
          gestureDirection: 'vertical',
        }}
      />
    </Stack>
  )
}
