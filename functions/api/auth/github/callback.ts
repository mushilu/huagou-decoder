import { ensureAuthTables } from '../_tables'

// 工具函数
function genId(): string {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

function now(): number {
  return Math.floor(Date.now() / 1000)
}

// 简单的 JWT 实现
async function createJWT(payload: any, secret: string): Promise<string> {
  const encoder = new TextEncoder()
  const header = { alg: 'HS256', typ: 'JWT' }
  const nowTime = Math.floor(Date.now() / 1000)

  const encodedHeader = base64Url(JSON.stringify(header))
  const encodedPayload = base64Url(JSON.stringify({ ...payload, exp: nowTime + 7 * 24 * 60 * 60, iat: nowTime }))
  const data = `${encodedHeader}.${encodedPayload}`

  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(data))
  const encodedSignature = base64Url(new Uint8Array(signature))

  return `${data}.${encodedSignature}`
}

function base64Url(data: string | Uint8Array): string {
  const base64 = typeof data === 'string'
    ? btoa(data)
    : btoa(String.fromCharCode(...data))
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

export async function onRequestGet(context: any) {
  const { request, env } = context
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const state = url.searchParams.get('state')
  const frontendUrl = (state && (state.startsWith('http://') || state.startsWith('https://')) ? state : '')
    || env.FRONTEND_URL || (
    url.origin.includes('localhost') || url.origin.includes('127.0.0.1')
      ? 'http://localhost:5173'
      : url.origin
  )

  if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
    return new Response('未配置 GitHub OAuth', { status: 500 })
  }

  if (!code) {
    return new Response('No code', { status: 400 })
  }

  // 换token
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  })
  const tokenData = await tokenRes.json<{ access_token: string }>()
  if (!tokenData.access_token) {
    return new Response('GitHub 授权失败', { status: 400 })
  }

  await ensureAuthTables(env.DB)

  // 获取用户信息
  const userRes = await fetch('https://api.github.com/user', {
    headers: { 'Authorization': `Bearer ${tokenData.access_token}`, 'User-Agent': 'HuagouDecoder' },
  })
  const ghUser = await userRes.json<{ id: number; login: string; avatar_url: string; email: string | null }>()

  let userEmail = ghUser.email
  if (!userEmail) {
    const emailRes = await fetch('https://api.github.com/user/emails', {
      headers: { 'Authorization': `Bearer ${tokenData.access_token}`, 'User-Agent': 'HuagouDecoder' },
    })
    const emails = await emailRes.json<Array<{ email: string; primary: boolean; verified: boolean }>>()
    const primary = emails.find((item) => item.primary && item.verified)
    userEmail = primary?.email || emails.find((item) => item.verified)?.email || emails[0]?.email || null
  }

  // 查或创建用户
  let user = await env.DB.prepare('SELECT * FROM users WHERE github_id = ?')
    .bind(String(ghUser.id)).first<any>()

  if (!user) {
    const userId = genId()
    const timestamp = now()
    await env.DB.prepare(
      'INSERT INTO users (id, github_id, nickname, avatar, email, created_at, last_login) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(userId, String(ghUser.id), ghUser.login, ghUser.avatar_url, userEmail, timestamp, timestamp).run()
    user = { id: userId, email: userEmail, github_id: String(ghUser.id), nickname: ghUser.login, avatar: ghUser.avatar_url, created_at: timestamp, last_login: timestamp }
  } else {
    await env.DB.prepare('UPDATE users SET last_login = ? WHERE id = ?')
      .bind(now(), user.id).run()
    if (userEmail && !user.email) {
      await env.DB.prepare('UPDATE users SET email = ? WHERE id = ?')
        .bind(userEmail, user.id).run()
      user = { ...user, email: userEmail }
    }
  }

  // 生成JWT
  const token = await createJWT({ sub: user.id, email: user.email }, env.JWT_SECRET || 'dev-secret')

  // 重定向回前端
  return Response.redirect(`${frontendUrl}/auth/callback?token=${token}`, 302)
}
