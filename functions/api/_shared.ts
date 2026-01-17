import { hasAccessJwt, verifyAdminSession } from '../_auth'

interface Env {
  DB: D1Database
  ADMIN_PASSWORD?: string
  ADMIN_SECRET?: string
}

const JSON_CONTENT_TYPE = 'application/json; charset=utf-8'

export type { Env }

export function jsonResponse(data: unknown, init: ResponseInit = {}) {
  const headers = new Headers(init.headers)
  headers.set('Content-Type', JSON_CONTENT_TYPE)
  return new Response(JSON.stringify(data), { ...init, headers })
}

export function errorResponse(status: number, message: string) {
  return jsonResponse({ ok: false, error: { message } }, { status })
}

export async function readJson<T>(request: Request): Promise<T | null> {
  try {
    return (await request.json()) as T
  } catch {
    return null
  }
}

export function isLocalhost(request: Request) {
  const host = request.headers.get('host') || ''
  return host.includes('localhost') || host.includes('127.0.0.1')
}

export function hasAccessToken(request: Request) {
  return Boolean(request.headers.get('CF-Access-JWT-Assertion'))
}

export function toPositiveInt(value: string | null, fallback: number) {
  const parsed = Number.parseInt(value ?? '', 10)
  if (Number.isNaN(parsed) || parsed <= 0) return fallback
  return parsed
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function toIsoString(value: unknown) {
  if (typeof value === 'number') {
    return new Date(value * 1000).toISOString()
  }

  if (typeof value === 'string') {
    const parsedNumber = Number(value)
    if (!Number.isNaN(parsedNumber)) {
      return new Date(parsedNumber * 1000).toISOString()
    }

    const parsedDate = new Date(value)
    if (!Number.isNaN(parsedDate.getTime())) {
      return parsedDate.toISOString()
    }
  }

  return new Date(0).toISOString()
}

export function parseJsonArray(value: unknown) {
  if (Array.isArray(value)) {
    return value.filter((item): item is string => typeof item === 'string')
  }

  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed)) {
        return parsed.filter((item): item is string => typeof item === 'string')
      }
    } catch {
      return undefined
    }
  }

  return undefined
}

export function parseJsonObject<T extends Record<string, unknown>>(value: unknown) {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as T
  }

  if (typeof value === 'string' && value.trim()) {
    try {
      const parsed = JSON.parse(value)
      if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
        return parsed as T
      }
    } catch {
      return undefined
    }
  }

  return undefined
}

export function normalizeString(value: unknown) {
  if (typeof value !== 'string') return undefined
  const trimmed = value.trim()
  return trimmed
}

export function normalizeNumber(value: unknown) {
  if (typeof value === 'number' && Number.isFinite(value)) return value
  if (typeof value === 'string' && value.trim()) {
    const parsed = Number(value)
    if (Number.isFinite(parsed)) return parsed
  }
  return undefined
}

export function toJsonString(value: unknown) {
  if (value === undefined || value === null) return null
  if (typeof value === 'string') return value
  try {
    return JSON.stringify(value)
  } catch {
    return null
  }
}

export async function isAdminRequest(request: Request, env: Env) {
  const session = await verifyAdminSession(request, env)
  return session.valid || hasAccessJwt(request)
}

export function normalizePathSegment(input: string, fallback = 'uploads') {
  const segments = input
    .split('/')
    .map((segment) => segment.trim())
    .filter((segment) => segment && segment !== '.' && segment !== '..')

  return segments.length > 0 ? segments.join('/') : fallback
}

export function encodeKey(value: string) {
  const bytes = new TextEncoder().encode(value)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

export function decodeKey(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  try {
    const binary = atob(padded)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i += 1) {
      bytes[i] = binary.charCodeAt(i)
    }
    return new TextDecoder().decode(bytes)
  } catch {
    return null
  }
}
