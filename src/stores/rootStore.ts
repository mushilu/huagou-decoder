import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Building } from '@/types/building'

// 根Store
interface RootStore {
  // ========== App State ==========
  selectedBuildingSlug: string | null
  setSelectedBuilding: (slug: string | null) => void

  selectedDynasty: string | null
  setSelectedDynasty: (dynasty: string | null) => void

  selectedBuildingType: string | null
  setSelectedBuildingType: (type: string | null) => void

  searchQuery: string
  setSearchQuery: (query: string) => void

  sidebarOpen: boolean
  toggleSidebar: () => void

  performanceMode: 'high' | 'medium' | 'low'
  setPerformanceMode: (mode: 'high' | 'medium' | 'low') => void

  vrEnabled: boolean
  setVrEnabled: (enabled: boolean) => void

  // ========== Building State ==========
  buildings: Building[]
  setBuildings: (buildings: Building[]) => void

  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  error: string | null
  setError: (error: string | null) => void

  currentBuilding: Building | null
  setCurrentBuilding: (building: Building | null) => void

  favorites: string[]
  addFavorite: (slug: string) => void
  removeFavorite: (slug: string) => void
  isFavorite: (slug: string) => boolean
}

export const useRootStore = create<RootStore>()(
  devtools(
    (set, get) => ({
      // App State
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

      // Building State
      buildings: [],
      setBuildings: (buildings) => set({ buildings }),

      isLoading: false,
      setIsLoading: (loading) => set({ isLoading: loading }),

      error: null,
      setError: (error) => set({ error }),

      currentBuilding: null,
      setCurrentBuilding: (building) => set({ currentBuilding: building }),

      favorites: [],
      addFavorite: (slug) =>
        set((state) => ({
          favorites: [...state.favorites, slug],
        })),
      removeFavorite: (slug) =>
        set((state) => ({
          favorites: state.favorites.filter((s) => s !== slug),
        })),
      isFavorite: (slug) => get().favorites.includes(slug),
    }),
    { name: 'root-store' }
  )
)

// 向后兼容的导出（deprecated，应使用useRootStore）
export const useAppStore = useRootStore
export const useBuildingStore = useRootStore
