import { ensureAuthTables } from './_tables'

// JWT 验证
async function verifyJWT(token: string, secret: string): Promise<any> {
  const encoder = new TextEncoder()
  const parts = token.split('.')
  if (parts.length !== 3) throw new Error('Invalid token')

  const [encodedHeader, encodedPayload, encodedSignature] = parts
  const data = `${encodedHeader}.${encodedPayload}`

  // 验证签名
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  )
  const signature = Uint8Array.from(atob(encodedSignature.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0))
  const isValid = await crypto.subtle.verify('HMAC', key, signature, encoder.encode(data))

  if (!isValid) throw new Error('Invalid signature')

  // 解析 payload
  const payload = JSON.parse(atob(encodedPayload.replace(/-/g, '+').replace(/_/g, '/')))

  // 检查过期
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
    throw new Error('Token expired')
  }

  return payload
}

export async function onRequestPatch(context: any) {
  const { request, env } = context
  const auth = request.headers.get('Authorization')

  if (!auth?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ success: false, message: '未登录' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const payload = await verifyJWT(auth.slice(7), env.JWT_SECRET || 'dev-secret')
    await ensureAuthTables(env.DB)

    const { nickname, avatar } = await request.json<{ nickname?: string; avatar?: string }>()

    const updates: string[] = []
    const values: (string | null)[] = []

    if (nickname !== undefined) {
      updates.push('nickname = ?')
      values.push(nickname.trim() || null)
    }
    if (avatar !== undefined) {
      updates.push('avatar = ?')
      values.push(avatar || null)
    }

    if (updates.length === 0) {
      return new Response(JSON.stringify({ success: false, message: '没有要更新的内容' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    values.push(payload.sub as string)
    await env.DB.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`)
      .bind(...values).run()

    const user = await env.DB.prepare('SELECT * FROM users WHERE id = ?')
      .bind(payload.sub).first<any>()

    return new Response(JSON.stringify({ success: true, user }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (e) {
    return new Response(JSON.stringify({ success: false, message: '更新失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
