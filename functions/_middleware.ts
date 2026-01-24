import type { PagesFunction } from '@cloudflare/workers-types'
import type { AdminAuthEnv } from './_auth'
import { hasAccessJwt, verifyAdminSession } from './_auth'

interface Env extends AdminAuthEnv {
  DB: D1Database
}

// 保护管理后台与写操作
export const onRequest: PagesFunction<Env> = async (ctx) => {
  const url = new URL(ctx.request.url)
  const pathname = url.pathname

  const isAdminRoute = pathname.startsWith('/admin')
  const isAdminLogin = pathname === '/admin/login'
  const isApiRoute = pathname.startsWith('/api/')
  const isAdminApi = pathname.startsWith('/api/admin/')
  const isAuthApi = pathname.startsWith('/api/auth/')

  // 公开路由：auth API、管理登录
  if (
    isAdminLogin ||
    pathname === '/api/admin/login' ||
    pathname === '/api/admin/session' ||
    pathname === '/api/admin/logout' ||
    isAuthApi
  ) {
    return ctx.next()
  }

  // 非管理/API 路由直接通过
  if (!isAdminRoute && !isApiRoute) {
    return ctx.next()
  }

  const method = ctx.request.method.toUpperCase()
  const isRead = method === 'GET' || method === 'HEAD' || method === 'OPTIONS'

  // 公开 API 的 GET 请求
  if (isApiRoute && !isAdminApi && isRead) {
    return ctx.next()
  }

  // 验证管理会话
  const session = await verifyAdminSession(ctx.request, ctx.env)
  const hasAccess = hasAccessJwt(ctx.request)
  if (session.valid || hasAccess) {
    return ctx.next()
  }

  if (isAdminRoute && !isApiRoute) {
    const redirect = encodeURIComponent(`${pathname}${url.search}`)
    return Response.redirect(`/admin/login?redirect=${redirect}`, 302)
  }

  return new Response(JSON.stringify({ ok: false, error: { message: '未授权' } }), {
    status: 401,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  })
}
