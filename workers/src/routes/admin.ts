import { Hono } from 'hono'
import type { Env, User } from '../types'

export const adminRoutes = new Hono<{ Bindings: Env }>()

// 简单的 admin token 验证
async function verifyAdmin(c: any): Promise<boolean> {
  const auth = c.req.header('Authorization')
  if (!auth?.startsWith('Bearer ')) return false

  const token = auth.slice(7)
  // 支持 admin token 或者检查 session
  const adminToken = c.env.ADMIN_TOKEN || 'huagou-admin'
  return token === adminToken
}

// 获取所有用户
adminRoutes.get('/users', async (c) => {
  if (!(await verifyAdmin(c))) {
    return c.json({ success: false, message: '无权访问' }, 401)
  }

  try {
    const result = await c.env.DB.prepare(
      'SELECT id, email, github_id, nickname, avatar, created_at, last_login FROM users ORDER BY created_at DESC'
    ).all<User>()

    return c.json({ success: true, users: result.results })
  } catch (e) {
    return c.json({ success: false, message: '查询失败' }, 500)
  }
})

// 删除用户
adminRoutes.delete('/users/:id', async (c) => {
  if (!(await verifyAdmin(c))) {
    return c.json({ success: false, message: '无权访问' }, 401)
  }

  const userId = c.req.param('id')

  try {
    // 先删除用户相关的数据
    await c.env.DB.prepare('DELETE FROM messages WHERE conversation_id IN (SELECT id FROM conversations WHERE user_id = ?)')
      .bind(userId).run()
    await c.env.DB.prepare('DELETE FROM conversations WHERE user_id = ?')
      .bind(userId).run()
    await c.env.DB.prepare('DELETE FROM users WHERE id = ?')
      .bind(userId).run()

    return c.json({ success: true })
  } catch (e) {
    return c.json({ success: false, message: '删除失败' }, 500)
  }
})

// 获取用户统计
adminRoutes.get('/stats', async (c) => {
  if (!(await verifyAdmin(c))) {
    return c.json({ success: false, message: '无权访问' }, 401)
  }

  try {
    const usersCount = await c.env.DB.prepare('SELECT COUNT(*) as count FROM users').first<{ count: number }>()
    const conversationsCount = await c.env.DB.prepare('SELECT COUNT(*) as count FROM conversations').first<{ count: number }>()
    const messagesCount = await c.env.DB.prepare('SELECT COUNT(*) as count FROM messages').first<{ count: number }>()

    return c.json({
      success: true,
      stats: {
        users: usersCount?.count || 0,
        conversations: conversationsCount?.count || 0,
        messages: messagesCount?.count || 0,
      },
    })
  } catch (e) {
    return c.json({ success: false, message: '查询失败' }, 500)
  }
})
