# Sistema de Interceptores de Red - PetApp

Este documento describe el sistema completo de interceptores HTTP implementado para la aplicación PetApp, utilizando Axios con manejo automático de autenticación y errores.

## 📁 Archivos Modificados/Creados

### Archivos Principales

- **`api/client.ts`** - Cliente HTTP mejorado con interceptores completos
- **`api/config.ts`** - Configuración centralizada de la API
- **`api/services/users.ts`** - Ejemplo de servicio con tipos TypeScript

### Hooks y Utilidades

- **`lib/hooks/useApiError.tsx`** - Hook para manejo de errores de API
- **`lib/hooks/useApiCall.tsx`** - Hook para llamadas de API con estado automático
- **`lib/hooks/index.tsx`** - Exportación de nuevos hooks

### Componentes de Ejemplo

- **`components/examples/UserProfileExample.tsx`** - Ejemplo práctico de uso

## 🚀 Características Principales

### 1. **Interceptor de Autenticación**

- **Inyección automática de tokens**: Añade automáticamente el token Bearer en cada request
- **Manejo de tokens**: Obtiene tokens desde AsyncStorage usando el sistema existente
- **Refresh automático**: Base para implementar renovación de tokens (comentado para implementación futura)

### 2. **Interceptor de Errores Centralizado**

- **Manejo por códigos de estado**:
  - `401`: Cierre de sesión automático y redirección al login
  - `403`: Mensaje de permisos insuficientes
  - `404`: Recurso no encontrado
  - `422`: Errores de validación con detalles específicos
  - `429`: Rate limiting
  - `5xx`: Errores de servidor
  - **Network errors**: Detección de problemas de conectividad

### 3. **Logging Inteligente**

- **Solo en desarrollo**: Los logs se muestran únicamente en modo desarrollo
- **Requests**: Información detallada de cada petición (método, URL, headers, data)
- **Responses**: Status y datos de respuesta
- **Errors**: Información completa de errores con contexto

### 4. **Integración con Error Reporting**

- Reporte automático de errores usando el sistema existente del proyecto
- Contexto adicional para debugging
- Clasificación por severidad

## 📋 Configuración

### Variables de Entorno (Futuro)

```typescript
// En app.json o app.config.js
{
  "expo": {
    "extra": {
      "apiUrl": "https://your-api.com/api"
    }
  }
}

// Acceso en la app
process.env.EXPO_PUBLIC_API_URL
```

### Configuración Actual

```typescript
// api/config.ts
const API_CONFIG = {
  TIMEOUT: 15000,
  DEFAULT_BASE_URL: 'https://api.myapp.com/api',
  // ... más configuraciones
}
```

## 🛠 Uso en Componentes

### 1. **Hook useApiCall (Recomendado)**

```typescript
import { useApiCall } from '@/lib/hooks'
import { getCurrentUser } from '@/api/services/users'

function UserProfile() {
  const { data, error, isLoading, retry } = useApiCall(
    () => getCurrentUser(),
    [], // dependencies
    true // immediate execution
  )

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorComponent onRetry={retry} />

  return <UserData user={data} />
}
```

### 2. **Manejo Manual con useApiError**

```typescript
import { useApiError } from '@/lib/hooks'
import { updateCurrentUser } from '@/api/services/users'

function EditProfile() {
  const { handleApiError } = useApiError()

  const handleSave = async userData => {
    try {
      await updateCurrentUser(userData)
      // Success handling
    } catch (error) {
      handleApiError(error, 'Updating user profile')
    }
  }
}
```

### 3. **Uso Directo del Cliente**

```typescript
import client from '@/api/client'

// El cliente ya tiene todos los interceptores configurados
const response = await client.get('/users/me')
// Automáticamente incluye autenticación y manejo de errores
```

## 🔧 Manejo de Errores Específicos

### Errores de Validación (422)

```typescript
// El interceptor automáticamente expone:
{
  userMessage: "Los datos enviados no son válidos",
  validationErrors: {
    email: ["El email ya está registrado"],
    password: ["Debe tener al menos 8 caracteres"]
  }
}
```

### Errores de Autenticación (401)

- **Automático**: Cierre de sesión y redirección al login
- **Configurable**: Base para refresh token (comentado en el código)

### Errores de Red

```typescript
// Automáticamente detecta problemas de conectividad
{
  userMessage: 'Error de conexión. Verifica tu conexión a internet.'
}
```

## 🎯 Ejemplos de Servicios

### Servicio de Usuarios Tipado

```typescript
// api/services/users.ts
export interface User {
  id: string
  name: string
  email: string
  // ...
}

export const getCurrentUser = async (): Promise<UserProfile> => {
  const response = await client.get<UserProfile>('/users/me')
  return response.data
}
```

## 🚨 Mejores Prácticas

### 1. **Siempre usar TypeScript**

```typescript
// ✅ Correcto
const response = await client.get<User[]>('/users')

// ❌ Evitar
const response = await client.get('/users')
```

### 2. **Usar hooks para manejo de estado**

```typescript
// ✅ Recomendado
const { data, error, isLoading } = useApiCall(() => getUsers())

// ❌ Manual (solo si es necesario)
const [data, setData] = useState(null)
const [error, setError] = useState(null)
// ... manejo manual
```

### 3. **Proporcionar contexto en errores**

```typescript
// ✅ Con contexto
handleApiError(error, 'Creating new post')

// ✅ Sin contexto (también válido)
handleApiError(error)
```

### 4. **Reutilizar servicios**

```typescript
// ✅ En servicios separados
export const getUserPosts = async (userId: string) => {
  const response = await client.get(`/users/${userId}/posts`)
  return response.data
}

// ❌ Directamente en componentes
const posts = await client.get(`/users/${userId}/posts`)
```

## 🔮 Funcionalidades Futuras

### 1. **Token Refresh Automático**

```typescript
// Implementar en el interceptor 401
const refreshResponse = await axios.post('/auth/refresh', {
  refresh_token: token.refresh,
})
await setToken(refreshResponse.data)
return client(originalRequest)
```

### 2. **Retry Automático**

```typescript
// Para errores de red temporales
if (isRetryableError(error) && retryCount < maxRetries) {
  await delay(retryDelay * retryCount)
  return client(originalRequest)
}
```

### 3. **Cache de Requests**

```typescript
// Para optimizar rendimiento
const cacheKey = `${config.method}-${config.url}`
if (cache.has(cacheKey)) {
  return cache.get(cacheKey)
}
```

### 4. **Offline Support**

```typescript
// Detectar estado offline y encolar requests
if (!isOnline) {
  await queueRequest(originalRequest)
  throw new OfflineError()
}
```

## 📊 Integración con Error Reporting

El sistema se integra automáticamente con el servicio de error reporting existente:

```typescript
// Automáticamente reporta errores con:
{
  type: 'network',
  severity: 'medium' | 'high',
  context: {
    url: '/api/users',
    method: 'POST',
    status: 500,
    userMessage: 'Error del servidor'
  }
}
```

## 🛡 Seguridad

- **Tokens seguros**: Almacenamiento en AsyncStorage (existente)
- **HTTPS only**: Configuración de base URL segura
- **No logging en producción**: Información sensible solo en desarrollo
- **Timeout configurado**: Evita requests colgados

---

**¿Preguntas?** Este sistema está diseñado para ser extensible y maintenerlo fácil. Cada parte está documentada y tipada para facilitar el desarrollo futuro.
