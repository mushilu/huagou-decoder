import type { PagesFunction } from '@cloudflare/workers-types'
import { type Env, jsonResponse } from '../_shared'
import { verifyAdminSession } from '../../_auth'

// GET /api/admin/session
export const onRequestGet: PagesFunction<Env> = async (ctx) => {
  const session = await verifyAdminSession(ctx.request, ctx.env)
  if (!session.valid) {
    return jsonResponse({ ok: false }, { status: 401 })
  }

  return jsonResponse({ ok: true, exp: session.exp })
}
