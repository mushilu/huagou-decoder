import type { PagesFunction } from '@cloudflare/workers-types'
import { type Env, errorResponse, jsonResponse, parseJsonObject, readJson, toJsonString } from '../_shared'

const getParam = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

// GET /api/pages/:slug
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const slug = getParam(ctx.params.slug)
  if (!slug) {
    return errorResponse(400, '缺少页面标识')
  }

  const record = await ctx.env.DB
    .prepare('SELECT slug, content, updated_at FROM cms_pages WHERE slug = ?')
    .bind(slug)
    .first()

  if (!record) {
    return errorResponse(404, '页面内容不存在')
  }

  const content = parseJsonObject<Record<string, unknown>>(record.content)
  if (!content) {
    return errorResponse(500, '页面内容解析失败')
  }

  return jsonResponse({
    slug: record.slug,
    content,
    updatedAt: record.updated_at,
  })
}

// PUT /api/pages/:slug
export const onRequestPut: PagesFunction<Env> = async (ctx) => {
  const slug = getParam(ctx.params.slug)
  if (!slug) {
    return errorResponse(400, '缺少页面标识')
  }

  const body = await readJson<Record<string, unknown>>(ctx.request)
  if (!body) {
    return errorResponse(400, '请求体不合法')
  }

  const content = parseJsonObject<Record<string, unknown>>(body.content ?? body)
  if (!content) {
    return errorResponse(400, '页面内容格式不正确')
  }

  const serialized = toJsonString(content)
  if (!serialized) {
    return errorResponse(400, '页面内容无法序列化')
  }

  await ctx.env.DB.prepare(`
    INSERT INTO cms_pages (slug, content, updated_at)
    VALUES (?, ?, unixepoch())
    ON CONFLICT(slug) DO UPDATE SET
      content = excluded.content,
      updated_at = excluded.updated_at
  `).bind(slug, serialized).run()

  return jsonResponse({ ok: true })
}
