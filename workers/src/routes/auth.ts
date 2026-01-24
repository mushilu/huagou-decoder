import { Hono } from 'hono'
import { SignJWT, jwtVerify } from 'jose'
import type { Env, User } from '../types'
import { genId, genCode, now } from '../utils'

export const authRoutes = new Hono<{ Bindings: Env }>()

// 发送验证码
authRoutes.post('/send-code', async (c) => {
  const { email } = await c.req.json<{ email: string }>()

  if (!email || !email.includes('@')) {
    return c.json({ success: false, message: '邮箱格式错误' }, 400)
  }

  const code = genCode()
  const id = genId()
  const expires = now() + 300 // 5分钟

  // 存验证码
  await c.env.DB.prepare(
    'INSERT INTO verification_codes (id, email, code, expires_at) VALUES (?, ?, ?, ?)'
  ).bind(id, email, code, expires).run()

  // 发邮件（用Resend）
  if (c.env.RESEND_API_KEY) {
    await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${c.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'noreply@huagou.dev',
        to: email,
        subject: '华构解码器 - 登录验证码',
        html: `<p>您的验证码是：<strong>${code}</strong></p><p>5分钟内有效。</p>`,
      }),
    })
  }

  return c.json({ success: true, message: '验证码已发送' })
})

// 验证码登录
authRoutes.post('/verify-code', async (c) => {
  const { email, code } = await c.req.json<{ email: string; code: string }>()

  // 查验证码
  const record = await c.env.DB.prepare(
    'SELECT * FROM verification_codes WHERE email = ? AND code = ? AND used = 0 AND expires_at > ? ORDER BY expires_at DESC LIMIT 1'
  ).bind(email, code, now()).first()

  if (!record) {
    return c.json({ success: false, message: '验证码无效或已过期' }, 400)
  }

  // 标记已用
  await c.env.DB.prepare('UPDATE verification_codes SET used = 1 WHERE id = ?')
    .bind(record.id).run()

  // 查或创建用户
  let user = await c.env.DB.prepare('SELECT * FROM users WHERE email = ?')
    .bind(email).first<User>()

  if (!user) {
    const userId = genId()
    const timestamp = now()
    await c.env.DB.prepare(
      'INSERT INTO users (id, email, created_at, last_login) VALUES (?, ?, ?, ?)'
    ).bind(userId, email, timestamp, timestamp).run()
    user = { id: userId, email, github_id: null, nickname: null, avatar: null, created_at: timestamp, last_login: timestamp }
  } else {
    await c.env.DB.prepare('UPDATE users SET last_login = ? WHERE id = ?')
      .bind(now(), user.id).run()
  }

  // 生成JWT
  const secret = new TextEncoder().encode(c.env.JWT_SECRET || 'dev-secret')
  const token = await new SignJWT({ sub: user.id, email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret)

  return c.json({ success: true, token, user })
})

// 根据环境获取前端URL
function getFrontendUrl(c: any): string {
  const origin = c.req.header('Origin') || c.req.header('Referer') || ''
  if (origin.includes('localhost')) return 'http://localhost:5173'
  if (origin.includes('huagou-decoder.pages.dev')) return 'https://huagou-decoder.pages.dev'
  return c.env.FRONTEND_URL || 'https://huagou-decoder.pages.dev'
}

// GitHub OAuth跳转
authRoutes.get('/github', (c) => {
  const clientId = c.env.GITHUB_CLIENT_ID
  const frontendUrl = getFrontendUrl(c)
  const callbackUrl = encodeURIComponent(`${c.env.API_URL || 'https://huagou-api.3366301687.workers.dev'}/api/auth/github/callback?redirect=${encodeURIComponent(frontendUrl)}`)
  const redirect = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user:email&redirect_uri=${callbackUrl}`
  return c.redirect(redirect)
})

// GitHub OAuth回调
authRoutes.get('/github/callback', async (c) => {
  const code = c.req.query('code')
  const redirectUrl = c.req.query('redirect') || 'https://huagou-decoder.pages.dev'
  if (!code) return c.json({ error: 'No code' }, 400)

  // 换token
  const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      client_id: c.env.GITHUB_CLIENT_ID,
      client_secret: c.env.GITHUB_CLIENT_SECRET,
      code,
    }),
  })
  const tokenData = await tokenRes.json<{ access_token: string }>()

  // 获取用户信息
  const userRes = await fetch('https://api.github.com/user', {
    headers: { 'Authorization': `Bearer ${tokenData.access_token}`, 'User-Agent': 'HuagouDecoder' },
  })
  const ghUser = await userRes.json<{ id: number; login: string; avatar_url: string; email: string }>()

  // 查或创建用户
  let user = await c.env.DB.prepare('SELECT * FROM users WHERE github_id = ?')
    .bind(String(ghUser.id)).first<User>()

  if (!user) {
    const userId = genId()
    const timestamp = now()
    await c.env.DB.prepare(
      'INSERT INTO users (id, github_id, nickname, avatar, email, created_at, last_login) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).bind(userId, String(ghUser.id), ghUser.login, ghUser.avatar_url, ghUser.email, timestamp, timestamp).run()
    user = { id: userId, email: ghUser.email, github_id: String(ghUser.id), nickname: ghUser.login, avatar: ghUser.avatar_url, created_at: timestamp, last_login: timestamp }
  } else {
    await c.env.DB.prepare('UPDATE users SET last_login = ? WHERE id = ?')
      .bind(now(), user.id).run()
  }

  // 生成JWT
  const secret = new TextEncoder().encode(c.env.JWT_SECRET || 'dev-secret')
  const token = await new SignJWT({ sub: user.id, email: user.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(secret)

  // 重定向回前端
  return c.redirect(`${redirectUrl}/auth/callback?token=${token}`)
})

// 验证token
authRoutes.get('/me', async (c) => {
  const auth = c.req.header('Authorization')
  if (!auth?.startsWith('Bearer ')) {
    return c.json({ user: null }, 401)
  }

  try {
    const secret = new TextEncoder().encode(c.env.JWT_SECRET || 'dev-secret')
    const { payload } = await jwtVerify(auth.slice(7), secret)
    const user = await c.env.DB.prepare('SELECT * FROM users WHERE id = ?')
      .bind(payload.sub).first<User>()
    return c.json({ user })
  } catch {
    return c.json({ user: null }, 401)
  }
})
