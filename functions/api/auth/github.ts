export async function onRequestGet(context: any) {
  const { env, request } = context
  const clientId = env.GITHUB_CLIENT_ID
  if (!clientId) {
    return new Response('未配置 GitHub Client ID', { status: 500 })
  }

  const url = new URL(request.url)
  const originHeader = request.headers.get('Origin') || request.headers.get('Referer') || ''

  let frontendUrl = env.FRONTEND_URL || ''
  if (!frontendUrl && originHeader) {
    try {
      frontendUrl = new URL(originHeader).origin
    } catch {
      frontendUrl = ''
    }
  }
  if (!frontendUrl) {
    frontendUrl = url.origin.includes('localhost') || url.origin.includes('127.0.0.1')
      ? 'http://localhost:5173'
      : url.origin
  }

  // 使用前端 URL 作为 API 的 origin（确保回调到正确的域名）
  const apiOrigin = frontendUrl || url.origin
  const callbackUrl = `${apiOrigin}/api/auth/github/callback`
  const state = encodeURIComponent(frontendUrl)
  const redirect = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user:email&redirect_uri=${encodeURIComponent(callbackUrl)}&state=${state}`
  return Response.redirect(redirect, 302)
}
