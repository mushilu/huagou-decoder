import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, Database, Sparkles, Loader2 } from 'lucide-react'
import { useChatStore } from '@/stores/chatStore'
import { useAuthStore } from '@/stores/authStore'
import { sendMessage } from '@/services/chatService'

export function ChatBubble() {
  const [input, setInput] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { isOpen, toggle, messages, isLoading, conversationId, addMessage, setLoading, setConversationId } = useChatStore()
  const { token, canQuery, recordQuery } = useAuthStore()

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    if (!input.trim() || isLoading) return

    if (!canQuery()) {
      addMessage({ role: 'assistant', content: '今日免费次数已用完，请登录后继续使用。' })
      return
    }

    const userMsg = input.trim()
    setInput('')
    addMessage({ role: 'user', content: userMsg })
    setLoading(true)

    try {
      const res = await sendMessage({ message: userMsg, conversationId }, token)
      addMessage({ role: 'assistant', content: res.reply, source: res.source })
      setConversationId(res.conversation_id)
      recordQuery()
    } catch {
      addMessage({ role: 'assistant', content: '抱歉，请求失败，请稍后重试。' })
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Float Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="fixed bottom-6 right-6 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-ink-black to-ink-deep shadow-ink-lg transition-transform hover:scale-105"
            onClick={toggle}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <MessageCircle className="h-[22px] w-[22px] text-paper-white" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed bottom-6 right-6 z-40 flex w-[360px] flex-col overflow-hidden rounded-lg border border-gray-200 bg-paper-cream paper-layered"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between rounded-t-lg bg-gradient-to-b from-ink-black to-ink-deep px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gold">
                  <Bot className="h-[18px] w-[18px] text-ink-black" />
                </div>
                <span className="text-sm font-semibold text-paper-white">古建筑导览员</span>
              </div>
              <button
                onClick={toggle}
                className="text-paper-white/60 transition-colors hover:text-paper-white"
              >
                <X className="h-[18px] w-[18px]" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex h-[280px] flex-col gap-3.5 overflow-y-auto bg-paper-white p-3.5">
              {messages.length === 0 && (
                <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center">
                  <Sparkles className="h-7 w-7 text-gold" />
                  <p className="text-[13px] text-ink-gray">
                    你好！有什么关于古建筑的问题想问我吗？
                  </p>
                </div>
              )}

              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : ''}`}
                >
                  {msg.role === 'assistant' && (
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold">
                      <Bot className="h-3.5 w-3.5 text-ink-black" />
                    </div>
                  )}
                  <div
                    className={`max-w-[260px] px-3 py-2.5 ${
                      msg.role === 'user'
                        ? 'rounded-lg rounded-tr-none bg-ink-black text-paper-white'
                        : 'rounded-lg rounded-tl-none border border-gray-200 bg-paper-cream'
                    }`}
                  >
                    <p className="text-[13px] leading-relaxed">{msg.content}</p>
                    {msg.source && (
                      <div className="mt-2 flex items-center gap-1 text-[11px] text-ink-gray">
                        {msg.source === 'local' ? (
                          <>
                            <Database className="h-[11px] w-[11px]" />
                            来自本地知识库
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-[11px] w-[11px]" />
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
                  <div className="rounded-lg rounded-tl-none border border-gray-200 bg-paper-cream px-3 py-2.5">
                    <Loader2 className="h-4 w-4 animate-spin text-ink-gray" />
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="flex items-center gap-2 border-t border-gray-200 p-3">
              <div className="flex flex-1 items-center rounded-full border border-gray-200 bg-paper-white px-3.5 py-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入你的问题..."
                  className="flex-1 bg-transparent text-[13px] text-ink-black outline-none placeholder:text-gray-400"
                />
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-ink-black text-paper-white transition-colors hover:bg-ink-deep disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
