import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authRoutes } from './routes/auth'
import { chatRoutes } from './routes/chat'
import type { Env } from './types'

const app = new Hono<{ Bindings: Env }>()

// CORS
app.use('*', cors({
  origin: (origin) => {
    if (!origin) return 'https://huagou-decoder.pages.dev'
    if (origin.includes('localhost')) return origin
    if (origin.endsWith('.huagou-decoder.pages.dev') || origin === 'https://huagou-decoder.pages.dev') return origin
    return null
  },
  credentials: true,
}))

// 健康检查
app.get('/', (c) => c.json({ status: 'ok', service: 'huagou-api' }))

// 路由
app.route('/api/auth', authRoutes)
app.route('/api/chat', chatRoutes)

export default app
