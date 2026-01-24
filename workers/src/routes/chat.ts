import { Hono } from 'hono'
import { jwtVerify } from 'jose'
import type { Env, User, Message } from '../types'
import { genId, now } from '../utils'

export const chatRoutes = new Hono<{ Bindings: Env }>()

// 本地知识库（简化版，实际从前端同步）
const localKnowledge: Record<string, string> = {
  '斗拱': '斗拱是中国古建筑特有的结构构件，位于柱顶与屋檐之间，由方形的斗和弓形的拱层层叠加而成。它不仅承担结构功能，还具有装饰作用，是中国古建筑等级的重要标志。',
  '飞檐': '飞檐是中国传统建筑屋顶的特色，指屋檐向外挑出并向上翘起的部分。它既能扩大采光面、利于排水，又能增加建筑的美感和气势。',
  '庑殿顶': '庑殿顶是中国古建筑中等级最高的屋顶形式，四面斜坡，有一条正脊和四条垂脊。故宫太和殿即采用重檐庑殿顶。',
  '歇山顶': '歇山顶是仅次于庑殿顶的屋顶形式，由正脊、垂脊、戗脊组成，前后两坡为整坡，左右两坡各分为两段。',
  '悬山顶': '悬山顶的特点是屋顶两侧伸出山墙之外，是民居常见的屋顶形式。',
  '硬山顶': '硬山顶的屋顶不伸出山墙，与山墙齐平，多用于北方民居。',
  '攒尖顶': '攒尖顶的屋顶各坡面汇聚于一点，常见于亭、阁、塔等建筑。',
}

// 搜索本地知识
function searchLocal(query: string): string | null {
  for (const [key, value] of Object.entries(localKnowledge)) {
    if (query.includes(key)) return value
  }
  return null
}

// 获取用户（可选）
async function getUser(c: any): Promise<User | null> {
  const auth = c.req.header('Authorization')
  if (!auth?.startsWith('Bearer ')) return null

  try {
    const secret = new TextEncoder().encode(c.env.JWT_SECRET || 'dev-secret')
    const { payload } = await jwtVerify(auth.slice(7), secret)
    return await c.env.DB.prepare('SELECT * FROM users WHERE id = ?')
      .bind(payload.sub).first<User>()
  } catch {
    return null
  }
}

// 检查游客限制
function checkGuestLimit(c: any): { allowed: boolean; remaining: number } {
  // 游客限制由前端localStorage控制，这里只做简单检查
  return { allowed: true, remaining: 5 }
}

// 发送消息
chatRoutes.post('/', async (c) => {
  try {
    const user = await getUser(c)
    const { message, conversation_id, context } = await c.req.json<{
      message: string
      conversation_id?: string
      context?: { building_id?: string; buildingId?: string; buildingName?: string }
    }>()

    if (!message?.trim()) {
      return c.json({ error: '消息不能为空' }, 400)
    }

    // 先搜本地知识库
    let reply = searchLocal(message)
    let source: 'local' | 'llm' = 'local'

    // 本地没有，调Workers AI
    if (!reply) {
      source = 'llm'
      const buildingName = context?.buildingName
      const systemPrompt = buildingName
        ? `你是一位中国古建筑专家，正在为用户讲解「${buildingName}」这座建筑的知识。
请用简洁易懂的语言回答，适合教育场景。
如果问题与${buildingName}相关，请结合这座建筑的特点来回答。
回答控制在200字以内。`
        : `你是一位中国古建筑专家，正在为用户讲解古建筑知识。
请用简洁易懂的语言回答，适合教育场景。
回答控制在200字以内。`

      try {
        const aiRes = await c.env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message },
          ],
        })
        reply = (aiRes as any).response || '抱歉，我暂时无法回答这个问题。'
      } catch (err) {
        console.error('AI调用失败:', err)
        reply = '抱歉，AI服务暂时不可用，请稍后再试。'
      }
    }

  // 保存对话（登录用户）
  let convId = conversation_id
  if (user) {
    if (!convId) {
      convId = genId()
      const title = message.slice(0, 20) + (message.length > 20 ? '...' : '')
      await c.env.DB.prepare(
        'INSERT INTO conversations (id, user_id, title, created_at, updated_at) VALUES (?, ?, ?, ?, ?)'
      ).bind(convId, user.id, title, now(), now()).run()
    } else {
      await c.env.DB.prepare('UPDATE conversations SET updated_at = ? WHERE id = ?')
        .bind(now(), convId).run()
    }

    // 保存消息
    const userMsgId = genId()
    const assistantMsgId = genId()
    const timestamp = now()

    await c.env.DB.batch([
      c.env.DB.prepare(
        'INSERT INTO messages (id, conversation_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)'
      ).bind(userMsgId, convId, 'user', message, timestamp),
      c.env.DB.prepare(
        'INSERT INTO messages (id, conversation_id, role, content, source, created_at) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(assistantMsgId, convId, 'assistant', reply, source, timestamp),
    ])
  }

  return c.json({ reply, source, conversation_id: convId })
  } catch (err) {
    console.error('Chat error:', err)
    return c.json({ error: '服务器内部错误', detail: String(err) }, 500)
  }
})

// 获取对话列表
chatRoutes.get('/conversations', async (c) => {
  const user = await getUser(c)
  if (!user) return c.json({ conversations: [] }, 401)

  const result = await c.env.DB.prepare(
    'SELECT * FROM conversations WHERE user_id = ? ORDER BY updated_at DESC LIMIT 50'
  ).bind(user.id).all()

  return c.json({ conversations: result.results })
})

// 获取对话详情
chatRoutes.get('/conversations/:id', async (c) => {
  const user = await getUser(c)
  if (!user) return c.json({ error: '未登录' }, 401)

  const convId = c.req.param('id')

  const conv = await c.env.DB.prepare(
    'SELECT * FROM conversations WHERE id = ? AND user_id = ?'
  ).bind(convId, user.id).first()

  if (!conv) return c.json({ error: '对话不存在' }, 404)

  const messages = await c.env.DB.prepare(
    'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC'
  ).bind(convId).all()

  return c.json({ conversation: conv, messages: messages.results })
})
