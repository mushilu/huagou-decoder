interface ApiError {
  message?: string
}

interface ApiResponse {
  ok?: boolean
  error?: ApiError
}

async function parseError(res: Response) {
  try {
    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('application/json')) {
      return '接口不可用，请启动后端服务'
    }
    const data = (await res.json()) as ApiResponse
    return data.error?.message || '请求失败'
  } catch {
    return '请求失败'
  }
}

export async function getAdminSession() {
  const res = await fetch('/api/admin/session', { credentials: 'include' })
  if (!res.ok) return false
  const contentType = res.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) return false
  try {
    const data = (await res.json()) as ApiResponse
    return Boolean(data.ok)
  } catch {
    return false
  }
}

export async function loginAdmin(password: string) {
  const res = await fetch('/api/admin/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ password }),
  })

  if (!res.ok) {
    throw new Error(await parseError(res))
  }
}

export async function logoutAdmin() {
  const res = await fetch('/api/admin/logout', {
    method: 'POST',
    credentials: 'include',
  })

  if (!res.ok) {
    throw new Error(await parseError(res))
  }
}
