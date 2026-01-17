import type { PagesFunction } from '@cloudflare/workers-types'
import { type Env, errorResponse, jsonResponse, readJson } from '../_shared'
import { createAdminSessionCookie, getAdminPassword } from '../../_auth'

// POST /api/admin/login
export const onRequestPost: PagesFunction<Env> = async (ctx) => {
  const body = await readJson<Record<string, unknown>>(ctx.request)
  if (!body) {
    return errorResponse(400, '请求体不合法')
  }

  const password = typeof body.password === 'string' ? body.password : ''
  const expected = getAdminPassword(ctx.env, ctx.request)

  if (!expected) {
    return errorResponse(500, '未配置管理员密码')
  }

  if (!password || password !== expected) {
    return errorResponse(401, '密码错误')
  }

  const cookie = await createAdminSessionCookie(ctx.request, ctx.env)
  if (!cookie) {
    return errorResponse(500, '无法创建会话')
  }

  return jsonResponse(
    { ok: true },
    {
      headers: {
        'Set-Cookie': cookie,
      },
    }
  )
}
