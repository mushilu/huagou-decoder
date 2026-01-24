export interface Env {
  DB: D1Database
  AI: Ai
  JWT_SECRET: string
  GITHUB_CLIENT_ID: string
  GITHUB_CLIENT_SECRET: string
  RESEND_API_KEY: string
  ENVIRONMENT: string
}

export interface User {
  id: string
  email: string | null
  github_id: string | null
  nickname: string | null
  avatar: string | null
  created_at: number
  last_login: number | null
}

export interface Conversation {
  id: string
  user_id: string | null
  title: string | null
  created_at: number
  updated_at: number
}

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant'
  content: string
  source: 'local' | 'llm' | null
  created_at: number
}

export interface VerificationCode {
  id: string
  email: string
  code: string
  expires_at: number
  used: number
}
