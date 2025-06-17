# 🚀 Guía de Desarrollo - React Native Project

## Principios de Arquitectura

### 1. **Feature-Based Architecture**

```
features/
├── auth/           # Autenticación
├── profile/        # Perfil de usuario
├── feed/           # Feed de posts
├── notifications/  # Notificaciones
└── settings/       # Configuración
```

**Beneficios:**

- ✅ Código organizado por funcionalidad
- ✅ Fácil de mantener y escalar
- ✅ Equipos pueden trabajar en paralelo
- ✅ Testing aislado por feature

### 2. **Clean Architecture Layers**

```
app/ (UI Layer)
    ↓
features/ (Business Logic)
    ↓
services/ (Data Layer)
    ↓
api/ (Infrastructure)
```

### 3. **State Management Strategy**

#### **Estado Local**: `useState`, `useReducer`

- ✅ Usar para: Estado de UI, formularios, toggles
- ❌ No usar para: Datos compartidos, datos del servidor

#### **Estado Global**: `Zustand`

- ✅ Usar para: Datos del usuario, configuración, cache
- ✅ Dividir en slices por feature
- ✅ Optimizar con selectores

#### **Estado del Servidor**: `React Query` (Futuro)

- ✅ Usar para: Cache de API, sincronización, offline
- ✅ Invalida cache automáticamente

## Patrones de Desarrollo

### Hooks Personalizados + Servicios Separados

✅ USAR CUANDO:

La lógica es compleja (más de 30 líneas)
Se reutiliza en múltiples pantallas
Maneja estado local + API calls
Incluye lógica de negocio

❌ NO USAR CUANDO:

Lógica simple (toggle, navegación)
Específico de una sola pantalla
Solo manejo de UI state

### 1. **Hook Pattern**

```typescript
// ✅ CORRECTO: Hook con responsabilidad única
export function useUserProfile() {
  // Lógica específica del perfil
}

// ❌ INCORRECTO: Hook que hace todo
export function useEverything() {
  // Lógica mezclada
}
```

### 2. **Service Pattern**

```typescript
// ✅ CORRECTO: Servicio con métodos específicos
export class ProfileService {
  static async getCurrentProfile(): Promise<UserProfile> {}
  static async updateProfile(data): Promise<UserProfile> {}
}
```

### 3. **Error Handling Pattern**

```typescript
// ✅ CORRECTO: Manejo centralizado
const { handleApiError } = useApiError()
try {
  await fetchData()
} catch (error) {
  handleApiError(error, 'Context info')
}
```

## Reglas de Código

### 1. **Naming Conventions**

```typescript
// Components: PascalCase
export function UserProfile() {}

// Hooks: camelCase with 'use' prefix
export function useUserProfile() {}

// Services: PascalCase with 'Service' suffix
export class ProfileService {}

// Types: PascalCase
export interface UserProfile {}

// Constants: UPPER_SNAKE_CASE
export const API_BASE_URL = 'https://api.example.com'
```

### 2. **File Organization**

```
feature/
├── components/     # UI específico del feature
├── hooks/         # Lógica de estado y efectos
├── services/      # Lógica de negocio
├── store/         # Estado global
├── types/         # TypeScript interfaces
├── utils/         # Utilidades específicas
└── index.ts       # Barrel exports
```

### 3. **Import/Export Rules**

```typescript
// ✅ CORRECTO: Imports agrupados
import { useState, useEffect } from 'react'
import { View, Text } from 'react-native'

import { UserProfile } from '@/features/profile'
import { apiClient } from '@/api/client'

// ✅ CORRECTO: Barrel exports
export * from './hooks/useUserProfile'
export * from './services/ProfileService'
```

## Performance Best Practices

### 1. **Component Optimization**

```typescript
// ✅ CORRECTO: Memo con comparación específica
export const PostItem = memo(
  ({ post }) => {
    // Component logic
  },
  (prevProps, nextProps) => {
    return prevProps.post.id === nextProps.post.id
  }
)

// ✅ CORRECTO: Callback optimization
const handleLike = useCallback(
  (postId: string) => {
    likePost(postId)
  },
  [likePost]
)
```

### 2. **State Selectors**

```typescript
// ✅ CORRECTO: Selectores específicos
const userName = useProfileStore(state => state.profile?.userName)

// ❌ INCORRECTO: Selector amplio
const profile = useProfileStore(state => state.profile)
```

### 3. **List Optimization**

```typescript
// ✅ CORRECTO: FlatList optimizado
<FlatList
  data={posts}
  renderItem={({ item }) => <PostItem post={item} />}
  keyExtractor={item => item.id}
  getItemLayout={(data, index) => ({
    length: ITEM_HEIGHT,
    offset: ITEM_HEIGHT * index,
    index,
  })}
  removeClippedSubviews
  maxToRenderPerBatch={10}
/>
```

## Escalabilidad

### 1. **Agregar Nueva Feature**

1. Crear carpeta en `features/`
2. Definir types e interfaces
3. Crear servicios para API
4. Implementar store con Zustand
5. Crear hooks personalizados
6. Desarrollar componentes UI
7. Agregar tests
8. Documentar

### 2. **API Integration Checklist**

- [ ] Definir interfaces TypeScript
- [ ] Crear servicio con métodos específicos
- [ ] Implementar manejo de errores
- [ ] Agregar loading states
- [ ] Implementar optimistic updates
- [ ] Testear con datos mock
- [ ] Documentar endpoints

### 3. **Testing Strategy**

```typescript
// Unit Tests: Jest + Testing Library
describe('useUserProfile', () => {
  it('should fetch profile on mount', () => {
    // Test hook behavior
  })
})

// Integration Tests: Detox
describe('Profile Screen', () => {
  it('should display user information', () => {
    // Test full user flow
  })
})
```

## Code Review Checklist

### ✅ **Antes de hacer PR**

- [ ] Código sigue naming conventions
- [ ] Imports organizados correctamente
- [ ] Manejo de errores implementado
- [ ] Loading states manejados
- [ ] TypeScript sin errores
- [ ] Componentes optimizados
- [ ] Tests agregados/actualizados

### ✅ **Durante Code Review**

- [ ] Lógica está en el lugar correcto
- [ ] No hay duplicación de código
- [ ] Performance considerado
- [ ] Accesibilidad implementada
- [ ] Documentación actualizada

## Herramientas de Desarrollo

### 1. **VS Code Extensions**

- ES7+ React/Redux/React-Native snippets
- TypeScript Importer
- Auto Rename Tag
- Prettier - Code formatter
- ESLint

### 2. **Debugging**

```typescript
// Development logging
if (__DEV__) {
  console.log('🔍 Debug info:', data)
}

// Flipper integration
import { logger } from 'flipper'
logger.log('User action', { userId, action })
```

### 3. **Build & Deploy**

```bash
# Development
npm run start

# Production build
npm run build:ios
npm run build:android

# Testing
npm run test
npm run test:e2e
```

Esta guía debe evolucionar con el proyecto y el equipo. ¡Mantener actualizada!
