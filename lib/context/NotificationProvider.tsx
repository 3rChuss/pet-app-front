import { createContext, useContext, useState, ReactNode } from 'react'

import ErrorModal, { ErrorSeverity } from '@/components/Notifications/ErrorModal'
import Toast, { ToastType } from '@/components/Notifications/Toast'

interface ToastData {
  id: string
  message: string
  type: ToastType
  duration?: number
}

interface ErrorModalData {
  id: string
  title: string
  message: string
  severity: ErrorSeverity
  actionText?: string
  cancelText?: string
  onAction?: () => void
  onCancel?: () => void
  hideCancel?: boolean
}

interface NotificationContextType {
  showToast: (message: string, type: ToastType, duration?: number) => void
  showErrorModal: (
    title: string,
    message: string,
    severity: ErrorSeverity,
    options?: {
      actionText?: string
      cancelText?: string
      onAction?: () => void
      onCancel?: () => void
      hideCancel?: boolean
    }
  ) => void
  hideToast: (id?: string) => void
  hideErrorModal: (id?: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

interface NotificationProviderProps {
  children: ReactNode
}

export function NotificationProvider({ children }: NotificationProviderProps) {
  const [toasts, setToasts] = useState<ToastData[]>([])
  const [errorModals, setErrorModals] = useState<ErrorModalData[]>([])

  const showToast = (message: string, type: ToastType, duration = 3000) => {
    const id = Date.now().toString()
    const newToast: ToastData = { id, message, type, duration }

    // Only show one toast at a time - replace existing
    setToasts([newToast])
  }

  const showErrorModal = (
    title: string,
    message: string,
    severity: ErrorSeverity,
    options?: {
      actionText?: string
      cancelText?: string
      onAction?: () => void
      onCancel?: () => void
      hideCancel?: boolean
    }
  ) => {
    const id = Date.now().toString()
    const newModal: ErrorModalData = {
      id,
      title,
      message,
      severity,
      ...options,
    }

    // Only show one modal at a time - replace existing
    setErrorModals([newModal])
  }

  const hideToast = (id?: string) => {
    if (id) {
      setToasts(prev => prev.filter(toast => toast.id !== id))
    } else {
      setToasts([])
    }
  }

  const hideErrorModal = (id?: string) => {
    if (id) {
      setErrorModals(prev => prev.filter(modal => modal.id !== id))
    } else {
      setErrorModals([])
    }
  }

  return (
    <NotificationContext.Provider
      value={{
        showToast,
        showErrorModal,
        hideToast,
        hideErrorModal,
      }}
    >
      {children}

      {/* Render Toasts */}
      {toasts.map(toast => (
        <Toast
          key={toast.id}
          visible={true}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          onHide={() => hideToast(toast.id)}
        />
      ))}

      {/* Render Error Modals */}
      {errorModals.map(modal => (
        <ErrorModal
          key={modal.id}
          visible={true}
          title={modal.title}
          message={modal.message}
          severity={modal.severity}
          actionText={modal.actionText}
          cancelText={modal.cancelText}
          onAction={modal.onAction}
          onCancel={modal.onCancel}
          onClose={() => hideErrorModal(modal.id)}
          hideCancel={modal.hideCancel}
        />
      ))}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider')
  }
  return context
}
