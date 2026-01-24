import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Loader2, ArrowLeft, Volume2, VolumeX, Sparkles } from 'lucide-react'
import { OrbitControls, ContactShadows, Float } from '@react-three/drei'
import { Link } from 'react-router-dom'
import { SceneManager } from '@/three/core/SceneManager'
import { Guide3D } from '@/three/components/Guide3D'
import { sendMessage } from '@/services/chatService'
import { Button } from '@/components/ui/button'
import { CloudPattern } from '@/components/moyu-guji/patterns'
import { useAuthStore } from '@/stores/authStore'

interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// 预设问题
const presetQuestions = [
  '什么是斗拱？',
  '古建筑的屋顶有哪些类型？',
  '故宫太和殿有什么特点？',
  '飞檐是如何制作的？',
]

export function GuidePage() {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isTalking, setIsTalking] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { token } = useAuthStore()

  // 滚动到最新消息
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 发送消息
  const handleSend = async (text?: string) => {
    const msg = text || input.trim()
    if (!msg || loading) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: msg,
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)
    setIsTalking(true)

    try {
      const res = await sendMessage({ message: msg }, token)
      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: res.reply,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMsg])
    } catch {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，我暂时无法回答这个问题，请稍后再试。',
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMsg])
    } finally {
      setLoading(false)
      // 模拟说话时间
      setTimeout(() => setIsTalking(false), 2000)
    }
  }

  // 处理按下回车
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-paper-cream to-paper-white overflow-hidden">
      {/* 背景装饰 */}
      <CloudPattern position="top" opacity={0.15} />
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-64 h-64 bg-glaze-blue/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-vermilion/10 rounded-full blur-3xl" />
      </div>

      {/* 顶部导航 */}
      <div className="relative z-20 border-b border-ink-gray/10 bg-paper-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center gap-2 text-ink-gray hover:text-ink-black transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="text-sm font-medium">返回首页</span>
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="font-serif text-xl font-bold text-ink-black flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold" />
              AI 导游
            </h1>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="p-2 rounded-full hover:bg-ink-gray/10 transition-colors"
              title={soundEnabled ? '关闭声音' : '开启声音'}
            >
              {soundEnabled ? (
                <Volume2 className="w-5 h-5 text-ink-gray" />
              ) : (
                <VolumeX className="w-5 h-5 text-ink-gray/50" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* 主体内容 */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8 h-[calc(100vh-180px)]">
          {/* 左侧：3D场景 */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative rounded-3xl overflow-hidden border border-ink-gray/20 shadow-2xl bg-gradient-to-br from-paper-cream via-paper-white to-glaze-blue/5"
          >
            {/* 场景标签 */}
            <div className="absolute top-4 left-4 z-10 px-3 py-1.5 rounded-full bg-paper-white/90 backdrop-blur-sm border border-ink-gray/20 shadow-sm">
              <span className="text-xs font-medium text-ink-gray">3D 虚拟导游</span>
            </div>

            {/* 3D Canvas */}
            <SceneManager
              className="w-full h-full"
              environment={null}
              shadows
              camera={{ position: [0, 0.5, 2.5], fov: 35 }}
            >
              {/* 补充光照 */}
              <pointLight position={[2, 3, 2]} intensity={0.6} color="#fff5e6" />
              <pointLight position={[-2, 2, -1]} intensity={0.4} color="#e6f0ff" />
              <spotLight position={[0, 3, 1]} intensity={0.5} angle={0.5} penumbra={0.5} />

              {/* 导游角色 */}
              <Float
                speed={1.2}
                rotationIntensity={0.05}
                floatIntensity={0.15}
                floatingRange={[-0.02, 0.02]}
              >
                <Guide3D
                  position={[0, -0.35, 0]}
                  scale={0.85}
                  isTalking={isTalking}
                  showSpeechBubble={messages.length === 0}
                  speechText="你好！我是古建筑AI导游，有什么问题可以问我哦~"
                />
              </Float>

              {/* 地面阴影 */}
              <ContactShadows
                position={[0, -0.01, 0]}
                opacity={0.4}
                scale={5}
                blur={2}
                far={4}
              />

              {/* 轨道控制 */}
              <OrbitControls
                enablePan={false}
                enableZoom={false}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 2}
                minAzimuthAngle={-Math.PI / 4}
                maxAzimuthAngle={Math.PI / 4}
              />
            </SceneManager>

            {/* 底部渐变 */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-paper-white/50 to-transparent pointer-events-none" />
          </motion.div>

          {/* 右侧：对话界面 */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col rounded-3xl border border-ink-gray/20 shadow-xl bg-paper-white overflow-hidden"
          >
            {/* 对话头部 */}
            <div className="flex-shrink-0 px-6 py-4 border-b border-ink-gray/10 bg-gradient-to-r from-glaze-blue/5 to-transparent">
              <h2 className="font-serif text-lg font-bold text-ink-black">
                与导游对话
              </h2>
              <p className="text-sm text-ink-gray mt-1">
                问我任何关于中国古建筑的问题
              </p>
            </div>

            {/* 消息列表 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-glaze-blue/20 to-vermilion/20 flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-glaze-blue" />
                  </div>
                  <p className="text-ink-gray mb-6">开始和导游聊天吧！</p>

                  {/* 预设问题 */}
                  <div className="grid gap-2 w-full max-w-sm">
                    {presetQuestions.map((q) => (
                      <button
                        key={q}
                        onClick={() => handleSend(q)}
                        className="px-4 py-2.5 text-sm text-left rounded-xl border border-ink-gray/20 bg-paper-cream/50 hover:bg-glaze-blue/10 hover:border-glaze-blue/30 transition-colors"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <>
                  <AnimatePresence>
                    {messages.map((msg) => (
                      <motion.div
                        key={msg.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                            msg.role === 'user'
                              ? 'bg-glaze-blue text-paper-white rounded-br-md'
                              : 'bg-paper-cream border border-ink-gray/10 text-ink-black rounded-bl-md'
                          }`}
                        >
                          <p className="text-sm leading-relaxed whitespace-pre-wrap">
                            {msg.content}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>

                  {/* 加载指示 */}
                  {loading && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="flex justify-start"
                    >
                      <div className="px-4 py-3 rounded-2xl bg-paper-cream border border-ink-gray/10 rounded-bl-md">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-glaze-blue" />
                          <span className="text-sm text-ink-gray">导游正在思考...</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                  <div ref={messagesEndRef} />
                </>
              )}
            </div>

            {/* 输入区域 */}
            <div className="flex-shrink-0 p-4 border-t border-ink-gray/10 bg-paper-cream/30">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="输入你的问题..."
                  className="flex-1 px-4 py-3 rounded-xl border border-ink-gray/20 bg-paper-white focus:outline-none focus:ring-2 focus:ring-glaze-blue/30 focus:border-glaze-blue/50 transition-all text-sm"
                  disabled={loading}
                />
                <Button
                  onClick={() => handleSend()}
                  disabled={!input.trim() || loading}
                  className="px-6 rounded-xl bg-glaze-blue hover:bg-glaze-blue/90 text-paper-white shadow-lg shadow-glaze-blue/20"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Send className="w-5 h-5" />
                  )}
                </Button>
              </div>

              {/* 快捷问题 */}
              {messages.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {presetQuestions.slice(0, 2).map((q) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      disabled={loading}
                      className="px-3 py-1.5 text-xs rounded-full border border-ink-gray/20 bg-paper-white hover:bg-glaze-blue/10 hover:border-glaze-blue/30 transition-colors disabled:opacity-50"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
