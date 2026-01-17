import type { PagesFunction } from '@cloudflare/workers-types'
import type { Env } from '../api/_shared'
import { decodeKey } from '../api/_shared'

const getParam = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

const base64ToBytes = (base64: string) => {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes
}

const toBytes = (value: unknown) => {
  if (!value) return null
  if (value instanceof Uint8Array) return value
  if (value instanceof ArrayBuffer) return new Uint8Array(value)
  if (ArrayBuffer.isView(value)) return new Uint8Array(value.buffer)
  if (typeof value === 'string') return base64ToBytes(value)
  return null
}

// GET /images/:key (key 为 base64url 编码)
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const encoded = getParam(ctx.params.key)
  if (!encoded) {
    return ctx.next()
  }

  const key = decodeKey(encoded)
  if (!key || !key.includes('/')) {
    return ctx.next()
  }

  const row = await ctx.env.DB.prepare('SELECT mime_type, data FROM cms_assets WHERE key = ?')
    .bind(key)
    .first<{ mime_type: string; data: unknown }>()

  if (!row) {
    return new Response('Not found', { status: 404 })
  }

  const body = toBytes(row.data)
  if (!body) {
    return new Response('Not found', { status: 404 })
  }

  const headers = new Headers()
  headers.set('Content-Type', row.mime_type || 'application/octet-stream')
  headers.set('Cache-Control', 'public, max-age=31536000, immutable')

  return new Response(body, { headers })
}
