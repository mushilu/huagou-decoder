import type { PagesFunction } from '@cloudflare/workers-types'
import type { Env } from '../api/_shared'
import { decodeKey } from '../api/_shared'

const getParam = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

// GET /images/:key (key 为 base64url 编码)
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const encoded = getParam(ctx.params.key)
  if (!encoded) {
    return new Response('Not found', { status: 404 })
  }

  const key = decodeKey(encoded)
  if (!key) {
    return new Response('Not found', { status: 404 })
  }

  const object = await ctx.env.IMAGES.get(key)
  if (!object) {
    return new Response('Not found', { status: 404 })
  }

  const headers = new Headers()
  object.writeHttpMetadata(headers)
  headers.set('Cache-Control', 'public, max-age=31536000, immutable')

  return new Response(object.body, { headers })
}
