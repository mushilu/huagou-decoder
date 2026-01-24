export async function onRequestGet(context: any) {
  const { env, request } = context
  const clientId = env.GITHUB_CLIENT_ID
  if (!clientId) {
    return new Response('未配置 GitHub Client ID', { status: 500 })
  }

  const url = new URL(request.url)
  const apiOrigin = url.origin
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
    frontendUrl = apiOrigin.includes('localhost') || apiOrigin.includes('127.0.0.1')
      ? 'http://localhost:5173'
      : apiOrigin
  }

  const callbackUrl = `${apiOrigin}/api/auth/github/callback`
  const state = encodeURIComponent(frontendUrl)
  const redirect = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user:email&redirect_uri=${encodeURIComponent(callbackUrl)}&state=${state}`
  return Response.redirect(redirect, 302)
}
