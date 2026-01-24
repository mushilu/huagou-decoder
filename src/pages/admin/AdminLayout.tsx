import { useEffect, useState, type ComponentType } from 'react'
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LayoutGrid, Landmark, KeyRound, Puzzle, LogOut, Sparkles, ScrollText, Users } from 'lucide-react'
import { getAdminSession, logoutAdmin } from '@/api/admin'
import { SealStamp } from '@/components/ink/PaperCard'

const navItems = [
  { path: '/admin', label: '概览', description: '整体概况与发布节奏', icon: LayoutGrid },
  { path: '/admin/content', label: '页面内容', description: '前台文案与图片管理', icon: ScrollText },
  { path: '/admin/buildings', label: '建筑管理', description: '建筑档案与图文校准', icon: Landmark },
  { path: '/admin/cipher', label: '密码知识', description: '文化知识与标签分类', icon: KeyRound },
  { path: '/admin/decoder', label: '解码挑战', description: '挑战配置与提示管理', icon: Puzzle },
  { path: '/admin/users', label: '用户管理', description: '注册用户与权限管理', icon: Users },
]

export function AdminLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const [checking, setChecking] = useState(true)

  useEffect(() => {
    let active = true
    getAdminSession()
      .then((ok) => {
        if (!active) return
        if (!ok) {
          const redirect = encodeURIComponent(`${location.pathname}${location.search}`)
          navigate(`/admin/login?redirect=${redirect}`, { replace: true })
          return
        }
        setChecking(false)
      })
      .catch(() => {
        if (!active) return
        const redirect = encodeURIComponent(`${location.pathname}${location.search}`)
        navigate(`/admin/login?redirect=${redirect}`, { replace: true })
      })

    return () => {
      active = false
    }
  }, [location.pathname, location.search, navigate])

  async function handleLogout() {
    try {
      await logoutAdmin()
    } catch {
      // 忽略退出失败
    } finally {
      navigate('/admin/login', { replace: true })
    }
  }

  if (checking) {
    return (
      <div className="min-h-screen bg-paper-white flex items-center justify-center">
        <div className="text-sm text-ink-gray">正在核验管理权限...</div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-paper-white">
      <div className="absolute inset-0 bg-gradient-to-br from-paper-white via-paper-cream to-paper-white" />
      <div className="absolute inset-x-0 top-0 h-40 pattern-cloud pattern-animated opacity-40" />
      <div className="absolute inset-x-0 bottom-0 h-40 pattern-wave pattern-animated opacity-35" />
      <div className="absolute -left-24 top-20 h-64 w-64 rounded-full bg-ink-black/5 blur-3xl animate-ink-float" />
      <div className="absolute right-[-120px] bottom-12 h-72 w-72 rounded-full bg-vermilion/10 blur-3xl animate-ink-float" />

      <div className="relative z-10 flex min-h-screen">
        {/* 侧边栏 */}
        <aside className="paper-texture flex w-72 flex-col border-r border-ink-gray/15 bg-paper-cream/95 backdrop-blur">
          <div className="px-6 pt-6">
            <div className="flex items-center gap-4">
              <SealStamp text="CMS" size="sm" color="vermilion" className="shadow-ink" />
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.4em] text-ink-gray/70">
                  HUA GOU
                </p>
                <h1 className="font-serif text-xl font-bold text-ink-black">华构解码 CMS</h1>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-ink-gray/15 bg-paper-white/80 px-4 py-3 text-xs text-ink-gray/70 shadow-ink">
              <div className="flex items-center gap-2 font-semibold text-ink-black">
                <Sparkles className="h-4 w-4 text-gold" />
                管理提示
              </div>
              <p className="mt-2 leading-relaxed">
                保持内容一致与节奏稳定，让华构解码呈现更可信的历史质感。
              </p>
            </div>
          </div>

          <nav className="mt-6 space-y-2 px-4">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path
              const Icon = item.icon
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                    isActive
                      ? 'bg-ink-black text-paper-white shadow-ink-lg'
                      : 'text-ink-black hover:bg-ink-black/5'
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                      isActive
                        ? 'bg-paper-white/10 text-paper-white'
                        : 'bg-ink-black/5 text-ink-black group-hover:bg-ink-black/10'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold tracking-wide">{item.label}</div>
                    <div
                      className={`text-xs ${
                        isActive ? 'text-paper-white/70' : 'text-ink-gray/70'
                      }`}
                    >
                      {item.description}
                    </div>
                  </div>
                  <span
                    className={`h-2 w-2 rounded-full ${
                      isActive ? 'bg-gold' : 'bg-ink-gray/30 group-hover:bg-gold/60'
                    }`}
                  />
                </Link>
              )
            })}
          </nav>

          <div className="mt-auto px-6 pb-6 pt-8">
            <div className="rounded-2xl border border-ink-gray/15 bg-paper-white/80 p-4 shadow-ink">
              <button
                onClick={handleLogout}
                className="flex w-full items-center justify-between rounded-xl border border-ink-gray/20 px-3 py-2 text-xs font-semibold text-ink-black transition hover:border-vermilion/40 hover:text-vermilion"
              >
                退出登录
                <LogOut className="h-4 w-4" />
              </button>
              <Link
                to="/"
                className="mt-3 block text-center text-xs text-ink-gray/70 hover:text-ink-black"
              >
                ← 返回前台
              </Link>
            </div>
          </div>
        </aside>

        {/* 主内容 */}
        <main className="flex-1 px-8 py-10">
          <div className="mx-auto w-full max-w-6xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

