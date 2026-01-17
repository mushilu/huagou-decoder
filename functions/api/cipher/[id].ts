import type { PagesFunction } from '@cloudflare/workers-types'
import {
  type Env,
  errorResponse,
  jsonResponse,
  normalizeString,
  parseJsonArray,
  readJson,
  toIsoString,
  toJsonString,
} from '../_shared'

type CipherRow = Record<string, unknown>

const mapCipherRow = (row: CipherRow) => {
  const summary = typeof row.summary === 'string' ? row.summary : ''
  return {
    id: typeof row.id === 'string' ? row.id : String(row.id ?? ''),
    title: typeof row.title === 'string' ? row.title : '',
    category: typeof row.category === 'string' ? row.category : '',
    difficulty: typeof row.difficulty === 'string' ? row.difficulty : '',
    summary,
    description: summary,
    content: typeof row.content === 'string' ? row.content : '',
    tags: parseJsonArray(row.tags) ?? [],
    imageUrl: typeof row.image_url === 'string' ? row.image_url : undefined,
    relatedBuildings: parseJsonArray(row.related_buildings) ?? [],
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  }
}

const normalizeCipherInput = (body: Record<string, unknown>) => ({
  title: normalizeString(body.title),
  category: normalizeString(body.category),
  difficulty: normalizeString(body.difficulty),
  summary: normalizeString(body.summary ?? body.description),
  content: normalizeString(body.content),
  tags: toJsonString(body.tags),
  image_url: normalizeString(body.imageUrl ?? body.image_url),
  related_buildings: toJsonString(body.relatedBuildings ?? body.related_buildings),
})

const getParam = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

// GET /api/cipher/:id
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const id = getParam(ctx.params.id)
  if (!id) {
    return errorResponse(400, '缺少知识 id')
  }

  const result = await ctx.env.DB
    .prepare('SELECT * FROM cipher_knowledge WHERE id = ?')
    .bind(id)
    .first()

  if (!result) {
    return errorResponse(404, '未找到知识内容')
  }

  return jsonResponse(mapCipherRow(result))
}

// PUT /api/cipher/:id
export const onRequestPut: PagesFunction<Env> = async (ctx) => {
  const id = getParam(ctx.params.id)
  if (!id) {
    return errorResponse(400, '缺少知识 id')
  }

  const body = await readJson<Record<string, unknown>>(ctx.request)
  if (!body) {
    return errorResponse(400, '请求体不合法')
  }

  const input = normalizeCipherInput(body)
  if (input.title !== undefined && !input.title) {
    return errorResponse(400, '标题不能为空')
  }

  const existing = await ctx.env.DB
    .prepare('SELECT id FROM cipher_knowledge WHERE id = ?')
    .bind(id)
    .first()

  if (!existing) {
    return errorResponse(404, '未找到知识内容')
  }

  await ctx.env.DB.prepare(`
    UPDATE cipher_knowledge SET
      title = COALESCE(?, title),
      category = COALESCE(?, category),
      difficulty = COALESCE(?, difficulty),
      summary = COALESCE(?, summary),
      content = COALESCE(?, content),
      tags = COALESCE(?, tags),
      image_url = COALESCE(?, image_url),
      related_buildings = COALESCE(?, related_buildings),
      updated_at = unixepoch()
    WHERE id = ?
  `).bind(
    input.title ?? null,
    input.category ?? null,
    input.difficulty ?? null,
    input.summary ?? null,
    input.content ?? null,
    input.tags ?? null,
    input.image_url ?? null,
    input.related_buildings ?? null,
    id
  ).run()

  return jsonResponse({ ok: true })
}

// DELETE /api/cipher/:id
export const onRequestDelete: PagesFunction<Env> = async (ctx) => {
  const id = getParam(ctx.params.id)
  if (!id) {
    return errorResponse(400, '缺少知识 id')
  }

  const existing = await ctx.env.DB
    .prepare('SELECT id FROM cipher_knowledge WHERE id = ?')
    .bind(id)
    .first()

  if (!existing) {
    return errorResponse(404, '未找到知识内容')
  }

  await ctx.env.DB.prepare('DELETE FROM cipher_knowledge WHERE id = ?').bind(id).run()

  return jsonResponse({ ok: true })
}
