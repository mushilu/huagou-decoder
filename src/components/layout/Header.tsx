import { Link } from 'react-router-dom'
import { Menu, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchBar } from '@/components/search/SearchBar'
import { useAppStore } from '@/stores/appStore'

export function Header() {
  const { toggleSidebar } = useAppStore()

  return (
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
        </nav>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <SearchBar />
          </div>

          <Button variant="ghost" size="icon" aria-label="收藏">
            <Heart className="h-5 w-5" />
          </Button>

          <Link to="/admin" className="text-xs text-stone-400 hover:text-vermilion ml-2">
            管理
          </Link>
        </div>
      </div>
    </header>
  )
}
