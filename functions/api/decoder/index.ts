import type { PagesFunction } from '@cloudflare/workers-types'
import {
  type Env,
  clamp,
  errorResponse,
  isAdminRequest,
  jsonResponse,
  normalizeString,
  readJson,
  toIsoString,
  toPositiveInt,
} from '../_shared'

type DecoderRow = Record<string, unknown>

const mapDecoderRow = (row: DecoderRow, includeSolution: boolean) => {
  const item: Record<string, unknown> = {
    id: typeof row.id === 'string' ? row.id : String(row.id ?? ''),
    title: typeof row.title === 'string' ? row.title : '',
    description: typeof row.description === 'string' ? row.description : '',
    difficulty: typeof row.difficulty === 'string' ? row.difficulty : '',
    category: typeof row.category === 'string' ? row.category : '',
    hint: typeof row.hint === 'string' ? row.hint : '',
    buildingId: typeof row.building_id === 'string' ? row.building_id : undefined,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
  }

  if (includeSolution) {
    item.solution = typeof row.solution === 'string' ? row.solution : ''
  }

  return item
}

const normalizeDecoderInput = (body: Record<string, unknown>) => ({
  id: normalizeString(body.id),
  title: normalizeString(body.title),
  description: normalizeString(body.description),
  difficulty: normalizeString(body.difficulty),
  category: normalizeString(body.category),
  hint: normalizeString(body.hint),
  solution: normalizeString(body.solution),
  building_id: normalizeString(body.buildingId ?? body.building_id),
})

// GET /api/decoder
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const url = new URL(ctx.request.url)
  const params = url.searchParams
  const includeSolution = await isAdminRequest(ctx.request, ctx.env)

  const difficulty = params.get('difficulty')
  const category = params.get('category')
  const buildingId = params.get('buildingId')
  const search = params.get('search')

  const pageParam = params.get('page')
  const pageSizeParam = params.get('pageSize')
  const usePaging = pageParam !== null || pageSizeParam !== null
  const page = toPositiveInt(pageParam, 1)
  const pageSize = clamp(toPositiveInt(pageSizeParam, 20), 1, 100)

  const filters: string[] = []
  const bindings: unknown[] = []

  if (difficulty) {
    filters.push('difficulty = ?')
    bindings.push(difficulty)
  }

  if (category) {
    filters.push('category = ?')
    bindings.push(category)
  }

  if (buildingId) {
    filters.push('building_id = ?')
    bindings.push(buildingId)
  }

  if (search) {
    const like = `%${search}%`
    filters.push('(title LIKE ? OR description LIKE ? OR hint LIKE ?)')
    bindings.push(like, like, like)
  }

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
  let sql = `SELECT * FROM decoder_challenges ${where} ORDER BY updated_at DESC`
  const queryBindings = [...bindings]

  if (usePaging) {
    sql += ' LIMIT ? OFFSET ?'
    queryBindings.push(pageSize, (page - 1) * pageSize)
  }

  const { results } = await ctx.env.DB.prepare(sql).bind(...queryBindings).all()
  const items = results.map((row) => mapDecoderRow(row, includeSolution))

  if (usePaging) {
    const countRow = await ctx.env.DB
      .prepare(`SELECT COUNT(*) as total FROM decoder_challenges ${where}`)
      .bind(...bindings)
      .first()
    const total =
      typeof countRow?.total === 'number' ? countRow.total : Number(countRow?.total) || 0
    return jsonResponse({ items, total, page, pageSize })
  }

  return jsonResponse(items)
}

// POST /api/decoder
export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const body = await readJson<Record<string, unknown>>(ctx.request)
  if (!body) {
    return errorResponse(400, '请求体不合法')
  }

  const input = normalizeDecoderInput(body)
  if (!input.title) {
    return errorResponse(400, '标题不能为空')
  }

  const id = input.id ?? crypto.randomUUID()

  await ctx.env.DB.prepare(`
    INSERT INTO decoder_challenges (id, title, description, difficulty, category, hint, solution, building_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    input.title,
    input.description ?? null,
    input.difficulty ?? null,
    input.category ?? null,
    input.hint ?? null,
    input.solution ?? null,
    input.building_id ?? null
  ).run()

  return jsonResponse({ ok: true, id })
}
