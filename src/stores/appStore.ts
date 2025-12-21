import { create } from 'zustand'
import { devtools } from 'zustand/middleware'

// 应用全局状态
interface AppState {
  // 当前选中的建筑
  selectedBuildingSlug: string | null
  setSelectedBuilding: (slug: string | null) => void

  // 当前朝代筛选
  selectedDynasty: string | null
  setSelectedDynasty: (dynasty: string | null) => void

  // 当前建筑类型筛选
  selectedBuildingType: string | null
  setSelectedBuildingType: (type: string | null) => void

  // 搜索关键词
  searchQuery: string
  setSearchQuery: (query: string) => void

  // 侧边栏状态
  sidebarOpen: boolean
  toggleSidebar: () => void

  // 性能模式
  performanceMode: 'high' | 'medium' | 'low'
  setPerformanceMode: (mode: 'high' | 'medium' | 'low') => void

  // VR 模式
  vrEnabled: boolean
  setVrEnabled: (enabled: boolean) => void
}

export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      selectedBuildingSlug: null,
      setSelectedBuilding: (slug) => set({ selectedBuildingSlug: slug }),

      selectedDynasty: null,
      setSelectedDynasty: (dynasty) => set({ selectedDynasty: dynasty }),

      selectedBuildingType: null,
      setSelectedBuildingType: (type) => set({ selectedBuildingType: type }),

      searchQuery: '',
      setSearchQuery: (query) => set({ searchQuery: query }),

      sidebarOpen: false,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      performanceMode: 'high',
      setPerformanceMode: (mode) => set({ performanceMode: mode }),

      vrEnabled: false,
      setVrEnabled: (enabled) => set({ vrEnabled: enabled }),
    }),
    { name: 'app-store' }
  )
)
