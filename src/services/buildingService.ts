import { buildings } from '@/data/buildings'
import type { Building, BuildingsResponse, Dynasty } from '@/types/building'

// 模拟 API 延迟
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const buildingService = {
  /**
   * 获取所有建筑（分页）
   */
  async getBuildings(
    page: number = 1,
    pageSize: number = 12,
    filters?: {
      dynasty?: Dynasty
      buildingType?: string
      search?: string
    }
  ): Promise<BuildingsResponse> {
    await delay(300) // 模拟网络延迟

    let filtered = buildings.filter((b) => b.status === 'published')

    // 朝代筛选
    if (filters?.dynasty) {
      filtered = filtered.filter((b) => b.dynasty === filters.dynasty)
    }

    // 建筑类型筛选
    if (filters?.buildingType) {
      filtered = filtered.filter((b) => b.buildingType === filters.buildingType)
    }

    // 搜索关键词
    if (filters?.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(
        (b) =>
          b.nameZh.toLowerCase().includes(searchLower) ||
          b.nameEn.toLowerCase().includes(searchLower) ||
          b.region.name.toLowerCase().includes(searchLower) ||
          b.summary.toLowerCase().includes(searchLower)
      )
    }

    // 分页
    const total = filtered.length
    const startIdx = (page - 1) * pageSize
    const endIdx = startIdx + pageSize
    const paginatedBuildings = filtered.slice(startIdx, endIdx)

    return {
      buildings: paginatedBuildings,
      total,
      page,
      pageSize,
    }
  },

  /**
   * 根据 slug 获取单个建筑详情
   */
  async getBuildingBySlug(slug: string): Promise<Building | null> {
    await delay(200)

    const building = buildings.find((b) => b.slug === slug)
    return building || null
  },

  /**
   * 根据 ID 获取单个建筑详情
   */
  async getBuildingById(id: string): Promise<Building | null> {
    await delay(200)

    const building = buildings.find((b) => b.id === id)
    return building || null
  },

  /**
   * 获取所有朝代列表
   */
  async getDynasties(): Promise<Dynasty[]> {
    await delay(100)

    const dynasties = Array.from(
      new Set(buildings.map((b) => b.dynasty))
    ) as Dynasty[]
    return dynasties.sort()
  },

  /**
   * 获取建筑类型列表
   */
  async getBuildingTypes(): Promise<string[]> {
    await delay(100)

    const types = Array.from(new Set(buildings.map((b) => b.buildingType)))
    return types.sort()
  },

  /**
   * 获取热门建筑
   */
  async getPopularBuildings(limit: number = 6): Promise<Building[]> {
    await delay(200)

    return buildings
      .filter((b) => b.status === 'published' && b.viewCount)
      .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
      .slice(0, limit)
  },

  /**
   * 获取收藏排行
   */
  async getFavoriteBuildings(limit: number = 6): Promise<Building[]> {
    await delay(200)

    return buildings
      .filter((b) => b.status === 'published' && b.favoriteCount)
      .sort((a, b) => (b.favoriteCount || 0) - (a.favoriteCount || 0))
      .slice(0, limit)
  },

  /**
   * 搜索建筑
   */
  async searchBuildings(query: string): Promise<Building[]> {
    await delay(250)

    const searchLower = query.toLowerCase()
    return buildings.filter(
      (b) =>
        b.status === 'published' &&
        (b.nameZh.toLowerCase().includes(searchLower) ||
          b.nameEn.toLowerCase().includes(searchLower) ||
          b.region.name.toLowerCase().includes(searchLower) ||
          b.summary.toLowerCase().includes(searchLower))
    )
  },

  /**
   * 按朝代统计建筑数量
   */
  async getBuildingCountByDynasty(): Promise<Record<string, number>> {
    await delay(100)

    const counts: Record<string, number> = {}
    buildings
      .filter((b) => b.status === 'published')
      .forEach((b) => {
        counts[b.dynasty] = (counts[b.dynasty] || 0) + 1
      })
    return counts
  },

  /**
   * 按建筑类型统计数量
   */
  async getBuildingCountByType(): Promise<Record<string, number>> {
    await delay(100)

    const counts: Record<string, number> = {}
    buildings
      .filter((b) => b.status === 'published')
      .forEach((b) => {
        counts[b.buildingType] = (counts[b.buildingType] || 0) + 1
      })
    return counts
  },

  /**
   * 获取相关建筑
   */
  async getRelatedBuildings(
    buildingId: string,
    limit: number = 4
  ): Promise<Building[]> {
    await delay(200)

    const building = buildings.find((b) => b.id === buildingId)
    if (!building) return []

    const related = buildings
      .filter(
        (b) =>
          b.id !== buildingId &&
          b.status === 'published' &&
          (b.dynasty === building.dynasty || b.buildingType === building.buildingType)
      )
      .slice(0, limit)

    return related
  },
}
