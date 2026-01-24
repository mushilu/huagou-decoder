const RAW_BASE = import.meta.env.VITE_API_URL
const isLocal = typeof window !== 'undefined' && (
  window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
)
const API_BASE = isLocal && RAW_BASE ? RAW_BASE.replace(/\/$/, '') : ''

async function parseAuthJson(res: Response) {
  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    throw new Error('登录服务异常')
  }
  return res.json()
}

export async function sendCode(email: string) {
  const res = await fetch(`${API_BASE}/api/auth/send-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  return parseAuthJson(res)
}

export async function verifyCode(email: string, code: string) {
  const res = await fetch(`${API_BASE}/api/auth/verify-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  })
  return parseAuthJson(res)
}

export function getGithubAuthUrl() {
  return `${API_BASE}/api/auth/github`
}

export async function getMe(token: string) {
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

export async function updateProfile(token: string, data: { nickname?: string; avatar?: string }) {
  const res = await fetch(`${API_BASE}/api/auth/profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })
  return res.json()
}

// 统一导出
export const authService = {
  sendCode,
  verifyCode,
  getGithubAuthUrl,
  getMe,
  updateProfile,
}
