const RAW_BASE = import.meta.env.VITE_API_URL
const API_BASE = RAW_BASE ? RAW_BASE.replace(/\/$/, '') : ''

interface ChatRequest {
  message: string
  conversationId?: string | null
  context?: { buildingId?: string; buildingName?: string }
}

interface ChatResponse {
  reply: string
  source: 'local' | 'llm'
  conversation_id: string
}

export async function sendMessage(
  req: ChatRequest,
  token?: string | null
): Promise<ChatResponse> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      message: req.message,
      conversation_id: req.conversationId,
      context: req.context,
    }),
  })

  if (!res.ok) throw new Error('请求失败')
  return res.json()
}

export async function getConversations(token: string) {
  const res = await fetch(`${API_BASE}/api/chat/conversations`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}

export async function getConversation(id: string, token: string) {
  const res = await fetch(`${API_BASE}/api/chat/conversations/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return res.json()
}
