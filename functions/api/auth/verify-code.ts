import { ensureAuthTables } from './_tables'

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
  const now = Math.floor(Date.now() / 1000)

  const encodedHeader = base64Url(JSON.stringify(header))
  const encodedPayload = base64Url(JSON.stringify({ ...payload, exp: now + 7 * 24 * 60 * 60, iat: now }))
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

export async function onRequestPost(context: any) {
  const { request, env } = context
  const { email, code } = await request.json()

  await ensureAuthTables(env.DB)

  // 查验证码
  const record = await env.DB.prepare(
    'SELECT * FROM verification_codes WHERE email = ? AND code = ? AND used = 0 AND expires_at > ? ORDER BY expires_at DESC LIMIT 1'
  ).bind(email, code, now()).first()

  if (!record) {
    return new Response(JSON.stringify({ success: false, message: '验证码无效或已过期' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  // 标记已用
  await env.DB.prepare('UPDATE verification_codes SET used = 1 WHERE id = ?')
    .bind(record.id).run()

  // 查或创建用户
  let user = await env.DB.prepare('SELECT * FROM users WHERE email = ?')
    .bind(email).first<any>()

  if (!user) {
    const userId = genId()
    const timestamp = now()
    await env.DB.prepare(
      'INSERT INTO users (id, email, created_at, last_login) VALUES (?, ?, ?, ?)'
    ).bind(userId, email, timestamp, timestamp).run()
    user = { id: userId, email, github_id: null, nickname: null, avatar: null, created_at: timestamp, last_login: timestamp }
  } else {
    await env.DB.prepare('UPDATE users SET last_login = ? WHERE id = ?')
      .bind(now(), user.id).run()
  }

  // 生成JWT
  const token = await createJWT({ sub: user.id, email: user.email }, env.JWT_SECRET || 'dev-secret')

  return new Response(JSON.stringify({ success: true, token, user }), {
    headers: { 'Content-Type': 'application/json' },
  })
}
