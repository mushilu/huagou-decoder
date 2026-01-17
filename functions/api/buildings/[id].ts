import type { PagesFunction } from '@cloudflare/workers-types'
import {
  type Env,
  errorResponse,
  isAdminRequest,
  jsonResponse,
  normalizeNumber,
  readJson,
} from '../_shared'
import { mapBuildingRow, normalizeBuildingInput, normalizeStatus } from './_mapping'

const getParam = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value)

// GET /api/buildings/:id
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const id = getParam(ctx.params.id)
  if (!id) {
    return errorResponse(400, '缺少建筑 id')
  }

  const result = await ctx.env.DB.prepare(
    'SELECT * FROM buildings WHERE id = ? OR slug = ?'
  )
    .bind(id, id)
    .first()

  if (!result) {
    return errorResponse(404, '未找到建筑')
  }

  const isAdmin = await isAdminRequest(ctx.request, ctx.env)
  const status = normalizeStatus(result.status) ?? 'published'
  if (!isAdmin && status !== 'published') {
    return errorResponse(404, '未找到建筑')
  }

  const view = new URL(ctx.request.url).searchParams.get('view')
  if (view === '1' && !isAdmin) {
    await ctx.env.DB.prepare('UPDATE buildings SET view_count = view_count + 1 WHERE id = ?')
      .bind(result.id)
      .run()
    const current = normalizeNumber(result.view_count) ?? 0
    result.view_count = current + 1
  }

  return jsonResponse(mapBuildingRow(result))
}

// PUT /api/buildings/:id
export const onRequestPut: PagesFunction<Env> = async (ctx) => {
  const id = getParam(ctx.params.id)
  if (!id) {
    return errorResponse(400, '缺少建筑 id')
  }

  const body = await readJson<Record<string, unknown>>(ctx.request)
  if (!body) {
    return errorResponse(400, '请求体不合法')
  }

  const existing = await ctx.env.DB
    .prepare('SELECT id, slug FROM buildings WHERE id = ? OR slug = ?')
    .bind(id, id)
    .first()

  if (!existing) {
    return errorResponse(404, '未找到建筑')
  }

  const input = normalizeBuildingInput(body)
  if (input.slug !== undefined && !input.slug) {
    return errorResponse(400, 'slug 不能为空')
  }

  const existingId = typeof existing.id === 'string' ? existing.id : String(existing.id ?? '')
  const existingSlug = typeof existing.slug === 'string' ? existing.slug : ''

  if (input.slug && input.slug !== existingSlug) {
    const slugExists = await ctx.env.DB
      .prepare('SELECT id FROM buildings WHERE slug = ? AND id != ?')
      .bind(input.slug, existingId)
      .first()
    if (slugExists) {
      return errorResponse(409, 'slug 已存在')
    }
  }

  const status = normalizeStatus(input.status)

  await ctx.env.DB.prepare(`
    UPDATE buildings SET
      slug = COALESCE(?, slug),
      name_zh = COALESCE(?, name_zh),
      name_en = COALESCE(?, name_en),
      dynasty = COALESCE(?, dynasty),
      dynasty_year = COALESCE(?, dynasty_year),
      building_type = COALESCE(?, building_type),
      region_id = COALESCE(?, region_id),
      region_name = COALESCE(?, region_name),
      province = COALESCE(?, province),
      lat = COALESCE(?, lat),
      lng = COALESCE(?, lng),
      summary = COALESCE(?, summary),
      content = COALESCE(?, content),
      detailed_history = COALESCE(?, detailed_history),
      construction_details = COALESCE(?, construction_details),
      artifacts = COALESCE(?, artifacts),
      cultural_significance = COALESCE(?, cultural_significance),
      visiting_info = COALESCE(?, visiting_info),
      thumbnail = COALESCE(?, thumbnail),
      images = COALESCE(?, images),
      status = COALESCE(?, status),
      updated_at = unixepoch()
    WHERE id = ?
  `).bind(
    input.slug ?? null,
    input.name_zh ?? null,
    input.name_en ?? null,
    input.dynasty ?? null,
    input.dynasty_year ?? null,
    input.building_type ?? null,
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
    status ?? null,
    existingId
  ).run()

  return jsonResponse({ ok: true })
}

// DELETE /api/buildings/:id
export const onRequestDelete: PagesFunction<Env> = async (ctx) => {
  const id = getParam(ctx.params.id)
  if (!id) {
    return errorResponse(400, '缺少建筑 id')
  }

  const existing = await ctx.env.DB
    .prepare('SELECT id FROM buildings WHERE id = ? OR slug = ?')
    .bind(id, id)
    .first()

  if (!existing) {
    return errorResponse(404, '未找到建筑')
  }

  const existingId = typeof existing.id === 'string' ? existing.id : String(existing.id ?? '')

  await ctx.env.DB.prepare('DELETE FROM buildings WHERE id = ?')
    .bind(existingId)
    .run()

  return jsonResponse({ ok: true })
}
