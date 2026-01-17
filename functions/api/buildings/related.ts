import type { PagesFunction } from '@cloudflare/workers-types'
import { type Env, clamp, errorResponse, isAdminRequest, jsonResponse, toPositiveInt } from '../_shared'
import { mapBuildingRow } from './_mapping'

// GET /api/buildings/related?id=xxx&limit=4
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const url = new URL(ctx.request.url)
  const id = url.searchParams.get('id')

  if (!id) {
    return errorResponse(400, '缺少建筑 id')
  }

  const base = await ctx.env.DB.prepare(
    'SELECT id, dynasty, building_type, status FROM buildings WHERE id = ? OR slug = ?'
  )
    .bind(id, id)
    .first()

  if (!base) {
    return errorResponse(404, '未找到建筑')
  }

  const isAdmin = await isAdminRequest(ctx.request, ctx.env)
  const baseStatus = base.status === 'draft' || base.status === 'published' ? base.status : 'published'
  if (!isAdmin && baseStatus !== 'published') {
    return errorResponse(404, '未找到建筑')
  }

  const limit = clamp(toPositiveInt(url.searchParams.get('limit'), 4), 1, 12)

  const filters: string[] = []
  const bindings: unknown[] = []

  if (!isAdmin) {
    filters.push('status = ?')
    bindings.push('published')
  }

  filters.push('id != ?')
  bindings.push(base.id)

  filters.push('(dynasty = ? OR building_type = ?)')
  bindings.push(base.dynasty, base.building_type)

  const where = `WHERE ${filters.join(' AND ')}`
  const sql = `SELECT * FROM buildings ${where} ORDER BY updated_at DESC LIMIT ?`
  bindings.push(limit)

  const { results } = await ctx.env.DB.prepare(sql).bind(...bindings).all()
  return jsonResponse(results.map(mapBuildingRow))
}
