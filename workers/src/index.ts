import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { authRoutes } from './routes/auth'
import { chatRoutes } from './routes/chat'
import type { Env } from './types'

const app = new Hono<{ Bindings: Env }>()

// CORS
app.use('*', cors({
  origin: ['http://localhost:5173', 'http://localhost:4173'],
  credentials: true,
}))

// 健康检查
app.get('/', (c) => c.json({ status: 'ok', service: 'huagou-api' }))

// 路由
app.route('/api/auth', authRoutes)
app.route('/api/chat', chatRoutes)

export default app
