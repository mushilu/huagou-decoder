import type { PagesFunction } from '@cloudflare/workers-types'
import {
  type Env,
  errorResponse,
  isAdminRequest,
  jsonResponse,
  normalizeString,
  readJson,
  toIsoString,
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
  title: normalizeString(body.title),
  description: normalizeString(body.description),
  difficulty: normalizeString(body.difficulty),
  category: normalizeString(body.category),
  hint: normalizeString(body.hint),
  solution: normalizeString(body.solution),
  building_id: normalizeString(body.buildingId ?? body.building_id),
})

const getParam = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

// GET /api/decoder/:id
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const id = getParam(ctx.params.id)
  if (!id) {
    return errorResponse(400, '缺少挑战 id')
  }

  const result = await ctx.env.DB
    .prepare('SELECT * FROM decoder_challenges WHERE id = ?')
    .bind(id)
    .first()

  if (!result) {
    return errorResponse(404, '未找到挑战')
  }

  const includeSolution = await isAdminRequest(ctx.request, ctx.env)
  return jsonResponse(mapDecoderRow(result, includeSolution))
}

// PUT /api/decoder/:id
export const onRequestPut: PagesFunction<Env> = async (ctx) => {
  const id = getParam(ctx.params.id)
  if (!id) {
    return errorResponse(400, '缺少挑战 id')
  }

  const body = await readJson<Record<string, unknown>>(ctx.request)
  if (!body) {
    return errorResponse(400, '请求体不合法')
  }

  const input = normalizeDecoderInput(body)
  if (input.title !== undefined && !input.title) {
    return errorResponse(400, '标题不能为空')
  }

  const existing = await ctx.env.DB
    .prepare('SELECT id FROM decoder_challenges WHERE id = ?')
    .bind(id)
    .first()

  if (!existing) {
    return errorResponse(404, '未找到挑战')
  }

  await ctx.env.DB.prepare(`
    UPDATE decoder_challenges SET
      title = COALESCE(?, title),
      description = COALESCE(?, description),
      difficulty = COALESCE(?, difficulty),
      category = COALESCE(?, category),
      hint = COALESCE(?, hint),
      solution = COALESCE(?, solution),
      building_id = COALESCE(?, building_id),
      updated_at = unixepoch()
    WHERE id = ?
  `).bind(
    input.title ?? null,
    input.description ?? null,
    input.difficulty ?? null,
    input.category ?? null,
    input.hint ?? null,
    input.solution ?? null,
    input.building_id ?? null,
    id
  ).run()

  return jsonResponse({ ok: true })
}

// DELETE /api/decoder/:id
export const onRequestDelete: PagesFunction<Env> = async (ctx) => {
  const id = getParam(ctx.params.id)
  if (!id) {
    return errorResponse(400, '缺少挑战 id')
  }

  const existing = await ctx.env.DB
    .prepare('SELECT id FROM decoder_challenges WHERE id = ?')
    .bind(id)
    .first()

  if (!existing) {
    return errorResponse(404, '未找到挑战')
  }

  await ctx.env.DB.prepare('DELETE FROM decoder_challenges WHERE id = ?').bind(id).run()

  return jsonResponse({ ok: true })
}
