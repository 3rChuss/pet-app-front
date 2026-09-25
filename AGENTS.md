# AGENTS.md

This file contains guidelines and commands for agentic coding agents working on this React Native/Expo mobile application (Zooky App).

## Project Overview

Zooky App is the **frontend** of the Zooky ecosystem (pet world app). It is an Expo (React Native) mobile application consuming the Laravel "Zooky API" REST backend:

- Expo 57 / React Native 0.86 / React 19, `expo-router` v5 (file-based navigation)
- Styling via NativeWind (TailwindCSS 3.4) with theme colors from `theme/colors.js` (`ACTIVE_THEME` env var, default `base`)
- State management with Zustand (`createSelectors` pattern) + MMKV storage (`lib/storage.tsx`)
- Forms with `react-hook-form` + `@hookform/resolvers`
- i18n via `i18next` / `react-i18next` (locales in `services/i18n/locales/`, `en-US` / `es-ES`)
- HTTP via Axios client (`api/client.ts`) with auth token injection, snake_case keys on request, camelCase on response
- Auth tokens in `expo-secure-store`, guest browsing mode, onboarding flow, notifications

## Project Documentation

The **Outline** instance at https://outline.aegued.es is the single source of truth for technical and business documentation of this project (architecture, business rules, integrations, authentication, database design, product/UI).

**Scope — ONLY collection**: the agent may access ONLY the **Zooky** collection (id `4581af43-1d49-4293-ab3c-1b677f383838`).
- Prohibited: listing, searching, reading, or referencing any OTHER collection.
- Never call `list_collections`.
- Always pass the Zooky `collectionId` when using `list_documents` / `list_collection_documents`, and resolve document ids through that collection.
- Access happens through the `outline` MCP server.

Before implementing changes that affect architecture, business rules, integrations, authentication, UI/UX, or product behaviour:

1. **Search** the Outline documentation (Zooky collection).
2. **Read** the relevant documents.
3. **Follow** the documented business rules.
4. If the documentation **conflicts** with the existing code, **investigate before making changes** (do not silently override documented rules).

### Assigned document — App (Zooky › App)

The root document **App** (`f6a3c3a1-f39b-4b4d-a3a0-470e9723e1ed`) is the assigned documentation reference for this frontend. Its children cover every product/UI area:

- **Análisis de Flujo de Usuario** — onboarding, authentication and state flows
- **Wireframes de Baja Fidelidad** — structure of all MVP screens
- **Guía de Branding y Estilo Visual** — identity, colors, typography and UI
- **Roadmap de Desarrollo** — MVP plan in phases

> Complementary docs live in `docs/` (API_INTERCEPTORS.md, NotificationSystem.md, Advanced Error Recovery System.md).

## Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Expo (React Native) | 57.0.25 |
| React | React | 19.2.3 |
| React Native | react-native | 0.86.3 |
| Navigation | expo-router | 57.0.23 |
| Styling | NativeWind / TailwindCSS | 3.4.0 |
| State | Zustand | 5.0.4 |
| Storage | react-native-mmkv (KV) + expo-secure-store (tokens) | - |
| Forms | react-hook-form + @hookform/resolvers | 7.56.3 |
| HTTP | Axios | 1.9.0 |
| i18n | i18next / react-i18next | 25.1.2 |
| Language | TypeScript | 5.8.x (strict) |

## Structure

```
app/                        # expo-router routes (file-based)
  (auth)/                   # Login, register, verify-email, forgot-password
  (tabs)/                   # index, search, map, notifications, profile
  _layout.tsx               # Root layout: providers, splash, onboarding, app states
api/                        # HTTP layer (Axios)
  client.ts                 # Axios instance + interceptors (auth, snake_case/camelCase)
  config.ts                 # API_CONFIG (timeout, retry, base URL)
  services/                 # auth.ts, posts.ts, users.ts
assets/                     # Images, fonts
components/                 # UI building blocks (Auth, Post, Feed, Notifications, Onboarding, ...)
lib/                        # Core logic
  auth/                     # Zustand auth store, token utils (secure store)
  context/                  # GuestMode, Notification, Theme providers
  hooks/                    # useApiCall, useApiError, useErrorRecovery, useFormErrors, ...
  storage.tsx               # MMKV wrapper
  types/                    # app-types, auth, onboarding, guest-mode, error-recovery
  adapters/                 # API response adapters (post-adapter)
services/                   # Cross-cutting services (i18n, error-reporting)
theme/                      # colors.js (themed palettes)
frontend
```

