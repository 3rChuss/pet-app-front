import type { AuthSession, User } from '@/lib/types/auth'

type UnknownRecord = Record<string, unknown>

export class AuthContractError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'AuthContractError'
  }
}

const isRecord = (value: unknown): value is UnknownRecord =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const asNonEmptyString = (value: unknown): string | null =>
  typeof value === 'string' && value.length > 0 ? value : null

const unwrapEnvelope = (payload: UnknownRecord): UnknownRecord => {
  const data = payload.data
  return isRecord(data) ? { ...payload, ...data } : payload
}

const adaptUser = (source: UnknownRecord): User | null => {
  const raw = source.user
  if (!isRecord(raw)) return null

  const id = typeof raw.id === 'number' ? raw.id : Number(raw.id)
  const name = asNonEmptyString(raw.name)
  const email = asNonEmptyString(raw.email)

  if (!Number.isFinite(id) || name === null || email === null) return null

  return {
    id,
    name,
    email,
    emailVerifiedAt: asNonEmptyString(raw.emailVerifiedAt),
    createdAt: asNonEmptyString(raw.createdAt) ?? '',
    updatedAt: asNonEmptyString(raw.updatedAt) ?? '',
  }
}

export const normalizeStoredUser = (payload: unknown): User | null =>
  isRecord(payload) ? adaptUser({ user: payload }) : null

export const normalizeAuthSession = (payload: unknown): AuthSession => {
  if (!isRecord(payload)) {
    throw new AuthContractError('Login response is not an object')
  }

  const source = unwrapEnvelope(payload)

  const access =
    asNonEmptyString(source.accessToken) ??
    asNonEmptyString(source.access) ??
    asNonEmptyString(source.token)

  if (access === null) {
    throw new AuthContractError('Login response does not contain an access token')
  }

  const refresh =
    asNonEmptyString(source.refreshToken) ?? asNonEmptyString(source.refresh) ?? access

  const user = adaptUser(source)
  if (user === null) {
    throw new AuthContractError('Login response does not contain a valid user')
  }

  return { access, refresh, user }
}
