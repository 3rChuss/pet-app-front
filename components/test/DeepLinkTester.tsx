import React from 'react'

import * as Linking from 'expo-linking'
import { useRouter } from 'expo-router'
import { View, Text, Pressable, StyleSheet, Alert } from 'react-native'

/**
 * Componente para probar los deep links durante el desarrollo
 * NOTA: Este componente es solo para testing y debe ser removido en producción
 */
export function DeepLinkTester() {
  const router = useRouter()

  const testResetPasswordLink = () => {
    // URL de ejemplo para testing
    const testToken = 'd4ff8045ad29af7e6148dd6ffc04337bb5d153872d9bdc22c2b46eda7c9e27f7'
    const testEmail = encodeURIComponent('test@example.com')
    const testUrl = `petopia://auth/reset-password?token=${testToken}&email=${testEmail}`

    console.log('Testing reset password deep link:', testUrl)

    // Simular la apertura del deep link
    Linking.openURL(testUrl).catch(err => {
      console.error('Failed to open URL:', err)
      Alert.alert('Error', 'Failed to open deep link')
    })
  }

  const testVerifyEmailLink = () => {
    // URL de ejemplo para testing de verificación de email
    const testId = '123'
    const testHash = 'abc123def456'
    const testSignature = 'signature123'
    const testUrl = `petopia://auth/verify-email?id=${testId}&hash=${testHash}&signature=${testSignature}`

    console.log('Testing verify email deep link:', testUrl)

    // Simular la apertura del deep link
    Linking.openURL(testUrl).catch(err => {
      console.error('Failed to open URL:', err)
      Alert.alert('Error', 'Failed to open deep link')
    })
  }

  const testForgotPasswordNavigation = () => {
    console.log('Testing normal navigation to forgot password')
    router.push('/(auth)/forgot-password')
  }

  const testResetPasswordLinkNavigation = () => {
    const testToken = 'd4ff8045ad29af7e6148dd6ffc04337bb5d153872d9bdc22c2b46eda7c9e27f7'
    const testEmail = encodeURIComponent('3rchuss@gmail.com')

    router.push(`/(auth)/reset-password?token=${testToken}&email=${testEmail}`)
  }

  const testVerifyEmailLinkNavigation = () => {
    ///verify-email?id=20&hash=eaea420526a4d0ac856987a5f9fd8b97b2795352&expires=1751443254&signature=d0167744dc60c1ce099516e2c237ca3008af9cf6544d463a2b997efd8465e576
    const testId = '20'
    const testHash = 'eaea420526a4d0ac856987a5f9fd8b97b2795352'
    const testExpires = '1751443254'
    const testSignature = 'd0167744dc60c1ce099516e2c237ca3008af9cf6544d463a2b997efd8465e576'

    router.push(
      `/(auth)/verify-email?id=${testId}&hash=${testHash}&expires=${testExpires}&signature=${testSignature}`
    )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Deep Link & Navigation Tester</Text>
      <Text style={styles.subtitle}>Para uso durante desarrollo solamente</Text>

      <Text style={styles.sectionTitle}>🔗 Deep Links (petopia://)</Text>
      <Pressable style={styles.button} onPress={testResetPasswordLink}>
        <Text style={styles.buttonText}>Test Reset Password Deep Link</Text>
      </Pressable>

      <Pressable style={styles.button} onPress={testVerifyEmailLink}>
        <Text style={styles.buttonText}>Test Verify Email Deep Link</Text>
      </Pressable>

      <Text style={styles.sectionTitle}>📱 Navegación Normal</Text>

      <Pressable style={styles.normalButton} onPress={testForgotPasswordNavigation}>
        <Text style={styles.buttonText}>Ir a Forgot Password (router.push)</Text>
      </Pressable>

      <Pressable style={styles.normalButton} onPress={testResetPasswordLinkNavigation}>
        <Text style={styles.buttonText}>Ir a Reset Password (router.push)</Text>
      </Pressable>

      <Pressable style={styles.normalButton} onPress={testVerifyEmailLinkNavigation}>
        <Text style={styles.buttonText}>Ir a Verify Email (router.push)</Text>
      </Pressable>

      <Text style={styles.info}>
        Deep links (azul) abren URLs externas. Navegación normal (verde) usa rutas internas.
      </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    margin: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#ff6b6b',
    borderStyle: 'dashed',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    color: '#666',
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginTop: 16,
    marginBottom: 8,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  normalButton: {
    backgroundColor: '#28A745',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  info: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 16,
  },
})

export default DeepLinkTester