### Key Patterns

- **expo-router**: routes as files under `app/`; protected groups `(auth)` / `(tabs)`
- **Zustand stores**: created with `create(...)` and wrapped with `createSelectors` (`store.use.someField`) — see `lib/utils.tsx` and `lib/auth/index.tsx`
- **API layer**: `api/services/*` wrap the shared Axios `client`; responses arrive camelCased, requests snake_cased automatically
- **Hooks**: server-side-ish concerns go in `lib/hooks/` (`useApiCall`, `useApiError`, `useFormErrors`)
- **i18n**: never hardcode user-facing strings; use `t('key')` with keys in `services/i18n/locales/{en-US,es-ES}.json`
- **Theming**: use Tailwind classes only for colors defined in `theme/colors.js` for the active `ACTIVE_THEME`
- **App states**: root `_layout.tsx` drives `initializing | loading | onboarding | guest | authenticated | unauthenticated | error`

## Conventions

- **Language**: code and comments in English; user-facing strings via i18n (English + Spanish)
- **Imports**: sorted per eslint `import/order` (builtin → external → internal `@/*`), newline between groups, ascending alphabetical
- **Alias**: `@/*` → project root (see `tsconfig.json`)
- **Formatting**: Prettier (`printWidth: 100`, no semicolons, single quotes, trailing `es5`) — `prettier.config.js` with `prettier-plugin-tailwindcss`
- **Commits**: Conventional Commits (`feat:`, `fix:`, `docs:`, `chore:`, ...) via commitlint config
- **Screens/components**: functional components; reuse existing components instead of creating new base patterns

## Commands

```bash
npm run start    # Expo dev server (-c to clear cache)
npm run android  # Run on Android
npm run ios      # Run on iOS
npm run web      # Run on web
npm run lint     # ESLint + Prettier check (autofix via npm run format)
npm run format   # ESLint --fix + Prettier --write
```

There are no unit/e2e tests configured in this project.

## Mandatory Workflow

Any agent working on this project MUST follow this workflow for every task.

### Before Implementation

1. **Consult Outline (Zooky only)** - Search and read the relevant documents in the Outline Zooky collection (see "Project Documentation"), especially the **App** document and its children
2. **Create a branch from `main` named after the task title** - Whenever the task comes from an Outline task, create a git branch with the task title (slugified), always starting from `main`:
   ```bash
   git checkout main && git pull
   git checkout -b {task-title-slug}
   ```
3. **Read `docs/`** - Consult the relevant project docs (`docs/API_INTERCEPTORS.md`, `docs/NotificationSystem.md`, `docs/Advanced Error Recovery System.md`) for the area you are modifying
4. **Consult the Branding guide** - For any UI work, follow `Guía de Branding y Estilo Visual` and the wireframes in Outline
5. **Identify functional impact** - What user-facing behaviour changes?
6. **Identify documentation affected** - Which docs will need updating?
7. **Present a plan** - Describe your approach before writing code

### During Implementation

1. **Maintain coherence with documentation** - Follow documented conventions
2. **Do not assume undocumented rules** - Base decisions on observed patterns
3. **Use existing architecture** - No new base directories, no new patterns without approval
4. **Keep all code and comments in English**; user-facing strings via i18n keys

### After Implementation

1. **Update affected documentation** - Any doc that describes the modified area (repo `docs/` and/or Outline)
2. **Run `npm run lint`** - Ensure ESLint and Prettier pass
3. **Run `npm run format`** if lint reports fixable issues
4. **Check TypeScript** - Ensure `tsc --noEmit` passes (`npx tsc --noEmit`)

**Critical rule**: A task is NOT complete if documentation is outdated.

## Agent Checklist

Before finalising any task, an agent MUST verify:

1. [ ] Consulted Outline documentation (Zooky collection only, especially the **App** document) before starting
2. [ ] Created a git branch from `main` named after the task title (slugified) before implementing
3. [ ] Read the relevant `docs/` files for the task
4. [ ] Read all relevant documentation for the task
5. [ ] Presented a plan to the user before implementing
6. [ ] Used existing UI components and patterns (no new base folders without approval)
7. [ ] Did NOT hardcode user-facing strings (used i18n keys in `en-US` + `es-ES`)
8. [ ] Kept all code and comments in English
9. [ ] Ran `npm run lint` (ESLint + Prettier) and fixed issues
10. [ ] Verified TypeScript passes (`npx tsc --noEmit`)
11. [ ] Updated affected documentation
12. [ ] Task is complete: documentation is up to date