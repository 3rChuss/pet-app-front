# Sistema de Configuración Modular

Este sistema implementa una pantalla de configuración moderna y modular al estilo de Instagram, con secciones organizadas y componentes reutilizables.

## 🚀 Características Principales

### 1. **Arquitectura Modular**

- Componentes independientes por sección
- Hook personalizado para lógica de configuración
- Animaciones fluidas con Reanimated 2
- Código limpio y mantenible

### 2. **Secciones Organizadas**

- **Cuenta**: Cerrar sesión con confirmación
- **Aplicación**: Permisos y notificaciones
- **Centro de información**: Ayuda, privacidad e información de la app

### 3. **Experiencia de Usuario**

- Animaciones de presión en elementos
- Feedback visual claro
- Modales informativos para funciones futuras
- Integración con el sistema de notificaciones

## 📁 Estructura de Archivos

```
/components/Settings/
├── index.ts                 # Exportaciones centralizadas
├── SettingsItem.tsx         # Componente base para elementos
├── AccountSection.tsx       # Sección de cuenta
├── AppSection.tsx          # Sección de aplicación
└── InfoSection.tsx         # Sección de información

/app/
└── settings.tsx            # Pantalla principal de configuración

/lib/hooks/
└── useSettingsActions.tsx  # Hook para lógica de configuración
```

## 🎨 Diseño y Estilos

### Paleta de Colores (según guía de estilo)

- **Cuenta**: `#F47C7C` (accent_coral) - Para acciones destructivas
- **Permisos**: `#C8E6C9` (secondary_green) - Para seguridad
- **Notificaciones**: `#FFDA63` (accent_yellow) - Para alertas
- **Ayuda**: `#A0D2DB` (primary) - Para información
- **Privacidad**: `#F8B595` (secondary_coral) - Para legal
- **Info**: `#BDBDBD` (neutral_medium_gray) - Para metadatos

### Características Visuales

- Elementos con fondo blanco sobre gris neutro
- Iconos en círculos de color con transparencia
- Animaciones de escala suave al presionar
- Chevrons para indicar navegación
- Tipografía consistente (Nunito/Quicksand)

## 🔧 Uso del Sistema

### Navegación desde Perfil

```tsx
// En profile.tsx
<Pressable onPress={() => router.push('/settings')}>
  <Ionicons name="list-outline" size={26} color="#0077BE" />
</Pressable>
```

### Componente SettingsItem

```tsx
<SettingsItem
  title="Título del elemento"
  subtitle="Descripción opcional"
  icon="nombre-del-icono"
  iconColor="#color-hex"
  onPress={handleFunction}
  showChevron={true}
  destructive={false}
/>
```

### Hook useSettingsActions

```tsx
const { handlePermissions, handleNotifications, handleHelp, handlePrivacy, handleAppInfo } =
  useSettingsActions()
```

## 🔄 Flujos de Usuario

### 1. **Cerrar Sesión**

1. Usuario toca "Cerrar sesión"
2. Se muestra modal de confirmación
3. Si confirma: se ejecuta `signOut()` y redirecciona a login
4. Si cancela: se cierra el modal

### 2. **Configuración de Permisos/Notificaciones**

1. Usuario toca el elemento
2. Se muestra modal informativo
3. Feedback de "función en desarrollo"

### 3. **Información/Ayuda**

1. Usuario toca el elemento
2. Se muestra modal con información relevante
3. Para privacidad: opción de abrir en navegador

## 🛠️ Integración con Sistema de Notificaciones

El sistema utiliza el `NotificationProvider` para:

- Modales de confirmación (cerrar sesión)
- Modales informativos (funciones en desarrollo)
- Alerts nativos (abrir enlaces externos)

### Ejemplo de Modal de Confirmación

```tsx
showErrorModal('Cerrar sesión', '¿Estás seguro de que quieres cerrar sesión?', 'medium', {
  actionText: 'Cerrar sesión',
  cancelText: 'Cancelar',
  onAction: async () => {
    await signOut()
    router.replace('/(auth)/login')
  },
})
```

## 📱 Animaciones y Feedback

### Animaciones de SettingsItem

- **Escala**: 1.0 → 0.98 al presionar
- **Opacidad**: 1.0 → 0.8 al presionar
- **Duración**: 100ms para opacidad, spring para escala
- **Easing**: Spring con damping 15, stiffness 300

### Estados Visuales

- **Normal**: Fondo blanco, texto gris oscuro
- **Pressed**: Escala reducida, opacidad reducida
- **Destructive**: Texto rojo coral

## 🔮 Extensibilidad

### Agregar Nueva Sección

1. Crear componente `NewSection.tsx`
2. Exportar en `index.ts`
3. Importar y usar en `settings.tsx`
4. Añadir acciones en `useSettingsActions.tsx`

### Agregar Nuevo Elemento

```tsx
<SettingsItem
  title="Nueva Función"
  subtitle="Descripción de la función"
  icon="nuevo-icono"
  iconColor="#nuevo-color"
  onPress={handleNewFunction}
/>
```

### Personalizar Colores

Todos los colores siguen la guía de estilo del proyecto y están definidos en el archivo de temas.

## 🧪 Testing y Debug

### Modo Desarrollo

- Logs en consola para acciones de configuración
- Feedback visual inmediato
- Integración con sistema de reportes de error

### Accesibilidad

- Áreas táctiles adecuadas (44pt mínimo)
- Contraste de colores apropiado
- Textos descriptivos claros
- Soporte para lectores de pantalla

---

Este sistema proporciona una base sólida y extensible para la configuración de la aplicación, manteniendo consistencia visual y funcional con el resto de la app.
