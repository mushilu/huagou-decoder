// API错误处理

export class APIError extends Error {
  code: string
  status: number
  details?: Record<string, unknown>

  constructor(code: string, status: number, details?: Record<string, unknown>) {
    super(`API Error: ${code}`)
    this.name = 'APIError'
    this.code = code
    this.status = status
    this.details = details
  }
}

// 处理API响应
export async function handleAPIResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({}))
    throw new APIError(
      error.code || 'UNKNOWN_ERROR',
      response.status,
      error
    )
  }
  return response.json()
}

// API调用包装
export async function apiCall<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })
    return handleAPIResponse<T>(response)
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError(
      'NETWORK_ERROR',
      0,
      { originalError: error }
    )
  }
}

// 获取错误消息
export function getErrorMessage(error: unknown): string {
  if (error instanceof APIError) {
    switch (error.code) {
      case 'NETWORK_ERROR':
        return '网络连接失败，请检查您的网络'
      case 'NOT_FOUND':
        return '请求的资源不存在'
      case 'UNAUTHORIZED':
        return '您需要登录才能继续'
      case 'FORBIDDEN':
        return '您没有权限访问此资源'
      case 'VALIDATION_ERROR':
        return '输入数据格式不正确'
      case 'SERVER_ERROR':
        return '服务器错误，请稍后重试'
      default:
        return error.message
    }
  }

  if (error instanceof Error) {
    return error.message
  }

  return '发生了一个未知错误'
}

// 重试机制
export async function retryAPICall<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: unknown

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error

      // 只在非客户端错误时重试
      if (error instanceof APIError && error.status >= 400 && error.status < 500) {
        throw error
      }

      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)))
      }
    }
  }

  throw lastError
}
