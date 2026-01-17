import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, ShieldCheck, Sparkles } from 'lucide-react'
import { loginAdmin, getAdminSession } from '@/api/admin'
import { PaperCard, PaperCardContent, PaperCardFooter, PaperCardHeader, SealStamp } from '@/components/ink/PaperCard'

const featureItems = [
  {
    title: '内容校准',
    description: '建筑、密码与解码挑战统一管理，保证信息一致性。',
  },
  {
    title: '安全发布',
    description: '草稿与发布状态分离，公开内容始终保持可控。',
  },
  {
    title: '细节把控',
    description: '图文素材、标签与地图信息集中校验，让呈现更可靠。',
  },
]

export function AdminLoginPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const redirectTarget = useMemo(() => searchParams.get('redirect') || '/admin', [searchParams])

  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    let active = true
    getAdminSession()
      .then((ok) => {
        if (!active) return
        if (ok) {
          navigate(redirectTarget, { replace: true })
        } else {
          setIsChecking(false)
        }
      })
      .catch(() => {
        if (!active) return
        setIsChecking(false)
      })

    return () => {
      active = false
    }
  }, [navigate, redirectTarget])

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!password || isSubmitting) return

    setIsSubmitting(true)
    setError('')
    try {
      await loginAdmin(password)
      window.location.href = redirectTarget
    } catch (err) {
      const message = err instanceof Error ? err.message : '登录失败，请稍后重试'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isChecking) {
    return (
      <div className="min-h-screen bg-paper-white flex items-center justify-center">
        <div className="text-sm text-ink-gray">正在验证身份...</div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-paper-white">
      <div className="absolute inset-0 bg-gradient-to-br from-paper-white via-paper-cream to-paper-white" />
      <div className="absolute inset-x-0 top-0 h-40 pattern-cloud pattern-animated opacity-40" />
      <div className="absolute inset-x-0 bottom-0 h-40 pattern-wave pattern-animated opacity-40" />
      <div className="absolute -left-24 top-24 h-72 w-72 rounded-full bg-ink-black/5 blur-3xl animate-ink-float" />
      <div className="absolute right-[-120px] bottom-10 h-80 w-80 rounded-full bg-vermilion/10 blur-3xl animate-ink-float" />
      <div className="absolute left-1/2 top-16 h-28 w-28 -translate-x-1/2 rounded-full pattern-ruyi opacity-40" />
      <div className="absolute right-12 top-32 h-24 w-24 rounded-full pattern-ruyi opacity-30" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col gap-12 px-6 py-16 lg:flex-row lg:items-center lg:justify-between">
        <motion.section
          className="flex-1 space-y-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-ink-gray/20 bg-paper-white/80 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-ink-gray">
            <Sparkles className="h-4 w-4 text-gold" />
            审核 · 归档 · 管理
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <SealStamp text="认证" color="vermilion" />
              <div>
                <p className="text-sm text-ink-gray/70">华构解码 · 管理入口</p>
                <h1 className="font-serif text-4xl md:text-5xl font-bold text-ink-black">
                  墨印守门，精细控管
                </h1>
              </div>
            </div>
            <p className="max-w-xl text-base md:text-lg text-ink-gray leading-relaxed">
              这里是内容管理的内庭。完成认证后，你可以安全地整理建筑档案、维护文化密码，并发布结构解码挑战。
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {featureItems.map((item, index) => (
              <motion.div
                key={item.title}
                className="rounded-2xl border border-ink-gray/10 bg-paper-white/80 p-4 shadow-ink backdrop-blur-sm"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + index * 0.1 }}
              >
                <h3 className="font-serif text-lg font-bold text-ink-black">{item.title}</h3>
                <p className="mt-2 text-sm text-ink-gray/80 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        <motion.section
          className="w-full max-w-md"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
        >
          <PaperCard variant="layered" hoverEffect={false} className="overflow-visible">
            <PaperCardHeader className="relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-ink-black/5 via-transparent to-vermilion/10" />
              <div className="relative z-10 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-black text-paper-white shadow-ink">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h2 className="font-serif text-2xl font-bold text-ink-black">身份验证</h2>
                  <p className="text-sm text-ink-gray/70">仅授权成员可进入管理内庭</p>
                </div>
              </div>
            </PaperCardHeader>
            <PaperCardContent>
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-semibold text-ink-black">
                    管理口令
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-gray/60" />
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      className="w-full rounded-xl border border-ink-gray/20 bg-paper-white/80 py-3 pl-10 pr-4 text-sm text-ink-black shadow-inner focus:border-ink-black/40 focus:outline-none focus:ring-2 focus:ring-ink-black/10"
                      placeholder="输入管理员口令"
                      autoComplete="current-password"
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-lg border border-vermilion/30 bg-vermilion/10 px-3 py-2 text-xs text-vermilion">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={!password || isSubmitting}
                  className="w-full rounded-xl bg-gradient-to-r from-ink-black to-ink-deep px-5 py-3 text-sm font-semibold text-paper-white shadow-ink transition-all duration-200 hover:shadow-ink-lg hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? '正在验证...' : '进入管理后台'}
                </button>
              </form>
            </PaperCardContent>
            <PaperCardFooter className="flex items-center justify-between text-xs text-ink-gray/70">
              <span>若无口令，请联系项目管理员</span>
              <a className="text-ink-black hover:text-vermilion transition-colors" href="/">
                返回前台
              </a>
            </PaperCardFooter>
          </PaperCard>
        </motion.section>
      </div>
    </div>
  )
}
