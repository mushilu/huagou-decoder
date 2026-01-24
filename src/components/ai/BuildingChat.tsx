import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, Send, Sparkles, Database, Loader2, MessageCircle } from 'lucide-react'
import { sendMessage } from '@/services/chatService'
import { useAuthStore } from '@/stores/authStore'
import type { Building } from '@/types/building'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  source?: 'local' | 'llm'
}

interface BuildingChatProps {
  building: Building
}

// 预设问题
const presetQuestions = [
  '这座建筑的屋顶样式是什么？',
  '它有什么独特的建筑特征？',
  '这座建筑的历史背景是什么？',
]

export function BuildingChat({ building }: BuildingChatProps) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const { token, canQuery, recordQuery } = useAuthStore()

  function addMessage(msg: Omit<Message, 'id'>) {
    setMessages((prev) => [...prev, { ...msg, id: Date.now().toString() }])
  }

  async function handleSend(question?: string) {
    const msg = question || input.trim()
    if (!msg || isLoading) return

    if (!canQuery()) {
      addMessage({ role: 'assistant', content: '今日免费次数已用完，请登录后继续使用。' })
      return
    }

    if (!question) setInput('')
    addMessage({ role: 'user', content: msg })
    setIsLoading(true)
    setIsExpanded(true)

    try {
      const res = await sendMessage(
        {
          message: msg,
          context: { buildingId: building.id, buildingName: building.nameZh },
        },
        token
      )
      addMessage({ role: 'assistant', content: res.reply, source: res.source })
      recordQuery()
    } catch (err) {
      console.error('Chat error:', err)
      addMessage({ role: 'assistant', content: '请求失败，请稍后重试。' })
    } finally {
      setIsLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="rounded-xl border border-gray-200 bg-[#f5f0e8] overflow-hidden shadow-lg"
    >
      {/* Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-ink-black to-ink-deep px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gold">
            <Bot className="h-5 w-5 text-ink-black" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-paper-white">AI导览员</h3>
            <p className="text-xs text-paper-white/60">关于「{building.nameZh}」的问答</p>
          </div>
        </div>
        <MessageCircle className="h-5 w-5 text-paper-white/40" />
      </div>

      {/* 预设问题 */}
      {messages.length === 0 && (
        <div className="p-4 border-b border-gray-200">
          <p className="text-xs text-ink-gray mb-3">你可能想问：</p>
          <div className="flex flex-wrap gap-2">
            {presetQuestions.map((q, i) => (
              <button
                key={i}
                onClick={() => handleSend(q)}
                disabled={isLoading}
                className="rounded-full border border-ink-gray/30 bg-paper-white px-3 py-1.5 text-xs text-ink-gray hover:border-gold hover:text-ink-black transition-colors disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 消息列表 */}
      <AnimatePresence>
        {isExpanded && messages.length > 0 && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="max-h-[300px] overflow-y-auto bg-paper-white p-4"
          >
            <div className="space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}>
                  {msg.role === 'assistant' && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold">
                      <Bot className="h-3.5 w-3.5 text-ink-black" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 ${
                      msg.role === 'user'
                        ? 'rounded-lg rounded-tr-none bg-ink-black text-paper-white'
                        : 'rounded-lg rounded-tl-none border border-gray-200 bg-[#f5f0e8]'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    {msg.source && (
                      <div className="mt-1.5 flex items-center gap-1 text-[10px] text-ink-gray/70">
                        {msg.source === 'local' ? (
                          <>
                            <Database className="h-2.5 w-2.5" />
                            本地知识库
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-2.5 w-2.5" />
                            AI生成
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-2">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold">
                    <Bot className="h-3.5 w-3.5 text-ink-black" />
                  </div>
                  <div className="rounded-lg rounded-tl-none border border-gray-200 bg-[#f5f0e8] px-3 py-2">
                    <Loader2 className="h-4 w-4 animate-spin text-ink-gray" />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 输入框 */}
      <div className="flex items-center gap-2 border-t border-gray-200 bg-paper-white p-3">
        <div className="flex flex-1 items-center rounded-full border border-gray-200 bg-[#f5f0e8] px-3.5 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={`询问关于${building.nameZh}的问题...`}
            className="flex-1 bg-transparent text-sm text-ink-black outline-none placeholder:text-gray-400"
          />
        </div>
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || isLoading}
          className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-black text-paper-white transition-colors hover:bg-ink-deep disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>
    </motion.div>
  )
}
