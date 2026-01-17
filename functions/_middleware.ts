import type { PagesFunction } from '@cloudflare/workers-types'
import type { AdminAuthEnv } from './_auth'
import { hasAccessJwt, verifyAdminSession } from './_auth'

interface Env extends AdminAuthEnv {
  DB: D1Database
  IMAGES: R2Bucket
}

// 保护管理后台与写操作
export const onRequest: PagesFunction<Env> = async (ctx) => {
  const url = new URL(ctx.request.url)
  const pathname = url.pathname

  const isAdminRoute = pathname.startsWith('/admin')
  const isAdminLogin = pathname === '/admin/login'
  const isApiRoute = pathname.startsWith('/api/')
  const isAdminApi = pathname.startsWith('/api/admin/')

  if (!isAdminRoute && !isApiRoute) {
    return ctx.next()
  }

  if (
    isAdminLogin ||
    pathname === '/api/admin/login' ||
    pathname === '/api/admin/session' ||
    pathname === '/api/admin/logout'
  ) {
    return ctx.next()
  }

  const method = ctx.request.method.toUpperCase()
  const isRead = method === 'GET' || method === 'HEAD' || method === 'OPTIONS'

  if (isApiRoute && !isAdminApi && isRead) {
    return ctx.next()
  }

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
