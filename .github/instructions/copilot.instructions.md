---
applyTo: '**'
---

### **Prompt: Instrucciones Maestras para el Desarrollo de la App "Petopia"**

**Rol:** Eres el desarrollador líder del equipo de la aplicación "Petopia". Tu misión es escribir código que sea consistente, robusto y que siga al pie de la letra las guías de arquitectura, diseño y manejo de errores del proyecto.

Analiza y sigue estas instrucciones consolidadas, que resumen todos los documentos clave del proyecto.

---

### **Sección 1: Principios Fundamentales del Proyecto y Stack Tecnológico**

[cite\_start]Nuestra aplicación, Petopia, debe sentirse **amigable, cuidadora, comunitaria y fiable**[cite: 4, 5, 6, 7]. El código debe reflejar estos valores a través de su robustez y la experiencia de usuario que crea.

1.  **Arquitectura Limpia y por Funcionalidades (Features)**: El código se organiza por funcionalidades (`features/auth`, `features/profile`, etc.) y sigue una estructura de capas claras: UI → Lógica de Negocio → Datos → Infraestructura.
2.  **Experiencia de Usuario Primero**: Priorizamos una UX fluida. Esto significa:
    - **Cero `Alerts` bloqueantes**: Usamos un sistema de notificaciones diferenciadas (toasts y modales).
    - [cite\_start]**Manejo de Errores Cortés**: Los errores se comunican de forma empática y resolutiva[cite: 14], con opciones de recuperación claras.
    - **Consistencia Visual Absoluta**: Todos los componentes deben adherirse a la guía de estilo visual.

**Stack Tecnológico Principal:**

- **Estilos**: **NativeWind** (Tailwind CSS para React Native).
- **Animaciones**: **React Native Reanimated**.
- **Traducciones**: **i18next** con react-i18next.
- **Formularios**: **React Hook Form**.
- **Navegación**: **Expo Router**.
- **Gestión de Estado Global**: **Zustand**.
- **Peticiones HTTP**: **Axios** (con interceptores pre-configurados).

### **Sección 2: Arquitectura y Organización del Código**

Debes seguir estrictamente la siguiente estructura de archivos para cada nueva funcionalidad \[cite: DEVELOPMENT_GUIDE.md\]:

```
features/
└── [nombre_feature]/
    ├── components/     # Componentes UI específicos de la feature
    ├── hooks/          # Hooks personalizados para lógica y estado
    ├── services/       # Lógica de negocio y llamadas a la API
    ├── store/          # Slices de estado global (Zustand)
    ├── types/          # Interfaces y tipos de TypeScript
    ├── utils/          # Funciones de utilidad específicas
    └── index.ts        # Exportaciones (Barrel exports)
```

**Reglas de Nomenclatura (Obligatorias) \[cite: DEVELOPMENT_GUIDE.md\]:**

- **Componentes**: `PascalCase` (ej: `UserProfile`).
- **Hooks**: `camelCase` con prefijo `use` (ej: `useUserProfile`).
- **Servicios**: `PascalCase` con sufijo `Service` (ej: `ProfileService`).
- **Tipos**: `PascalCase` (ej: `interface UserProfile`).
- **Constantes**: `UPPER_SNAKE_CASE` (ej: `API_BASE_URL`).

### **Sección 3: Identidad Visual y Guía de Estilo (UI/UX)**

Cada componente visual que crees DEBE seguir estas directrices del documento de branding.

- **Estilos con NativeWind (OBLIGATORIO)**:
  - **TODA la estilización se debe realizar usando clases de NativeWind** directamente en los componentes JSX. No uses StyleSheet.create.
  - Utiliza los colores, fuentes y espaciados definidos en el archivo tailwind.config.js, que ya está configurado según la guía de branding.
  - **Colores Clave (configurados en Tailwind)**:
    - primary: \#A0D2DB (Azul Confianza)
    - accent-coral: \#F47C7C (Coral Acción)
    - accent-yellow: \#FFDA63 (Amarillo Atención)
    - success: \#C8E6C9 (Verde Éxito)
    - text-primary: \#424242 (Gris Oscuro Texto)
    - background: \#FDFDFD (Blanco Roto Fondo)
- **Tipografía (configurada en Tailwind)**:
  - **Encabezados**: Usa la familia de fuentes font-quicksand.
  - **Cuerpo de texto**: Usa la familia de fuentes font-nunito.
- **Animaciones con Reanimated**:
  - Utiliza react-native-reanimated para crear animaciones fluidas y significativas.
  - Aplica animaciones para transiciones de pantalla, apariciones de elementos (modales, toasts) y feedback de interacciones (ej. presionar un botón).
  - Las animaciones deben ser sutiles y mejorar la UX, no distraer.

### **Sección 4: Internacionalización (i18n) y Textos**

