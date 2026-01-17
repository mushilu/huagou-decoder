import type { PagesFunction } from '@cloudflare/workers-types'
import {
  type Env,
  clamp,
  errorResponse,
  isAdminRequest,
  jsonResponse,
  readJson,
  toPositiveInt,
} from '../_shared'
import { mapBuildingRow, normalizeBuildingInput, normalizeStatus } from './_mapping'

// GET /api/buildings
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const url = new URL(ctx.request.url)
  const params = url.searchParams
  const isAdmin = await isAdminRequest(ctx.request, ctx.env)

  const statusParam = params.get('status')
  const dynasty = params.get('dynasty')
  const buildingType = params.get('buildingType') ?? params.get('type')
  const search = params.get('search')

  const pageParam = params.get('page')
  const pageSizeParam = params.get('pageSize')
  const usePaging = pageParam !== null || pageSizeParam !== null
  const page = toPositiveInt(pageParam, 1)
  const pageSize = clamp(toPositiveInt(pageSizeParam, 20), 1, 100)

  const filters: string[] = []
  const bindings: unknown[] = []

  if (!isAdmin) {
    filters.push('status = ?')
    bindings.push('published')
  } else {
    const status = normalizeStatus(statusParam)
    if (status) {
      filters.push('status = ?')
      bindings.push(status)
    }
  }

  if (dynasty) {
    filters.push('dynasty = ?')
    bindings.push(dynasty)
  }

  if (buildingType) {
    filters.push('building_type = ?')
    bindings.push(buildingType)
  }

  if (search) {
    const like = `%${search}%`
    filters.push('(name_zh LIKE ? OR name_en LIKE ? OR summary LIKE ? OR region_name LIKE ?)')
    bindings.push(like, like, like, like)
  }

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : ''
  let sql = `SELECT * FROM buildings ${where} ORDER BY updated_at DESC`
  const queryBindings = [...bindings]

  if (usePaging) {
    sql += ' LIMIT ? OFFSET ?'
    queryBindings.push(pageSize, (page - 1) * pageSize)
  }

  const { results } = await ctx.env.DB.prepare(sql).bind(...queryBindings).all()
  const items = results.map(mapBuildingRow)

  if (usePaging) {
    const countRow = await ctx.env.DB
      .prepare(`SELECT COUNT(*) as total FROM buildings ${where}`)
      .bind(...bindings)
      .first()
    const total =
      typeof countRow?.total === 'number' ? countRow.total : Number(countRow?.total) || 0
    return jsonResponse({ items, total, page, pageSize })
  }

  return jsonResponse(items)
}

// POST /api/buildings
export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const body = await readJson<Record<string, unknown>>(ctx.request)
  if (!body) {
    return errorResponse(400, '请求体不合法')
  }

  const input = normalizeBuildingInput(body)
  const status = normalizeStatus(input.status) ?? 'published'

  if (!input.slug || !input.name_zh || !input.dynasty || !input.building_type) {
    return errorResponse(400, '缺少必要字段')
  }

  const id = input.id ?? crypto.randomUUID()

  const existing = await ctx.env.DB
    .prepare('SELECT id FROM buildings WHERE id = ? OR slug = ?')
    .bind(id, input.slug)
    .first()
  if (existing) {
    return errorResponse(409, 'ID 或 slug 已存在')
  }

  await ctx.env.DB.prepare(`
    INSERT INTO buildings (id, slug, name_zh, name_en, dynasty, dynasty_year, building_type,
      region_id, region_name, province, lat, lng, summary, content, detailed_history,
      construction_details, artifacts, cultural_significance, visiting_info, thumbnail, images, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).bind(
    id,
    input.slug,
    input.name_zh,
    input.name_en ?? null,
    input.dynasty,
    input.dynasty_year ?? null,
    input.building_type,
    input.region_id ?? null,
    input.region_name ?? null,
    input.province ?? null,
    input.lat ?? null,
    input.lng ?? null,
    input.summary ?? null,
    input.content ?? null,
    input.detailed_history ?? null,
    input.construction_details ?? null,
    input.artifacts ?? null,
    input.cultural_significance ?? null,
    input.visiting_info ?? null,
    input.thumbnail ?? null,
    input.images ?? null,
    status
  ).run()

  return jsonResponse({ ok: true, id })
}
