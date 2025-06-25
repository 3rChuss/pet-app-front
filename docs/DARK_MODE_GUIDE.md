# 🌙 Guía de Dark Mode

## Configuración Completada

### ✅ Funcionalidades Implementadas

1. **Detección automática** del tema del sistema
2. **Control manual** de tema (claro/oscuro/automático)
3. **Persistencia** de preferencias en AsyncStorage
4. **Transiciones suaves** entre temas
5. **Hooks personalizados** para estilos dinámicos
6. **StatusBar adaptativa** según el tema
7. **React Navigation** integrado con tema

### 🎨 Cómo Usar

#### 1. Hooks Disponibles

```typescript
// Obtener tema activo
const activeTheme = useActiveTheme() // 'light' | 'dark'

// Verificar si está en modo oscuro
const isDark = useIsDarkMode() // boolean

// Control completo del tema
const { themeMode, setThemeMode, toggleTheme } = useTheme()

// Estilos dinámicos
const styles = useThemeStyles()
const colors = useThemeColors()

// Clases dinámicas
const bgClass = useThemeClass('bg-white', 'bg-gray-900')
```

#### 2. Componentes con Tema

```typescript
// Contenedor con tema automático
<ThemeContainer
  lightClass="bg-white"
  darkClass="bg-gray-900"
>
  <Text className={styles.text.primary}>
    Texto que cambia con el tema
  </Text>
</ThemeContainer>

// Input con tema
<TextInput
  className={styles.backgrounds.input}
  placeholderTextColor={colors.secondary}
/>
```

#### 3. Clases CSS Predefinidas

```typescript
// Usar clases de utilidad directamente
<View className="theme-background">
  <Text className="theme-text">Título</Text>
  <Text className="theme-text-secondary">Subtítulo</Text>
</View>
```

### 🔧 Agregar Soporte a Nuevos Componentes

#### 1. Usar hooks existentes:

```typescript
function MyComponent() {
  const styles = useThemeStyles()

  return (
    <View className={styles.backgrounds.card}>
      <Text className={styles.text.primary}>Contenido</Text>
    </View>
  )
}
```

#### 2. Usar clases de Tailwind directas:

```typescript
<View className="bg-white dark:bg-gray-900">
  <Text className="text-black dark:text-white">
    Texto adaptativo
  </Text>
</View>
```

#### 3. Para estilos complejos:

```typescript
const isDark = useIsDarkMode()
const dynamicStyle = {
  backgroundColor: isDark ? '#1f2937' : '#ffffff',
  shadowColor: isDark ? 'transparent' : '#000000',
}
```

### 📱 Configuración en Settings

La sección de tema está integrada en `/settings` con opciones:

- ☀️ **Claro**: Tema claro permanente
- 🌙 **Oscuro**: Tema oscuro permanente
- 📱 **Automático**: Sigue configuración del sistema

### 🎯 Mejores Prácticas

1. **Usar hooks**: Prefiere `useThemeStyles()` sobre clases manuales
2. **Colores consistentes**: Usa la paleta definida en `colors.js`
3. **Transiciones**: Agrega `dark-mode-transition` para suavidad
4. **Testing**: Prueba ambos temas durante desarrollo
5. **Accesibilidad**: Mantén contraste adecuado en ambos modos

### 🔮 Funcionalidades Futuras

- [ ] Temas personalizados por usuario
- [ ] Scheduled theme switching
- [ ] Theme-aware splash screen
- [ ] Dynamic color generation
- [ ] Theme analytics

## Estructura de Archivos

```
lib/
├── context/
│   └── ThemeContext.tsx      # Provider principal
├── hooks/
│   └── useThemeStyles.ts     # Hooks de estilos
components/
├── theme/
│   └── ThemeContainer.tsx    # Contenedor temático
└── Settings/
    └── ThemeSection.tsx      # Configuración de tema
theme/
├── colors.js                 # Paleta de colores
└── dark-colors.js           # Colores específicos dark
```

¡El sistema está listo para ser usado en toda la aplicación! 🚀
