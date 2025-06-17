// Exportaciones principales de notificaciones
export { useApiError } from './useApiError'
export { useFormErrors } from './useFormErrors'
export { useNotifications } from '../context/NotificationProvider'

// Exportaciones de tipos
export type { ApiError, ErrorCategory } from './useApiError'
export type { ToastType } from '../../components/Notifications/Toast'
export type { ErrorSeverity } from '../../components/Notifications/ErrorModal'
