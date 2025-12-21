import { useState, useEffect, useCallback } from 'react'
import { useBuildingStore } from '@/stores/buildingStore'
import { buildingService } from '@/services/buildingService'
import type { Building, Dynasty } from '@/types/building'

/**
 * 获取建筑列表 Hook
 */
export function useBuildingsList(
  page: number = 1,
  pageSize: number = 12,
  filters?: {
    dynasty?: Dynasty
    buildingType?: string
    search?: string
  }
) {
  const { isLoading, setIsLoading, error, setError, buildings, setBuildings } =
    useBuildingStore()
  const [total, setTotal] = useState(0)
  const [currentPage, setCurrentPage] = useState(page)

  const fetchBuildings = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const response = await buildingService.getBuildings(page, pageSize, filters)
      setBuildings(response.buildings)
      setTotal(response.total)
      setCurrentPage(response.page)
    } catch (err) {
      const message = err instanceof Error ? err.message : '加载建筑列表失败'
      setError(message)
    } finally {
      setIsLoading(false)
    }
  }, [page, pageSize, filters, setIsLoading, setError, setBuildings])

  useEffect(() => {
    fetchBuildings()
  }, [fetchBuildings])

  return {
    buildings,
    isLoading,
    error,
    total,
    page: currentPage,
    pageSize,
    refetch: fetchBuildings,
  }
}

/**
 * 获取建筑详情 Hook
 */
export function useBuildingDetail(slug: string) {
  const { currentBuilding, setCurrentBuilding } = useBuildingStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBuilding = useCallback(async () => {
    setIsLoading(true)
    setError(null)

    try {
      const building = await buildingService.getBuildingBySlug(slug)
      if (!building) {
        setError('建筑不存在')
        return null
      }
      setCurrentBuilding(building)
      return building
    } catch (err) {
      const message = err instanceof Error ? err.message : '加载建筑详情失败'
      setError(message)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [slug, setCurrentBuilding])

  useEffect(() => {
    fetchBuilding()
  }, [slug, fetchBuilding])

  return {
    building: currentBuilding,
    isLoading,
    error,
    refetch: fetchBuilding,
  }
}

/**
 * 获取朝代列表 Hook
 */
export function useDynasties() {
  const [dynasties, setDynasties] = useState<Dynasty[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    buildingService.getDynasties().then((data) => {
      setDynasties(data)
      setIsLoading(false)
    })
  }, [])

  return { dynasties, isLoading }
}

/**
 * 获取建筑类型列表 Hook
 */
export function useBuildingTypes() {
  const [types, setTypes] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    buildingService.getBuildingTypes().then((data) => {
      setTypes(data)
      setIsLoading(false)
    })
  }, [])

  return { types, isLoading }
}

/**
 * 获取热门建筑 Hook
 */
export function usePopularBuildings(limit: number = 6) {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    buildingService.getPopularBuildings(limit).then((data) => {
      setBuildings(data)
      setIsLoading(false)
    })
  }, [limit])

  return { buildings, isLoading }
}

/**
 * 获取收藏排行 Hook
 */
export function useFavoriteBuildings(limit: number = 6) {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    buildingService.getFavoriteBuildings(limit).then((data) => {
      setBuildings(data)
      setIsLoading(false)
    })
  }, [limit])

  return { buildings, isLoading }
}

/**
 * 搜索建筑 Hook
 */
export function useSearchBuildings(query: string) {
  const [results, setResults] = useState<Building[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }

    setIsLoading(true)
    const timer = setTimeout(() => {
      buildingService.searchBuildings(query).then((data) => {
        setResults(data)
        setIsLoading(false)
      })
    }, 300) // 防抖

    return () => clearTimeout(timer)
  }, [query])

  return { results, isLoading }
}

/**
 * 获取统计数据 Hook
 */
export function useBuildingStats() {
  const [stats, setStats] = useState({
    byDynasty: {} as Record<string, number>,
    byType: {} as Record<string, number>,
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    Promise.all([
      buildingService.getBuildingCountByDynasty(),
      buildingService.getBuildingCountByType(),
    ]).then(([byDynasty, byType]) => {
      setStats({ byDynasty, byType })
      setIsLoading(false)
    })
  }, [])

  return { stats, isLoading }
}

/**
 * 获取相关建筑 Hook
 */
export function useRelatedBuildings(buildingId: string, limit: number = 4) {
  const [buildings, setBuildings] = useState<Building[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    buildingService.getRelatedBuildings(buildingId, limit).then((data) => {
      setBuildings(data)
      setIsLoading(false)
    })
  }, [buildingId, limit])

  return { buildings, isLoading }
}
