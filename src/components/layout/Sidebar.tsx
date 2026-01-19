import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen,
  Layers,
  Sparkles,
  Globe,
  BarChart3,
  X,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAppStore } from '@/stores/appStore'
import { cn } from '@/lib/utils'

const navItems = [
  { path: '/codex', label: '建筑图鉴', icon: BookOpen, description: '浏览古建筑' },
  { path: '/decoder', label: '结构解码', icon: Layers, description: '3D结构解析' },
  { path: '/cipher', label: '文化密码', icon: Sparkles, description: '文化内涵' },
  { path: '/immersive', label: '沉浸漫游', icon: Globe, description: '3D/VR体验' },
  { path: '/dataviz', label: '数据可视', icon: BarChart3, description: '数据分析' },
]

export function Sidebar() {
  const location = useLocation()
  const { sidebarOpen, toggleSidebar } = useAppStore()

  return (
    <AnimatePresence>
      {sidebarOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-ink-black/20 backdrop-blur-sm md:hidden"
            onClick={toggleSidebar}
          />

          {/* Sidebar */}
          <motion.aside
            initial={{ x: -256 }}
            animate={{ x: 0 }}
            exit={{ x: -256 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-16 z-40 h-[calc(100vh-4rem)] w-64 border-r border-ink-gray/20 bg-paper-white shadow-xl"
          >
            <div className="flex h-16 items-center justify-between border-b border-ink-gray/20 px-4">
              <span className="font-serif text-lg font-bold text-ink-black">
                导航
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleSidebar}
                className="md:hidden"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <nav className="space-y-1 p-4">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname.startsWith(item.path)

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={toggleSidebar}
                    className={cn(
                      'flex items-center gap-3 rounded-lg px-3 py-3 transition-all duration-200',
                      isActive
                        ? 'bg-ink-black text-paper-white'
                        : 'text-ink-black hover:bg-ink-black/5'
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <div>
                      <div className="font-medium">{item.label}</div>
                      <div
                        className={cn(
                          'text-xs',
                          isActive ? 'text-paper-white/70' : 'text-ink-gray'
                        )}
                      >
                        {item.description}
                      </div>
                    </div>
                  </Link>
                )
              })}
            </nav>

            {/* Dynasty Filter */}
            <div className="border-t border-ink-gray/20 p-4">
              <h3 className="mb-3 font-serif text-sm font-medium text-ink-gray">
                朝代筛选
              </h3>
              <div className="flex flex-wrap gap-2">
                {['商', '秦', '汉', '南北朝', '五代', '辽', '金', '宋', '元', '明', '清'].map((dynasty) => (
                  <button
                    key={dynasty}
                    className="rounded-full border border-ink-gray/30 px-3 py-1 text-xs text-ink-black transition-colors hover:border-vermilion hover:text-vermilion"
                  >
                    {dynasty}
                  </button>
                ))}
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
