# Sistema de Notificaciones Diferenciadas

Este sistema implementa una estrategia adaptativa para el manejo de errores y notificaciones en la aplicación, reemplazando los alerts bloqueantes por notificaciones contextuales apropiadas según el tipo de error.

## 🚀 Características Principales

### 1. **Notificaciones No Bloqueantes (Toasts)**

- Mensajes de éxito, información y errores leves
- Auto-desaparecen después de un tiempo configurable
- Animaciones fluidas usando Reanimated 2
- Posicionamiento superior para no interferir con el contenido

### 2. **Modales para Errores Críticos**

- Errores de autenticación (sesión expirada)
- Errores del servidor
- Errores que requieren acción del usuario
- Diseño coherente con la guía de estilo visual

### 3. **Errores de Validación Inline**

- Integración directa con `react-hook-form`
- Mapeo automático de errores de API a campos del formulario
- Fallback a notificaciones toast si no se puede mapear

## 🛠️ Instalación y Configuración

### 1. Instalar el Provider en el Layout Principal

```tsx
// app/_layout.tsx
import { NotificationProvider } from '@/lib/context/NotificationProvider'

export default function RootLayout() {
  return <NotificationProvider>{/* Tu app aquí */}</NotificationProvider>
}
```

### 2. Usar en Componentes

```tsx
import { useApiError, useFormErrors } from '@/lib/hooks/notifications'

export default function MyScreen() {
  const { handleApiError, showSuccess } = useApiError()
  const { mapApiErrorsToForm } = useFormErrors({ setError })

  const handleSubmit = async data => {
    try {
      const response = await apiCall(data)
      showSuccess('¡Operación exitosa!')
    } catch (error) {
      // El sistema maneja automáticamente el tipo de error
      const apiError = handleApiError(error, 'Operation context')

      // Para errores de validación en formularios
      if (apiError.validationErrors) {
        handleValidationErrors(apiError, mapApiErrorsToForm)
      }
    }
  }
}
```

## 📋 Tipos de Error y Respuestas

### 1. **Mensajes de Éxito** → Toast Verde

- Status 200, 201
- Mensajes positivos del servidor
- Duración: 4 segundos

### 2. **Errores de Validación** → Inline + Toast Amarillo

- Status 422
- Mapeo automático a campos del formulario
- Fallback a toast si no se puede mapear
- Duración: 5 segundos

### 3. **Errores de Autenticación** → Modal Crítico

- Status 401
- Redirección automática al login
- Modal bloqueante hasta acción

### 4. **Errores de Autorización** → Modal de Advertencia

- Status 403
- Modal informativo
- Sin redirección automática

### 5. **Errores de Red** → Toast Rojo

- Status 0, 408, 503, 504
- Mensaje informativo sobre conectividad
- Duración: 6 segundos

### 6. **Errores del Servidor** → Modal de Error

- Status >= 500
- Modal con opción de reintentar
- Reporte automático para análisis

### 7. **Errores del Cliente** → Toast Rojo

- Status 400-499 (excluye 401, 403, 422)
- Notificación no bloqueante
- Duración: 5 segundos

## 🎨 Diseño y Estilos

### Colores (según la guía de estilo)

- **Éxito**: `#C8E6C9` (secondary_green)
- **Error**: `#F47C7C` (accent_coral)
- **Advertencia**: `#FFDA63` (accent_yellow)
- **Información**: `#A0D2DB` (primary)

### Características Visuales

- Bordes redondeados de 12px
- Sombras sutiles para profundidad
- Iconos de Ionicons para consistencia
- Animaciones usando Reanimated 2

## 🔧 API del Hook `useApiError`

```tsx
const {
  // Función principal - manejo automático
  handleApiError,

  // Manejo específico de validaciones
  handleValidationErrors,

  // Funciones específicas por tipo
  showSuccess,
  showValidationError,
  showAuthenticationError,
  showAuthorizationError,
  showNetworkError,
  showServerError,
  showClientError,
  showUnknownError,

  // Utilidades
  categorizeError,
  reportApiError,
} = useApiError()
```

## 📝 Integración con Formularios

### Configuración Básica

```tsx
import { useForm } from 'react-hook-form'
import { useApiError, useFormErrors } from '@/lib/hooks/notifications'

export default function MyForm() {
  const { setError } = useForm()
  const { handleApiError, handleValidationErrors } = useApiError()
  const { mapApiErrorsToForm } = useFormErrors({ setError })

  const onSubmit = async data => {
    try {
      await submitData(data)
    } catch (error) {
      const apiError = handleApiError(error)

      // Manejo automático de errores de validación
      if (apiError.validationErrors) {
        handleValidationErrors(apiError, mapApiErrorsToForm)
      }
    }
  }
}
```

### Mapeo de Campos Personalizado

El hook `useFormErrors` mapea automáticamente campos comunes de API a formulario:

```tsx
// Mapeo automático incluido:
{
  'email': 'email',
  'password': 'password',
  'password_confirmation': 'passwordConfirmation',
  'first_name': 'firstName',
  'last_name': 'lastName',
  // etc...
}
```

## 🚨 Migración desde el Sistema Anterior

### Antes (con Alerts)

```tsx
const { showError, showValidationErrors } = useApiError()

try {
  await apiCall()
} catch (error) {
  showError(error) // Alert bloqueante
}
```

### Después (Sistema Diferenciado)

```tsx
const { handleApiError } = useApiError()

try {
  await apiCall()
} catch (error) {
  handleApiError(error) // Manejo automático contextual
}
```

## 🔄 Casos de Uso Avanzados

### Manejo Manual por Tipo

```tsx
const { categorizeError, showNetworkError, showServerError } = useApiError()

try {
  await apiCall()
} catch (error) {
  const category = categorizeError(error)

  switch (category) {
    case 'network':
      showNetworkError(error)
      // Lógica adicional para errores de red
      break
    case 'server':
      showServerError(error)
      // Lógica adicional para errores del servidor
      break
    default:
      handleApiError(error)
  }
}
```

### Personalización de Mensajes

```tsx
const { showSuccess, showErrorModal } = useNotifications()

// Mensaje de éxito personalizado
showSuccess('¡Tu mascota fue registrada exitosamente!')

// Modal de error personalizado
showErrorModal(
  'Límite alcanzado',
  'Has alcanzado el límite de fotos por día. Intenta mañana.',
  'medium',
  {
    actionText: 'Entendido',
    hideCancel: true,
  }
)
```

## 📱 Consideraciones de UX

1. **No Sobrecarga**: Solo una notificación toast visible a la vez
2. **Jerarquía Clara**: Modales solo para errores que requieren atención inmediata
3. **Feedback Inmediato**: Animaciones fluidas para transiciones suaves
4. **Accesibilidad**: Colores con contraste adecuado y texto legible
5. **Consistencia**: Diseño coherente con la identidad visual de la app

## 🐛 Debugging y Reportes

Todos los errores se reportan automáticamente usando el `ErrorReportingService` existente, manteniendo el contexto y metadatos para análisis posterior.

---

Este sistema proporciona una experiencia de usuario más fluida y profesional, eliminando las interrupciones innecesarias mientras mantiene la clarity sobre el estado de las operaciones.
