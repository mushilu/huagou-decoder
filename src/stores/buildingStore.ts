import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Building } from '@/types/building'

// 建筑数据状态
interface BuildingState {
  // 建筑列表
  buildings: Building[]
  setBuildings: (buildings: Building[]) => void

  // 加载状态
  isLoading: boolean
  setIsLoading: (loading: boolean) => void

  // 错误状态
  error: string | null
  setError: (error: string | null) => void

  // 当前查看的建筑详情
  currentBuilding: Building | null
  setCurrentBuilding: (building: Building | null) => void

  // 收藏的建筑
  favorites: string[]
  addFavorite: (slug: string) => void
  removeFavorite: (slug: string) => void
  isFavorite: (slug: string) => boolean
}

export const useBuildingStore = create<BuildingState>()(
  devtools(
    (set, get) => ({
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
    { name: 'building-store' }
  )
)
