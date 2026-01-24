import { useCallback, useEffect } from 'react'
import { useRootStore } from '@/stores/rootStore'
import type { Building } from '@/types/building'

// 建筑数据Hook
export function useBuildings() {
  const {
    buildings,
    setBuildings,
    isLoading,
    setIsLoading,
    error,
    setError,
    currentBuilding,
    setCurrentBuilding,
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
  } = useRootStore()

  // 加载数据
  const loadBuildings = useCallback(async () => {
    if (buildings.length > 0) return // 已加载

    setIsLoading(true)
    setError(null)

    try {
      // TODO: 替换为实际API调用
      // const response = await fetch('/api/buildings')
      // const data = await response.json()
      // setBuildings(data)

      // 模拟数据
      const mockBuildings: Building[] = []
      setBuildings(mockBuildings)
    } catch (err) {
      const message = err instanceof Error ? err.message : '加载失败'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [buildings.length, setBuildings, setIsLoading, setError])

  return {
    buildings,
    setBuildings,
    isLoading,
    error,
    currentBuilding,
    setCurrentBuilding,
    favorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    loadBuildings,
  }
}

// 过滤Hook
export function useBuildingFilters() {
  const {
    searchQuery,
    setSearchQuery,
    selectedDynasty,
    setSelectedDynasty,
    selectedBuildingType,
    setSelectedBuildingType,
    buildings,
  } = useRootStore()

  // 过滤
  const filteredBuildings = useCallback(() => {
    return buildings.filter((building: Building) => {
      // 搜索词
      if (searchQuery && !building.nameZh.includes(searchQuery) && !building.summary?.includes(searchQuery)) {
        return false
      }

      // 朝代
      if (selectedDynasty && building.dynasty !== selectedDynasty) {
        return false
      }

      // 类型
      if (selectedBuildingType && building.buildingType !== selectedBuildingType) {
        return false
      }

      return true
    })
  }, [buildings, searchQuery, selectedDynasty, selectedBuildingType])

  return {
    filteredBuildings: filteredBuildings(),
    searchQuery,
    setSearchQuery,
    selectedDynasty,
    setSelectedDynasty,
    selectedBuildingType,
    setSelectedBuildingType,
  }
}

// 性能模式Hook
export function usePerformanceMode() {
  const { performanceMode, setPerformanceMode, vrEnabled, setVrEnabled } = useRootStore()

  // VR自动调整
  useEffect(() => {
    if (vrEnabled) {
      // VR高性能
      setPerformanceMode('high')
    }
  }, [vrEnabled, setPerformanceMode])

  return {
    performanceMode,
    setPerformanceMode,
    vrEnabled,
    setVrEnabled,
  }
}
