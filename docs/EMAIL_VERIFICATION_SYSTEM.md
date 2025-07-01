# Sistema de Verificación de Email - Petopia

## Descripción General

El sistema de verificación de email permite a los usuarios verificar su dirección de correo electrónico después del registro, utilizando deep links seguros enviados por el backend de Laravel.

## Componentes del Sistema

### 1. Deep Link Configuration

- **Esquema**: `petopia://`
- **Ruta**: `auth/verify-email`
- **Parámetros**: `id`, `hash`, `expires`, `signature`

### 2. Archivos Principales

#### `app/(auth)/verify-email.tsx`

- **Descripción**: Pantalla principal de verificación de email
- **Funcionalidad**:
  - Procesa automáticamente los parámetros del deep link
  - Maneja 3 estados: carga, éxito y error
  - Interfaz visual intuitiva con iconos e indicadores de estado
  - Opciones de navegación según el resultado

#### `lib/hooks/useEmailVerification.ts`

- **Descripción**: Hook personalizado para manejar la lógica de verificación
- **Funcionalidad**:
  - Validación de parámetros requeridos
  - Llamada al API de Laravel
  - Manejo de errores específicos
  - Estados reactivos para la UI

#### `lib/hooks/useDeepLink.ts`

- **Descripción**: Hook para manejo global de deep links
- **Funcionalidad**:
  - Filtro para solo procesar URLs `petopia://`
  - Navegación automática a las pantallas correspondientes
  - Prevención de conflictos con navegación normal

## Flujo de Verificación

### 1. Registro de Usuario

```
Usuario se registra → Backend envía email → Email contiene deep link
```

### 2. Deep Link Format

```
petopia://auth/verify-email?id=20&hash=abc123&expires=1751443254&signature=def456
```

### 3. Procesamiento en la App

```
Deep link → useDeepLink → navigate to verify-email → useEmailVerification → API call
```

### 4. Estados de la UI

#### Estado de Carga

- Icono de email animado
- Indicador de actividad
- Texto: "Verificando tu correo electrónico..."

#### Estado de Éxito

- Icono de checkmark verde
- Mensaje de confirmación
- Botón "Ir a Iniciar Sesión"

#### Estado de Error

- Icono de error rojo
- Mensaje de error específico
- Opciones: "Reenviar correo" y "Volver al inicio"

## Configuración del API

### Endpoint de Verificación

```typescript
GET /email/verify/{id}/{hash}?expires={timestamp}&signature={signature}
```

### Respuesta Exitosa

```json
{
  "message": "Email verificado con éxito"
}
```

### Respuesta de Error

```json
{
  "message": "El enlace de verificación no es válido o ha expirado",
  "errors": {}
}
```

## Internacionalización

### Claves de Traducción (verify_email)

- `loading_title`: Título durante la verificación
- `loading_message`: Mensaje durante la verificación
- `success_title`: Título de éxito
- `success_message`: Mensaje de éxito
- `error_title`: Título de error
- `error_message`: Mensaje de error
- `go_to_login`: Texto del botón para ir al login
- `resend_email`: Texto del botón para reenviar email
- `back_to_home`: Texto del botón para volver al inicio

## Testing y Desarrollo

### Componente de Prueba

- `components/test/DeepLinkTester.tsx`: Componente para testing durante desarrollo
- **IMPORTANTE**: Debe ser removido en producción

### URLs de Prueba

```typescript
// Verificación de email
petopia://auth/verify-email?id=20&hash=abc123&expires=1751443254&signature=def456

// Reseteo de contraseña
petopia://auth/reset-password?token=abc123&email=user@example.com
```

## Manejo de Errores

### Errores Comunes

1. **Parámetros faltantes**: Link incompleto o malformado
2. **Token expirado**: El enlace ha excedido su tiempo de vida
3. **Firma inválida**: El enlace ha sido modificado o es fraudulento
4. **Error de red**: Problemas de conectividad
5. **Error del servidor**: Problemas en el backend

### Mensajes de Error

- Todos los errores se muestran de forma amigable al usuario
- Se incluye el mensaje específico del backend cuando está disponible
- Opciones de recuperación (reenviar email, volver al inicio)

## Consideraciones de Seguridad

### Validación de Parámetros

- Todos los parámetros son validados antes del procesamiento
- Links incompletos son rechazados inmediatamente

### Filtrado de URLs

- Solo se procesan URLs con esquema `petopia://`
- Se previenen ataques de deep link maliciosos

### Timeout y Reintentos

- Las llamadas al API tienen timeout configurado
- No se implementan reintentos automáticos por seguridad

## Próximos Pasos

1. **Implementar reenvío de email**: Funcionalidad para reenviar email de verificación
2. **Añadir analytics**: Tracking de eventos de verificación
3. **Optimizar UX**: Animaciones y transiciones mejoradas
4. **Testing automatizado**: Tests unitarios y de integración

## Notas Técnicas

- Compatible con iOS y Android
- Utiliza Expo Router para navegación
- Implementa interceptores de HTTP para manejo de errores
- Soporta modo oscuro y claro
- Totalmente internacionalizado (español/inglés)