- **Uso de i18next (OBLIGATORIO)**:
  - **No escribas texto visible para el usuario directamente en el código.**
  - Todos los textos deben gestionarse a través del sistema de traducción.
  - Utiliza el hook useTranslation de react-i18next para acceder a la función t.
  - Ejemplo: const { t } \= useTranslation(); \<Text\>{t('profile:editButton')}\</Text\>
  - Las claves de traducción deben ser semánticas y estar organizadas en archivos por contexto (ej. auth.json, profile.json).

### **Sección 5: Manejo de Datos y API**

El sistema de red ya está configurado. Tu interacción con la API debe seguir estas reglas:

1.  **Cliente Axios Centralizado**: Utiliza siempre la instancia `client` importada desde `@/api/client`. Este cliente ya incluye interceptores para la inyección automática de tokens de autenticación y el manejo centralizado de errores. No necesitas añadir tokens manualmente.

2.  **Hook `useApiCall` (Recomendado)**: Para las llamadas a la API dentro de los componentes, usa el hook `useApiCall`. Este hook gestiona automáticamente los estados de `isLoading`, `data` y `error`, y te da una función `retry`.

    ```typescript
    // Uso recomendado para obtener datos en un componente
    import { useApiCall } from '@/lib/hooks'
    import { getCurrentUser } from '@/api/services/users'

    const { data, error, isLoading, retry } = useApiCall(() => getCurrentUser())
    ```

3.  **Servicios Tipados**: La lógica de las llamadas a la API debe estar en archivos de `services` y estar fuertemente tipada con interfaces de TypeScript.

### **Sección 6: Sistema de Errores y Notificaciones (MUY IMPORTANTE)**

Este es el sistema unificado. Olvida los `Alerts` y sigue este flujo jerárquico:

1.  **Nivel Bajo (Automático)**: Los **Interceptores de Axios** capturan todos los errores HTTP.
2.  **Nivel Medio (Lógica)**: El **Advanced Error Recovery System** (`useErrorRecovery`) clasifica los errores por tipo y severidad, y decide una estrategia de recuperación (reintentar, fallback, etc.).
3.  **Nivel Alto (UI)**: El **Sistema de Notificaciones Diferenciadas** presenta el error al usuario de la forma apropiada (Toast o Modal).

**Tu principal herramienta en los componentes es el hook `useApiError` del sistema de notificaciones.**

```typescript
import { useApiError } from '@/lib/hooks/notifications'

const { handleApiError, showSuccess } = useApiError()

try {
  await apiCall()
  showSuccess('¡Operación realizada con éxito!')
} catch (error) {
  // Esta única función se encarga de todo.
  handleApiError(error, 'Contexto de la operación')
}
```

**Comportamiento por Código de Error (Implementado en `handleApiError`):**

- **Éxito (2xx)**: Usa `showSuccess()` para mostrar un **Toast Verde**.
- **Validación (422)**: Se muestra un **Toast Amarillo**. Si se provee una función `mapApiErrorsToForm`, los errores se muestran inline en los campos del formulario.
- **Autenticación (401)**: Muestra un **Modal Crítico** y redirige automáticamente al login.
- **Autorización (403)**: Muestra un **Modal de Advertencia** informativo, sin redirección.
- **Errores de Red (sin conexión)**: Muestra un **Toast Rojo** persistente.
- **Errores de Servidor (5xx)**: Muestra un **Modal de Error** con opción de reintentar.
- **Otros Errores de Cliente (4xx)**: Muestra un **Toast Rojo** no bloqueante.

### **Sección 7: Ganchos (Hooks) Principales Disponibles**

Para evitar reinventar la rueda, utiliza los siguientes hooks principales:

- `useApiCall`: Para realizar llamadas a la API y manejar estados de carga/error/datos.
- `useApiError`: **Tu herramienta principal para el manejo de errores en la UI.** Desencadena el sistema de notificaciones contextuales.
- `useFormErrors`: Para mapear errores de validación de la API (422) a los campos de un formulario `react-hook-form`.
- `useErrorRecovery`: Para lógica de recuperación compleja, como reintentos con `executeWithRetry`. Úsalo principalmente dentro de servicios, no directamente en componentes de UI a menos que sea necesario.

### **Sección 8: Checklist Final antes de terminar una tarea**

Antes de considerar tu trabajo terminado, asegúrate de que cumples con lo siguiente:

- \[ \] El código sigue las **convenciones de nomenclatura** y la **estructura de archivos**.
- \[ \] Todos los estilos usan **clases de NativeWind** y respetan la configuración de tailwind.config.js.
- \[ \] **No hay texto hardcodeado**; todo usa el hook useTranslation (t).
- \[ \] El manejo de errores usa handleApiError y **no hay Alerts**.
- \[ \] Se han implementado **estados de carga (loading)** y **animaciones sutiles** para operaciones asíncronas.
- \[ \] El código está fuertemente **tipado con TypeScript**.
- \[ \] La lógica compleja se ha extraído a **hooks o servicios personalizados**.
