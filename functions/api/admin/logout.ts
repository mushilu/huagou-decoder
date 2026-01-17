import type { PagesFunction } from '@cloudflare/workers-types'
import { type Env, jsonResponse } from '../_shared'
import { clearAdminSessionCookie } from '../../_auth'

// POST /api/admin/logout
export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const cookie = clearAdminSessionCookie(ctx.request)
  return jsonResponse(
    { ok: true },
    {
      headers: {
        'Set-Cookie': cookie,
      },
    }
  )
}
