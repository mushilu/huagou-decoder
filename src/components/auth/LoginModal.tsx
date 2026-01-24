import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Github, KeyRound, Loader2, LogIn, ShieldCheck } from 'lucide-react'
import { useAuthStore } from '@/stores/authStore'
import { sendCode, verifyCode, getGithubAuthUrl } from '@/services/authService'

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

type Tab = 'email' | 'github'

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [tab, setTab] = useState<Tab>('email')
  const [email, setEmail] = useState('')
  const [code, setCode] = useState('')
  const [sending, setSending] = useState(false)
  const [verifying, setVerifying] = useState(false)
  const [codeSent, setCodeSent] = useState(false)
  const [error, setError] = useState('')
  const [countdown, setCountdown] = useState(0)
  const [hint, setHint] = useState('')

  const { setUser, setToken, guestQueries, lastQueryDate } = useAuthStore()

  const today = new Date().toDateString()
  const remaining = lastQueryDate === today ? 5 - guestQueries : 5

  async function handleSendCode() {
    if (!email || sending) return
    setError('')
    setSending(true)

    try {
      const res = await sendCode(email)
      if (res.success) {
        setCodeSent(true)
        setHint(res.debug ? `备用验证码：${res.debug}` : '')
        setCountdown(60)
        const timer = setInterval(() => {
          setCountdown((c) => {
            if (c <= 1) {
              clearInterval(timer)
              return 0
            }
            return c - 1
          })
        }, 1000)
      } else {
        setError(res.message || '发送失败')
      }
    } catch {
      setError('网络错误')
    } finally {
      setSending(false)
    }
  }

  async function handleVerify() {
    if (!code || verifying) return
    setError('')
    setVerifying(true)

    try {
      const res = await verifyCode(email, code)
      if (res.success) {
        setToken(res.token)
        setUser(res.user)
        onClose()
      } else {
        setError(res.message || '验证失败')
      }
    } catch {
      setError('网络错误')
    } finally {
      setVerifying(false)
    }
  }

  function handleGithub() {
    window.location.href = getGithubAuthUrl()
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 bg-ink-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-[400px] -translate-x-1/2 -translate-y-1/2 px-4"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
          >
            <div className="overflow-hidden rounded-lg border border-gray-200 shadow-xl" style={{ backgroundColor: '#ffffff' }}>
              {/* Header */}
              <div className="flex items-center gap-3 border-b border-gray-100 px-6 py-5">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-ink-black shadow-ink">
                  <ShieldCheck className="h-6 w-6 text-paper-white" />
                </div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-ink-black">身份验证</h2>
                  <p className="text-[13px] text-ink-gray">登录以解锁完整功能</p>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-5 p-6">
                {/* Tabs */}
                <div className="flex gap-1 rounded-md bg-gray-100 p-1">
                  <button
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded py-2 text-[13px] font-medium transition-all ${
                      tab === 'email'
                        ? 'bg-white text-ink-black shadow-sm'
                        : 'text-ink-gray hover:text-ink-black'
                    }`}
                    onClick={() => setTab('email')}
                  >
                    <Mail className="h-3.5 w-3.5" />
                    邮箱登录
                  </button>
                  <button
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded py-2 text-[13px] font-medium transition-all ${
                      tab === 'github'
                        ? 'bg-white text-ink-black shadow-sm'
                        : 'text-ink-gray hover:text-ink-black'
                    }`}
                    onClick={() => setTab('github')}
                  >
                    <Github className="h-3.5 w-3.5" />
                    GitHub
                  </button>
                </div>

                {tab === 'email' ? (
                  <div className="space-y-4">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold text-ink-black">邮箱地址</label>
                      <div className="flex items-center gap-2.5 rounded-md border border-gray-200 bg-paper-ivory px-3.5 py-2.5">
                        <Mail className="h-4 w-4 text-ink-gray" />
                        <input
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="your@email.com"
                          className="flex-1 bg-transparent text-sm text-ink-black outline-none placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    {/* Code */}
                    <div className="space-y-1.5">
                      <label className="text-[13px] font-semibold text-ink-black">验证码</label>
                      <div className="flex gap-2.5">
                        <div className="flex flex-1 items-center gap-2.5 rounded-md border border-gray-200 bg-paper-ivory px-3.5 py-2.5">
                          <KeyRound className="h-4 w-4 text-ink-gray" />
                          <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            placeholder="6位验证码"
                            maxLength={6}
                            className="flex-1 bg-transparent text-sm text-ink-black outline-none placeholder:text-gray-400"
                          />
                        </div>
                        <button
                          onClick={handleSendCode}
                          disabled={!email || sending || countdown > 0}
                          className="shrink-0 rounded-md bg-gray-100 px-3 py-2.5 text-xs font-medium text-ink-black transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {sending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : countdown > 0 ? (
                            `${countdown}s`
                          ) : codeSent ? (
                            '重新发送'
                          ) : (
                            '发送验证码'
                          )}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div className="rounded-md border border-vermilion/30 bg-vermilion/10 px-3 py-2 text-xs text-vermilion">
                        {error}
                      </div>
                    )}
                    {hint && !error && (
                      <div className="rounded-md border border-ink-gray/20 bg-paper-ivory px-3 py-2 text-xs text-ink-gray">
                        {hint}
                      </div>
                    )}

                    <button
                      onClick={handleVerify}
                      disabled={!email || !code || verifying}
                      className="flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-b from-ink-black to-ink-deep py-2.5 text-sm font-semibold text-paper-white shadow-ink transition-all hover:shadow-ink-lg disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {verifying ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <LogIn className="h-4 w-4" />
                      )}
                      登录
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <button
                      onClick={handleGithub}
                      className="flex w-full items-center justify-center gap-2.5 rounded-md bg-[#24292e] py-3 text-sm font-semibold text-white transition-all hover:bg-[#1b1f23]"
                    >
                      <Github className="h-5 w-5" />
                      使用 GitHub 登录
                    </button>
                    <p className="text-center text-xs text-ink-gray">将跳转至 GitHub 进行授权</p>
                  </div>
                )}

                {/* Divider */}
                <div className="flex items-center gap-3">
                  <div className="h-px flex-1 bg-gray-200" />
                  <span className="text-xs text-ink-gray">或</span>
                  <div className="h-px flex-1 bg-gray-200" />
                </div>

                {/* Guest info */}
                <p className="text-center text-xs text-ink-gray">
                  游客每日可免费提问 <span className="font-semibold text-vermilion">{remaining}次</span>
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-4 text-[11px] text-ink-gray">
                <span>登录即表示同意服务条款</span>
                <button onClick={onClose} className="font-medium text-ink-black hover:text-vermilion">
                  关闭
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
