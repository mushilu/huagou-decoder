import { useCallback, useEffect } from 'react'
import { useRootStore } from '@/stores/rootStore'
import type { Building } from '@/types/building'

/**
 * 建筑数据管理Hook
 * 统一处理建筑数据的加载、缓存和错误管理
 */
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

  // 加载建筑数据（模拟API调用）
  const loadBuildings = useCallback(async () => {
    if (buildings.length > 0) return // 已加载则跳过

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
      const message = err instanceof Error ? err.message : '加载建筑数据失败'
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

/**
 * 建筑搜索和过滤Hook
 */
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

  // 应用过滤
  const filteredBuildings = useCallback(() => {
    return buildings.filter((building: Building) => {
      // 按搜索词过滤
      if (searchQuery && !building.nameZh.includes(searchQuery) && !building.summary?.includes(searchQuery)) {
        return false
      }

      // 按朝代过滤
      if (selectedDynasty && building.dynasty !== selectedDynasty) {
        return false
      }

      // 按类型过滤
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

/**
 * 性能模式管理Hook
 */
export function usePerformanceMode() {
  const { performanceMode, setPerformanceMode, vrEnabled, setVrEnabled } = useRootStore()

  // 根据VR模式自动调整性能
  useEffect(() => {
    if (vrEnabled) {
      // VR模式优先使用高性能配置
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
