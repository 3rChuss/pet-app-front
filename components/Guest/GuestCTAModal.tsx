import { useRouter } from 'expo-router'
import { View, Text, StyleSheet, Modal } from 'react-native'

import Button from '@/components/Button/Button'

interface GuestCTAModalProps {
  visible: boolean
  onClose: () => void
  feature?: string
  title?: string
  description?: string
}

export default function GuestCTAModal({
  visible,
  onClose,
  feature,
  title,
  description,
}: GuestCTAModalProps) {
  const router = useRouter()

  const handleRegister = () => {
    onClose()
    router.push('/(auth)/register')
  }

  const handleLogin = () => {
    onClose()
    router.push('/(auth)/login')
  }

  const getDefaultContent = () => {
    if (feature) {
      const messages: Record<string, { title: string; description: string }> = {
        create: {
          title: '¡Comparte momentos únicos!',
          description:
            'Únete a Petopia para compartir fotos y experiencias de tu mascota con la comunidad.',
        },
        like: {
          title: '¡Muestra tu amor!',
          description: 'Regístrate para dar me gusta y conectar con otros amantes de las mascotas.',
        },
        comment: {
          title: '¡Únete a la conversación!',
          description: 'Crea tu cuenta para comentar y compartir consejos con otros dueños.',
        },
        follow: {
          title: '¡Sigue a tu gente!',
          description: 'Regístrate para seguir a otros usuarios y no perderte sus publicaciones.',
        },
      }
      return messages[feature] || messages.create
    }

    return {
      title: title || '¡Únete a la comunidad Petopia!',
      description: description || 'Descubre todo lo que puedes hacer con tu cuenta gratuita.',
    }
  }

  const content = getDefaultContent()

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <View style={styles.header}>
            <Text style={styles.emoji}>🐾</Text>
            <Text style={styles.title} className="font-quicksand-bold">
              {content.title}
            </Text>
          </View>

          <Text style={styles.description} className="font-nunito">
            {content.description}
          </Text>

          <View style={styles.benefits}>
            <Text style={styles.benefitTitle} className="font-quicksand-semibold">
              Con tu cuenta gratis podrás:
            </Text>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitEmoji}>📸</Text>
              <Text style={styles.benefitText} className="font-nunito">
                Compartir fotos de tu mascota
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitEmoji}>❤️</Text>
              <Text style={styles.benefitText} className="font-nunito">
                Dar me gusta y comentar
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitEmoji}>🗺️</Text>
              <Text style={styles.benefitText} className="font-nunito">
                Descubrir lugares pet-friendly
              </Text>
            </View>
            <View style={styles.benefitItem}>
              <Text style={styles.benefitEmoji}>👥</Text>
              <Text style={styles.benefitText} className="font-nunito">
                Conectar con otros dueños
              </Text>
            </View>
          </View>

          <View style={styles.buttons}>
            <Button
              variant="primary"
              label="Crear cuenta gratis"
              onPress={handleRegister}
              className="bg-primary mb-3"
              textClassName="!text-white !font-nunito-bold"
            />

            <Text
              className="text-center text-sm text-neutral-medium-gray mb-4 font-nunito"
              onPress={handleLogin}
            >
              ¿Ya tienes cuenta? <Text className="font-bold text-primary">Inicia sesión aquí</Text>
            </Text>
          </View>

          <Button
            variant="secondary"
            label="Seguir explorando"
            onPress={onClose}
            className="bg-transparent mt-4"
            textClassName="!text-neutral-medium-gray text-sm"
          />
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 16,
  },
  emoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  title: {
    fontSize: 22,
    color: '#424242',
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 22,
  },
  benefits: {
    width: '100%',
    marginBottom: 24,
  },
  benefitTitle: {
    fontSize: 16,
    color: '#424242',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  benefitEmoji: {
    fontSize: 18,
    marginRight: 12,
    width: 24,
  },
  benefitText: {
    fontSize: 14,
    color: '#666',
    flex: 1,
  },
  buttons: {
    width: '100%',
  },
})