// 概览页
export function AdminDashboard() {
  const stats = [
    {
      title: '建筑数量',
      value: '14',
      subtitle: '已归档建筑',
      icon: Landmark,
      accent: 'from-gold/25 to-paper-white',
    },
    {
      title: '密码知识',
      value: '20',
      subtitle: '知识条目',
      icon: KeyRound,
      accent: 'from-ink-black/10 to-paper-white',
    },
    {
      title: '解码挑战',
      value: '25',
      subtitle: '挑战关卡',
      icon: Puzzle,
      accent: 'from-vermilion/15 to-paper-white',
    },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-ink-gray/60">
            CMS 控制台
          </p>
          <h2 className="mt-2 font-serif text-3xl font-bold text-ink-black">管理后台</h2>
          <p className="mt-2 text-sm text-ink-gray/70">
            统一管理建筑档案、文化密码与解码挑战，保证内容发布的稳定节奏。
          </p>
        </div>
        <div className="rounded-full border border-ink-gray/20 bg-paper-white/80 px-4 py-2 text-xs font-semibold text-ink-black shadow-ink">
          今日建议：优先检查新增资料的图文一致性
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {stats.map((item) => (
          <StatCard key={item.title} {...item} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-ink-gray/15 bg-paper-white/90 p-6 shadow-ink-lg">
          <h3 className="font-serif text-xl font-bold text-ink-black">发布节奏</h3>
          <p className="mt-2 text-sm text-ink-gray/70">
            建议将大型建筑档案按朝代分批更新，同时同步密码知识的引用标签，增强检索关联度。
          </p>
          <div className="mt-5 flex flex-wrap gap-2 text-xs">
            {['档案统一命名', '图片分辨率检查', '重点条目置顶'].map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-ink-gray/20 bg-paper-cream px-3 py-1 font-semibold text-ink-black"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-ink-gray/15 bg-gradient-to-br from-ink-black to-ink-deep p-6 text-paper-white shadow-ink-lg">
          <h3 className="font-serif text-xl font-bold">管理提醒</h3>
          <p className="mt-2 text-sm text-paper-white/75">
            登录信息仅在内庭流转。建议每周更新口令并核对关键建筑的文化释义。
          </p>
          <div className="mt-5 space-y-2 text-xs text-paper-white/70">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gold" />
              每次发布前检查图片对应路径
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-gold" />
              解码挑战提示保持清晰且统一语气
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  accent,
}: {
  title: string
  value: string
  subtitle: string
  icon: ComponentType<{ className?: string }>
  accent: string
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-ink-gray/15 bg-paper-white/90 p-5 shadow-ink">
      <div className={`absolute right-0 top-0 h-24 w-24 rounded-full bg-gradient-to-br ${accent} opacity-70`} />
      <div className="relative z-10 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-gray/60">{title}</p>
          <p className="mt-2 font-serif text-3xl font-bold text-ink-black">{value}</p>
          <p className="mt-1 text-xs text-ink-gray/70">{subtitle}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-ink-black/5 text-ink-black">
          <Icon className="h-6 w-6" />
        </div>
      </div>
    </div>
  )
}
