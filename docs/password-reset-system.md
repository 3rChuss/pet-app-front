# Funcionalidad de Restablecimiento de Contraseña - Petopia

## 📋 Descripción General

Este sistema permite a los usuarios restablecer su contraseña a través de un enlace enviado por correo electrónico. La implementación incluye deep linking para una experiencia de usuario fluida.

## 🔧 Componentes Implementados

### 1. Pantalla de Restablecimiento (`reset-password.tsx`)

- **Ubicación**: `app/(auth)/reset-password.tsx`
- **Funcionalidad**:
  - Recibe parámetros `token` y `email` desde la URL
  - Validación de formulario con Zod
  - Interfaz bilingüe (español/inglés)
  - Manejo de estados de carga y error
  - Navegación automática después del éxito

### 2. Servicio de API (`auth.ts`)

- **Ubicación**: `features/auth/services/auth.ts`
- **Función actualizada**: `resetPassword()`
- **Parámetros requeridos**:
  ```typescript
  {
    email: string
    token: string
    password: string
    password_confirmation: string
  }
  ```

### 3. Hook de Deep Linking (`useDeepLink.ts`)

- **Ubicación**: `lib/hooks/useDeepLink.ts`
- **Funcionalidades**:
  - Manejo automático de URLs entrantes
  - Parsing de parámetros de consulta
  - Navegación automática a pantallas correspondientes
  - Logging para debugging

### 4. Traducciones

- **Archivos actualizados**:
  - `services/i18n/locales/en-US.json`
  - `services/i18n/locales/es-ES.json`
- **Nuevas claves añadidas**: `reset_password.*`

## 🚀 Flujo de Usuario

### Paso 1: Solicitud de Restablecimiento

1. Usuario va a "Forgot Password"
2. Introduce su email
3. El backend envía un correo con el enlace de restablecimiento

### Paso 2: Apertura del Enlace

El usuario recibe un correo con un enlace como:

```
petopia://auth/reset-password?token=ABC123&email=user%40example.com
```

### Paso 3: Procesamiento del Deep Link

1. La aplicación intercepta el deep link
2. `useDeepLink` parsea los parámetros
3. Navega automáticamente a `/(auth)/reset-password`

### Paso 4: Restablecimiento

1. El usuario ve su email (no editable)
2. Introduce su nueva contraseña
3. Confirma la contraseña
4. Envía el formulario al backend
5. Recibe confirmación y navega al login

## 🛠️ Configuración Técnica

### Deep Linking

- **Esquema configurado**: `petopia://`
- **Configuración**: `app.json` → `expo.scheme`
- **Plataformas soportadas**: iOS y Android

### Dependencias

- `expo-linking`: Para manejo de deep links
- `expo-router`: Para navegación basada en archivos
- `react-hook-form`: Para validación de formularios
- `zod`: Para schemas de validación
- `react-i18next`: Para internacionalización

## 🧪 Testing durante Desarrollo

### Componente de Prueba

Incluye `DeepLinkTester` en cualquier pantalla para probar:

```tsx
import DeepLinkTester from '@/components/test/DeepLinkTester'

// En tu componente:
;<DeepLinkTester />
```

### URLs de Prueba

```bash
# Reset Password
petopia://auth/reset-password?token=test123&email=test%40example.com

# Email Verification
petopia://auth/verify-email?id=123&hash=abc&signature=def
```

### Testing Manual

1. Usa el simulador de iOS o emulador de Android
2. Abre una terminal y ejecuta:

   ```bash
   # iOS Simulator
   xcrun simctl openurl booted "petopia://auth/reset-password?token=test123&email=test%40example.com"

   # Android Emulator
   adb shell am start -W -a android.intent.action.VIEW -d "petopia://auth/reset-password?token=test123&email=test%40example.com"
   ```

## 🔒 Seguridad

### Validaciones Implementadas

- ✅ Verificación de parámetros requeridos (token, email)
- ✅ Validación de formato de contraseña
- ✅ Confirmación de contraseña
- ✅ Manejo de tokens expirados
- ✅ Sanitización de entrada

### Consideraciones de Seguridad

- Los tokens deben ser únicos y expirar después de un tiempo determinado
- El email debe estar codificado en URL para caracteres especiales
- La validación del token ocurre en el backend

## 🐛 Troubleshooting

### Problemas Comunes

#### Deep Link no funciona

1. Verificar que el esquema esté configurado en `app.json`
2. Rebuild de la aplicación después de cambios en `app.json`
3. Verificar que la URL esté bien formada

#### Error "Missing parameters"

- Verificar que la URL contenga `token` y `email`
- Verificar que el email esté codificado en URL

#### Navegación no funciona

- Verificar que la ruta existe en la estructura de archivos
- Revisar la consola para errores de navegación

### Logs de Debug

El sistema incluye logging extensivo. Activar la consola para ver:

- URLs recibidas
- Parámetros parseados
- Errores de navegación
- Respuestas de API

## 📱 Estructura de Archivos

```
app/
├── (auth)/
│   ├── reset-password.tsx      # Nueva pantalla
│   ├── forgot-password.tsx     # Pantalla existente
│   └── ...
├── _layout.tsx                 # Layout principal (modificado)
└── ...

lib/
├── hooks/
│   └── useDeepLink.ts          # Hook personalizado
└── ...

features/auth/services/
└── auth.ts                     # Servicio actualizado

services/i18n/locales/
├── en-US.json                  # Traducciones inglés
└── es-ES.json                  # Traducciones español

components/test/
└── DeepLinkTester.tsx          # Componente de prueba
```

## 🚀 Próximos Pasos

1. **Testing Completo**: Probar en dispositivos reales
2. **Optimización**: Mejorar manejo de errores
3. **Analytics**: Agregar tracking de eventos
4. **Biometría**: Considerar autenticación biométrica opcional
5. **Cleanup**: Remover componentes de testing en producción

## 📖 Referencias

- [Expo Linking Documentation](https://docs.expo.dev/versions/latest/sdk/linking/)
- [Expo Router Deep Linking](https://expo.github.io/router/docs/guides/deep-linking)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
