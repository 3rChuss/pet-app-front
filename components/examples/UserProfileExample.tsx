/**
 * Example component showing how to use the new API system
 * This demonstrates best practices for API calls with error handling
 */

import React, { useState } from 'react'

import { Text, TouchableOpacity, View, Alert } from 'react-native'

import { getCurrentUser, updateCurrentUser, UserProfile } from '@/api/services/users'
import { useApiCall, useApiError, useLoadingState } from '@/lib/hooks'

export default function UserProfileExample() {
  const [isEditing, setIsEditing] = useState(false)
  const { handleApiError } = useApiError()
  const { setLoading, isAnyLoading } = useLoadingState()

  // Example 1: Using useApiCall hook for automatic data fetching
  const {
    data: userProfile,
    error,
    isLoading: isLoadingProfile,
    retry,
  } = useApiCall<UserProfile>(
    () => getCurrentUser(),
    [], // dependencies - empty array means run once on mount
    true // immediate execution
  )

  // Example 2: Manual API call with error handling
  const handleUpdateProfile = async (newData: { name: string; bio: string }) => {
    const operationKey = 'updateProfile'
    try {
      setLoading(operationKey, true)

      await updateCurrentUser(newData)

      Alert.alert('Éxito', 'Perfil actualizado correctamente')

      // Refresh the profile data
      retry()
      setIsEditing(false)
    } catch (error) {
      // Error is automatically handled by the interceptor
      // but you can add additional logic here if needed
      handleApiError(error, 'Updating user profile')
    } finally {
      setLoading(operationKey, false)
    }
  }

  // Example 3: Handling specific error scenarios
  const handleDeleteAccount = async () => {
    Alert.alert('Confirmar eliminación', '¿Estás seguro de que quieres eliminar tu cuenta?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            // This would be a delete API call
            // await deleteAccount()
            Alert.alert('Cuenta eliminada', 'Tu cuenta ha sido eliminada exitosamente')
          } catch (error: any) {
            // Handle specific error cases
            if (error.status === 403) {
              Alert.alert(
                'Error de permisos',
                'No tienes permisos para eliminar esta cuenta. Contacta soporte.'
              )
            } else {
              handleApiError(error, 'Deleting user account')
            }
          }
        },
      },
    ])
  }

  if (isLoadingProfile) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Cargando perfil...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ marginBottom: 20, textAlign: 'center' }}>Error al cargar el perfil</Text>
        <TouchableOpacity
          onPress={retry}
          style={{
            backgroundColor: '#007AFF',
            padding: 10,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: 'white' }}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        {userProfile?.name || 'Usuario'}
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 10 }}>Email: {userProfile?.email}</Text>

      {userProfile?.bio && (
        <Text style={{ fontSize: 14, marginBottom: 20, color: '#666' }}>{userProfile.bio}</Text>
      )}

      <TouchableOpacity
        onPress={() => setIsEditing(!isEditing)}
        style={{
          backgroundColor: '#007AFF',
          padding: 15,
          borderRadius: 8,
          marginBottom: 10,
        }}
        disabled={isAnyLoading}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>
          {isEditing ? 'Cancelar edición' : 'Editar perfil'}
        </Text>
      </TouchableOpacity>

      {isEditing && (
        <TouchableOpacity
          onPress={() =>
            handleUpdateProfile({
              name: userProfile?.name + ' (editado)',
              bio: 'Bio actualizada desde la app',
            })
          }
          style={{
            backgroundColor: '#34C759',
            padding: 15,
            borderRadius: 8,
            marginBottom: 10,
          }}
          disabled={isAnyLoading}
        >
          <Text style={{ color: 'white', textAlign: 'center' }}>
            {isAnyLoading ? 'Guardando...' : 'Guardar cambios'}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        onPress={handleDeleteAccount}
        style={{
          backgroundColor: '#FF3B30',
          padding: 15,
          borderRadius: 8,
          marginTop: 20,
        }}
        disabled={isAnyLoading}
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Eliminar cuenta</Text>
      </TouchableOpacity>
    </View>
  )
}
