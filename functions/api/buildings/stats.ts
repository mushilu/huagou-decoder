import type { PagesFunction } from '@cloudflare/workers-types'
import { type Env, isAdminRequest, jsonResponse } from '../_shared'

// GET /api/buildings/stats
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const isAdmin = await isAdminRequest(ctx.request, ctx.env)
  const filters: string[] = []
  const bindings: unknown[] = []

  if (!isAdmin) {
    filters.push('status = ?')
    bindings.push('published')
  }

  const where = filters.length ? `WHERE ${filters.join(' AND ')}` : ''

  const dynastyRows = await ctx.env.DB
    .prepare(`SELECT dynasty, COUNT(*) as count FROM buildings ${where} GROUP BY dynasty`)
    .bind(...bindings)
    .all()

  const typeRows = await ctx.env.DB
    .prepare(`SELECT building_type as type, COUNT(*) as count FROM buildings ${where} GROUP BY building_type`)
    .bind(...bindings)
    .all()

  const byDynasty: Record<string, number> = {}
  dynastyRows.results.forEach((row) => {
    const key = typeof row.dynasty === 'string' ? row.dynasty : '未知'
    const count = typeof row.count === 'number' ? row.count : Number(row.count) || 0
    byDynasty[key] = count
  })

  const byType: Record<string, number> = {}
  typeRows.results.forEach((row) => {
    const key = typeof row.type === 'string' ? row.type : '未知'
    const count = typeof row.count === 'number' ? row.count : Number(row.count) || 0
    byType[key] = count
  })

  return jsonResponse({ byDynasty, byType })
}
