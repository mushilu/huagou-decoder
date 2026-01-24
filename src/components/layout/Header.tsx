import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, Heart, Sparkles, User, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/search/SearchBar'
import { useAppStore } from '@/stores/appStore'
import { useAuthStore } from '@/stores/authStore'
import { LoginModal } from '@/components/auth/LoginModal'

export function Header() {
  const { toggleSidebar } = useAppStore()
  const { user, logout } = useAuthStore()
  const [showLogin, setShowLogin] = useState(false)
  const [showMenu, setShowMenu] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-ink-gray/20 bg-paper-white/95 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Logo & Nav Toggle */}
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleSidebar}
              aria-label="Toggle navigation"
            >
              <Menu className="h-5 w-5" />
            </Button>

            <Link to="/" className="flex items-center gap-2">
              <span className="font-serif text-2xl font-bold text-ink-black">
                华构解码
              </span>
              <span className="hidden text-sm text-ink-gray sm:inline">
                China Architecture Decoded
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="hidden items-center gap-6 md:flex">
            <Link
              to="/codex"
              className="text-sm font-medium text-ink-black hover:text-vermilion transition-colors"
            >
              建筑图鉴
            </Link>
            <Link
              to="/decoder"
              className="text-sm font-medium text-ink-black hover:text-vermilion transition-colors"
            >
              结构解码
            </Link>
            <Link
              to="/cipher"
              className="text-sm font-medium text-ink-black hover:text-vermilion transition-colors"
            >
              文化密码
            </Link>
            <Link
              to="/immersive"
              className="text-sm font-medium text-ink-black hover:text-vermilion transition-colors"
            >
              沉浸漫游
            </Link>
            <Link
              to="/dataviz"
              className="text-sm font-medium text-ink-black hover:text-vermilion transition-colors"
            >
              数据可视
            </Link>
            <Link
              to="/guide"
              className="text-sm font-medium text-ink-black hover:text-vermilion transition-colors flex items-center gap-1"
            >
              <Sparkles className="h-3.5 w-3.5 text-gold" />
              AI导游
            </Link>
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:block">
              <SearchBar />
            </div>

            <Button variant="ghost" size="icon" aria-label="收藏">
              <Heart className="h-5 w-5" />
            </Button>

            {/* 用户登录/头像 */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="flex items-center gap-2 rounded-full border border-ink-gray/20 bg-paper-cream px-3 py-1.5 hover:bg-paper-cream/80 transition-colors"
                >
                  {user.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.nickname || '用户'}
                      className="h-6 w-6 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-6 w-6 rounded-full bg-glaze-blue/20 flex items-center justify-center">
                      <User className="h-3.5 w-3.5 text-glaze-blue" />
                    </div>
                  )}
                  <span className="text-sm font-medium text-ink-black max-w-[80px] truncate">
                    {user.nickname || user.email?.split('@')[0] || '用户'}
                  </span>
                </button>

                {/* 下拉菜单 */}
                {showMenu && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setShowMenu(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-ink-gray/20 bg-paper-white shadow-lg z-50 overflow-hidden">
                      <div className="px-4 py-3 border-b border-ink-gray/10">
                        <p className="text-sm font-medium text-ink-black truncate">
                          {user.nickname || user.email?.split('@')[0]}
                        </p>
                        <p className="text-xs text-ink-gray truncate">{user.email}</p>
                      </div>
                      <Link
                        to="/profile"
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-ink-black hover:bg-paper-cream transition-colors"
                        onClick={() => setShowMenu(false)}
                      >
                        <User className="h-4 w-4" />
                        个人中心
                      </Link>
                      <button
                        onClick={() => {
                          logout()
                          setShowMenu(false)
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-vermilion hover:bg-vermilion/5 transition-colors"
                      >
                        <LogOut className="h-4 w-4" />
                        退出登录
                      </button>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowLogin(true)}
                className="border-glaze-blue/30 text-glaze-blue hover:bg-glaze-blue/10"
              >
                <User className="h-4 w-4 mr-1" />
                登录
              </Button>
            )}

            <Link to="/admin" className="text-xs text-stone-400 hover:text-vermilion ml-2">
              管理
            </Link>
          </div>
        </div>
      </header>

      {/* 登录弹窗 */}
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  )
}
