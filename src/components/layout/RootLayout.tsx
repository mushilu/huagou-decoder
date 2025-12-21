import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Footer } from './Footer'
import { Sidebar } from './Sidebar'
import { useAppStore } from '@/stores/appStore'
import { useSearchIndex } from '@/hooks/useSearchIndex'
import { cn } from '@/lib/utils'

export function RootLayout() {
  const { sidebarOpen } = useAppStore()
  // 初始化搜索索引
  useSearchIndex()

  return (
    <div className="min-h-screen bg-paper-white">
      <Header />

      <div className="flex">
        <Sidebar />

        <main
          className={cn(
            "flex-1 transition-all duration-300",
            sidebarOpen ? "ml-64" : "ml-0"
          )}
        >
          <div className="container mx-auto px-4 py-8">
            <Outlet />
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}
