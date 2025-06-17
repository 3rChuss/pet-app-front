import { Ionicons } from '@expo/vector-icons'
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native'
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context'

import Button from '@/components/Button/Button'

export type ErrorSeverity = 'critical' | 'high' | 'medium' | 'low'

interface ErrorModalProps {
  visible: boolean
  title: string
  message: string
  severity: ErrorSeverity
  actionText?: string
  cancelText?: string
  onAction?: () => void
  onCancel?: () => void
  onClose: () => void
  hideCancel?: boolean
}

export default function ErrorModal({
  visible,
  title,
  message,
  severity,
  actionText = 'Aceptar',
  cancelText = 'Cancelar',
  onAction,
  onCancel,
  onClose,
  hideCancel = false,
}: ErrorModalProps) {
  const getSeverityConfig = (errorSeverity: ErrorSeverity) => {
    switch (errorSeverity) {
      case 'critical':
        return {
          iconName: 'alert-circle' as const,
          iconColor: '#DC143C',
          iconBackgroundColor: '#F47C7C',
          titleColor: '#DC143C',
        }
      case 'high':
        return {
          iconName: 'warning' as const,
          iconColor: '#DAA520',
          iconBackgroundColor: '#FFDA63',
          titleColor: '#DAA520',
        }
      case 'medium':
        return {
          iconName: 'information-circle' as const,
          iconColor: '#0077BE',
          iconBackgroundColor: '#A0D2DB',
          titleColor: '#0077BE',
        }
      case 'low':
        return {
          iconName: 'checkmark-circle' as const,
          iconColor: '#228B22',
          iconBackgroundColor: '#C8E6C9',
          titleColor: '#228B22',
        }
    }
  }

  const config = getSeverityConfig(severity)

  const handleAction = () => {
    if (onAction) {
      onAction()
    } else {
      onClose()
    }
  }

  const handleCancel = () => {
    if (onCancel) {
      onCancel()
    } else {
      onClose()
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.centeredView}>
        <Modal
          visible={visible}
          transparent
          animationType="fade"
          statusBarTranslucent
          onRequestClose={onClose}
          className="h-screen w-screen"
          presentationStyle="overFullScreen"
        >
          <View style={styles.overlay}>
            <Pressable style={styles.backdrop} onPress={onClose} />
            <View style={styles.container}>
              <View style={styles.modal}>
                <View
                  style={[styles.iconContainer, { backgroundColor: config.iconBackgroundColor }]}
                >
                  <Ionicons name={config.iconName} size={32} color={config.iconColor} />
                </View>

                {/* Content */}
                <View style={styles.content}>
                  <Text style={[styles.title, { color: config.titleColor }]}>{title}</Text>
                  <Text style={styles.message}>{message}</Text>
                </View>

                {/* Actions */}
                <View style={styles.actions}>
                  {!hideCancel && (
                    <Button
                      label={cancelText}
                      onPress={handleCancel}
                      variant="primary"
                      className="flex-1 mr-2 bg-neutral-light-gray"
                      textClassName="!text-neutral-dark-gray"
                    />
                  )}
                  <Button
                    label={actionText}
                    onPress={handleAction}
                    variant="primary"
                    className={`${hideCancel ? 'flex-1' : 'flex-1 ml-2'} bg-primary`}
                    textClassName="!text-neutral-off-white !font-bold"
                  />
                </View>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    width: '90%',
    maxWidth: 400,
  },
  modal: {
    backgroundColor: '#FDFDFD', // neutral_off_white
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  content: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  message: {
    fontSize: 14,
    color: '#424242', // neutral_dark_gray
    textAlign: 'center',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    width: '100%',
  },
})
