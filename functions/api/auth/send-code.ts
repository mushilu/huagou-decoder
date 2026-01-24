import { ensureAuthTables } from './_tables'

// 工具函数
function genId(): string {
  return Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join('')
}

function genCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

function now(): number {
  return Math.floor(Date.now() / 1000)
}

export async function onRequestPost(context: any) {
  try {
    const { request, env } = context
    let payload: { email?: string } | null = null
    try {
      payload = await request.json()
    } catch {
      payload = null
    }
    const email = payload?.email || ''

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ success: false, message: '邮箱格式错误' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    const code = genCode()
    const id = genId()
    const expires = now() + 300

    // 存验证码
    try {
      await ensureAuthTables(env.DB)
      await env.DB.prepare(
        'INSERT INTO verification_codes (id, email, code, expires_at) VALUES (?, ?, ?, ?)'
      ).bind(id, email, code, expires).run()
    } catch {
      return new Response(JSON.stringify({ success: false, message: '验证码服务未就绪' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      })
    }

    // 发邮件（用Resend）
    let emailSent = false
    if (env.RESEND_API_KEY) {
      const from = env.RESEND_FROM || 'onboarding@resend.dev'
      try {
        const res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${env.RESEND_API_KEY}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from,
            to: email,
            subject: '华构解码器 - 登录验证码',
            html: `<p>您的验证码是：<strong>${code}</strong></p><p>5分钟内有效。</p>`,
          }),
        })
        if (res.ok) emailSent = true
      } catch (e) {
        console.error('邮件发送失败', e)
      }
    }

    if (!emailSent) {
      // 开发模式：直接返回验证码
      return new Response(JSON.stringify({ success: true, message: '邮件发送失败，使用备用验证码', debug: code }), {
        headers: { 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true, message: '验证码已发送' }), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch {
    return new Response(JSON.stringify({ success: false, message: '登录服务异常' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    })
  }
}
