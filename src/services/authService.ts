const RAW_BASE = import.meta.env.VITE_API_URL
const API_BASE = RAW_BASE ? RAW_BASE.replace(/\/$/, '') : ''

export async function sendCode(email: string) {
  const res = await fetch(`${API_BASE}/api/auth/send-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  return res.json()
}

export async function verifyCode(email: string, code: string) {
  const res = await fetch(`${API_BASE}/api/auth/verify-code`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code }),
  })
  return res.json()
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
