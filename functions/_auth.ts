const ADMIN_COOKIE_NAME = 'admin_session'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7
const DEFAULT_ADMIN_PASSWORD = 'huagou'

const encoder = new TextEncoder()
const decoder = new TextDecoder()
const keyCache = new Map<string, CryptoKey>()

export interface AdminAuthEnv {
  ADMIN_PASSWORD?: string
  ADMIN_SECRET?: string
}

export function getAdminPassword(env: AdminAuthEnv, request: Request) {
  if (env.ADMIN_PASSWORD) return env.ADMIN_PASSWORD
  const host = request.headers.get('host') || ''
  if (host.includes('localhost') || host.includes('127.0.0.1')) {
    return DEFAULT_ADMIN_PASSWORD
  }
  return null
}

function getAdminSecret(env: AdminAuthEnv, request: Request) {
  if (env.ADMIN_SECRET) return env.ADMIN_SECRET
  return getAdminPassword(env, request)
}

function isLocalhost(request: Request) {
  const host = request.headers.get('host') || ''
  return host.includes('localhost') || host.includes('127.0.0.1')
}

function toBase64Url(data: ArrayBuffer | Uint8Array) {
  const bytes = data instanceof Uint8Array ? data : new Uint8Array(data)
  let binary = ''
  bytes.forEach((byte) => {
    binary += String.fromCharCode(byte)
  })
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function fromBase64Url(input: string) {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

async function getHmacKey(secret: string) {
  const cached = keyCache.get(secret)
  if (cached) return cached

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
  keyCache.set(secret, key)
  return key
}

async function signPayload(payload: string, secret: string) {
  const key = await getHmacKey(secret)
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(payload))
  return toBase64Url(signature)
}

async function verifyPayload(payload: string, signature: string, secret: string) {
  const key = await getHmacKey(secret)
  const signatureBytes = fromBase64Url(signature)
  return crypto.subtle.verify('HMAC', key, signatureBytes, encoder.encode(payload))
}

function getCookie(request: Request, name: string) {
  const header = request.headers.get('cookie') || ''
  const parts = header.split(';')
  for (const part of parts) {
    const [key, ...rest] = part.trim().split('=')
    if (key === name) {
      return rest.join('=')
    }
  }
  return null
}

export async function createAdminSessionCookie(request: Request, env: AdminAuthEnv) {
  const secret = getAdminSecret(env, request)
  if (!secret) return null

  const exp = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS
  const payload = JSON.stringify({ exp, nonce: crypto.randomUUID() })
  const payloadEncoded = toBase64Url(encoder.encode(payload))
  const signature = await signPayload(payloadEncoded, secret)
  const token = `${payloadEncoded}.${signature}`

  const attributes = [
    `${ADMIN_COOKIE_NAME}=${token}`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    `Max-Age=${SESSION_TTL_SECONDS}`,
  ]

  if (!isLocalhost(request)) {
    attributes.push('Secure')
  }

  return attributes.join('; ')
}

export function clearAdminSessionCookie(request: Request) {
  const attributes = [
    `${ADMIN_COOKIE_NAME}=`,
    'Path=/',
    'HttpOnly',
    'SameSite=Lax',
    'Max-Age=0',
  ]

  if (!isLocalhost(request)) {
    attributes.push('Secure')
  }

  return attributes.join('; ')
}

export async function verifyAdminSession(request: Request, env: AdminAuthEnv) {
  const secret = getAdminSecret(env, request)
  if (!secret) return { valid: false }

  const token = getCookie(request, ADMIN_COOKIE_NAME)
  if (!token) return { valid: false }

  const [payloadEncoded, signature] = token.split('.')
  if (!payloadEncoded || !signature) return { valid: false }

  const isValid = await verifyPayload(payloadEncoded, signature, secret)
  if (!isValid) return { valid: false }

  try {
    const payloadJson = decoder.decode(fromBase64Url(payloadEncoded))
    const payload = JSON.parse(payloadJson) as { exp?: number }
    if (!payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false }
    }
    return { valid: true, exp: payload.exp }
  } catch {
    return { valid: false }
  }
}

export function hasAccessJwt(request: Request) {
  return Boolean(request.headers.get('CF-Access-JWT-Assertion'))
}
