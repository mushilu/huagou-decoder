import type { PagesFunction } from '@cloudflare/workers-types'
import {
  type Env,
  clamp,
  errorResponse,
  jsonResponse,
  normalizeString,
  parseJsonArray,
  readJson,
  toIsoString,
  toJsonString,
  toPositiveInt,
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
  id: normalizeString(body.id),
  title: normalizeString(body.title),
  category: normalizeString(body.category),
  difficulty: normalizeString(body.difficulty),
  summary: normalizeString(body.summary ?? body.description),
  content: normalizeString(body.content),
  tags: toJsonString(body.tags),
  image_url: normalizeString(body.imageUrl ?? body.image_url),
  related_buildings: toJsonString(body.relatedBuildings ?? body.related_buildings),
})

// GET /api/cipher
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const url = new URL(ctx.request.url)
  const params = url.searchParams

  const category = params.get('category')
  const difficulty = params.get('difficulty')
  const tag = params.get('tag')
  const search = params.get('search')

  const pageParam = params.get('page')
  const pageSizeParam = params.get('pageSize')
  const usePaging = pageParam !== null || pageSizeParam !== null
  const page = toPositiveInt(pageParam, 1)
  const pageSize = clamp(toPositiveInt(pageSizeParam, 20), 1, 100)

  const filters: string[] = []
  const bindings: unknown[] = []

  if (category) {
    filters.push('category = ?')
    bindings.push(category)
  }

  if (difficulty) {
    filters.push('difficulty = ?')
    bindings.push(difficulty)
  }

  if (tag) {
    filters.push('tags LIKE ?')
    bindings.push(`%${tag}%`)
  }

  if (search) {
    const like = `%${search}%`
    filters.push('(title LIKE ? OR summary LIKE ? OR content LIKE ?)')
    bindings.push(like, like, like)
  }

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
  let sql = `SELECT * FROM cipher_knowledge ${where} ORDER BY updated_at DESC`
  const queryBindings = [...bindings]

  if (usePaging) {
    sql += ' LIMIT ? OFFSET ?'
    queryBindings.push(pageSize, (page - 1) * pageSize)
  }

  const { results } = await ctx.env.DB.prepare(sql).bind(...queryBindings).all()
  const items = results.map(mapCipherRow)

  if (usePaging) {
    const countRow = await ctx.env.DB
      .prepare(`SELECT COUNT(*) as total FROM cipher_knowledge ${where}`)
      .bind(...bindings)
      .first()
    const total =
      typeof countRow?.total === 'number' ? countRow.total : Number(countRow?.total) || 0
    return jsonResponse({ items, total, page, pageSize })
  }

  return jsonResponse(items)
}

// POST /api/cipher
export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const body = await readJson<Record<string, unknown>>(ctx.request)
  if (!body) {
    return errorResponse(400, '请求体不合法')
  }

  const input = normalizeCipherInput(body)
  if (!input.title) {
    return errorResponse(400, '标题不能为空')
  }

  const id = input.id ?? crypto.randomUUID()

  await ctx.env.DB.prepare(`
    INSERT INTO cipher_knowledge (id, title, category, difficulty, summary, content, tags, image_url, related_buildings)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    input.title,
    input.category ?? null,
    input.difficulty ?? null,
    input.summary ?? null,
    input.content ?? null,
    input.tags ?? null,
    input.image_url ?? null,
    input.related_buildings ?? null
  ).run()

  return jsonResponse({ ok: true, id })
}
