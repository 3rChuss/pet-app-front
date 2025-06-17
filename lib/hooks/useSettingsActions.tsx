import { useCallback } from 'react'

import { Linking, Alert } from 'react-native'

import { useNotifications } from '@/lib/context/NotificationProvider'

/**
 * Hook para manejar las acciones de configuración de la aplicación
 * Centraliza la lógica de configuración y proporciona feedback al usuario
 */
export function useSettingsActions() {
  const { showToast, showErrorModal } = useNotifications()

  /**
   * Maneja la configuración de permisos
   */
  const handlePermissions = useCallback(() => {
    showErrorModal(
      'Configuración de Permisos',
      'Aquí podrás gestionar los permisos de cámara, ubicación y notificaciones para personalizar tu experiencia.',
      'medium',
      {
        actionText: 'Entendido',
        hideCancel: true,
      }
    )
  }, [showErrorModal])

  /**
   * Maneja la configuración de notificaciones
   */
  const handleNotifications = useCallback(() => {
    showErrorModal(
      'Configuración de Notificaciones',
      'Personaliza qué notificaciones quieres recibir: nuevos seguidores, likes, comentarios y más.',
      'medium',
      {
        actionText: 'Entendido',
        hideCancel: true,
      }
    )
  }, [showErrorModal])

  /**
   * Abre el centro de ayuda
   */
  const handleHelp = useCallback(() => {
    showErrorModal(
      'Centro de Ayuda',
      '¿Necesitas ayuda? Aquí encontrarás respuestas a las preguntas más frecuentes y podrás contactar con nuestro equipo de soporte.',
      'medium',
      {
        actionText: 'Entendido',
        hideCancel: true,
      }
    )
  }, [showErrorModal])

  /**
   * Abre la política de privacidad
   */
  const handlePrivacy = useCallback(() => {
    const privacyUrl = 'https://tu-pagina-web.com/politica-de-privacidad'

    Alert.alert(
      'Política de Privacidad',
      'Se abrirá tu navegador para ver nuestra política de privacidad.',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Abrir',
          onPress: () => {
            Linking.openURL(privacyUrl).catch(() => {
              showToast('No se pudo abrir el enlace', 'error', 3000)
            })
          },
        },
      ]
    )
  }, [showToast])

  /**
   * Muestra información de la aplicación
   */
  const handleAppInfo = useCallback(() => {
    showErrorModal(
      'Petopia',
      'Versión 1.0.0\n\nUna aplicación diseñada con amor para conectar a los amantes de las mascotas de todo el mundo.\n\n© 2025 Petopia Team',
      'medium',
      {
        actionText: 'Genial',
        hideCancel: true,
      }
    )
  }, [showErrorModal])

  return {
    handlePermissions,
    handleNotifications,
    handleHelp,
    handlePrivacy,
    handleAppInfo,
  }
}
