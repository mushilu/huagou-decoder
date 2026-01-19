// 统计数据生成

// 导入完整的建筑数据
import { fullBuildingsData } from '@/../../content_tab/buildings/complete_buildings_data'
import { provinceGeocenters } from './provinceGeocenterCoordinates'

interface FullBuildingData {
  id: string
  nameZh: string
  dynasty: string
  buildingType: string
  region: {
    province: string
    coordinates: { lat: number; lng: number }
  }
  constructionDetails?: {
    startYear: number
    endYear: number
    durationYears: number
  }
}

// 朝代统计信息
export interface DynastyStats {
  name: string                    // 朝代名称
  period: string                  // 朝代时期范围
  count: number                   // 该朝代的建筑数
  color: string                   // 可视化颜色
  representative: string[]        // 代表性建筑名称
}

// 建筑类型统计
export interface TypeStats {
  name: string                    // 类型名称（皇宫、民居、桥梁等）
  count: number                   // 该类型的建筑数
  color: string                   // 可视化颜色
  percentage: number              // 百分比
  buildings: string[]             // 该类型的建筑列表
}

// 省份统计信息
export interface ProvinceStats {
  name: string                    // 省份名称
  coordinates: { lat: number; lng: number }  // 地理坐标
  count: number                   // 该省份的建筑数
  buildings: string[]             // 该省份的建筑列表
  dynasties: string[]             // 该省份包含的朝代
}

// 时间轴事件
export interface TimelineEvent {
  year: number                    // 事件年份
  title: string                   // 事件标题
  description: string             // 事件描述
  building: string                // 相关建筑
}

// 完整统计数据结构
export interface BuildingStats {
  total: number                   // 总建筑数
  byDynasty: DynastyStats[]       // 按朝代统计
  byType: TypeStats[]             // 按类型统计
  byProvince: ProvinceStats[]     // 按省份统计
  timeline: TimelineEvent[]       // 时间轴事件
  topBuildings: string[]          // 精选建筑列表
}

// 朝代信息映射
const dynastyInfo: Record<string, { period: string; color: string }> = {
  '商': { period: '前1600 - 前1046', color: '#795548' },
  '先秦': { period: '前2100 - 前221', color: '#8D6E63' },
  '秦': { period: '前221 - 前206', color: '#6D4C41' },
  '汉': { period: '前206 - 220', color: '#8D6E63' },
  '秦汉': { period: '前221 - 220', color: '#6D4C41' },
  '南北朝': { period: '420 - 589', color: '#546E7A' },
  '魏晋南北朝': { period: '220 - 589', color: '#546E7A' },
  '五代': { period: '907 - 960', color: '#A1887F' },
  '隋唐': { period: '581 - 907', color: '#FF8A65' },
  '宋': { period: '960 - 1279', color: '#CD5C5C' },
  '辽': { period: '907 - 1125', color: '#8D6E63' },
  '金': { period: '1115 - 1234', color: '#7B5E57' },
  '元': { period: '1271 - 1368', color: '#6B4423' },
  '明': { period: '1368 - 1644', color: '#C41E3A' },
  '清': { period: '1644 - 1912', color: '#FFD700' },
}

// 建筑类型颜色映射
const typeColorMap: Record<string, string> = {
  '古建筑': '#8D6E63',
  '皇宫': '#C41E3A',
  '民居': '#D4A574',
  '桥梁': '#4A90E2',
  '园林': '#7CB342',
  '宫府': '#AB47BC',
  '城镇': '#5C6BC0',
  '防御': '#8D6E63',
  '陵墓': '#8E6C88',
  '要塞': '#6D4C41',
  '宗教': '#00BCD4',
}

// 生成朝代统计
function generateDynastyStats(): DynastyStats[] {
  const dynastyMap = new Map<string, { count: number; buildings: string[] }>()

  ;(fullBuildingsData as FullBuildingData[]).forEach((building) => {
    const dynasty = building.dynasty
    if (!dynastyMap.has(dynasty)) {
      dynastyMap.set(dynasty, { count: 0, buildings: [] })
    }
    const data = dynastyMap.get(dynasty)!
    data.count++
    data.buildings.push(building.nameZh)
  })

  return Array.from(dynastyMap.entries()).map(([dynasty, data]) => ({
    name: dynasty,
    period: dynastyInfo[dynasty]?.period || 'Unknown',
    count: data.count,
    color: dynastyInfo[dynasty]?.color || '#999999',
    representative: data.buildings.slice(0, 3), // 取前 3 个作为代表
  }))
}

// 生成类型统计
function generateTypeStats(): TypeStats[] {
  const typeMap = new Map<string, { count: number; buildings: string[] }>()

  ;(fullBuildingsData as FullBuildingData[]).forEach((building) => {
    const type = building.buildingType
    if (!typeMap.has(type)) {
      typeMap.set(type, { count: 0, buildings: [] })
    }
    const data = typeMap.get(type)!
    data.count++
    data.buildings.push(building.nameZh)
  })

  const total = fullBuildingsData.length

  return Array.from(typeMap.entries()).map(([type, data]) => ({
    name: type,
    count: data.count,
    color: typeColorMap[type] || '#999999',
    percentage: Math.round((data.count / total) * 100),
    buildings: data.buildings,
  }))
}

// 生成省份统计
function generateProvinceStats(): ProvinceStats[] {
  const provinceMap = new Map<
    string,
    {
      count: number
      buildings: string[]
      coordinates: { lat: number; lng: number }
      dynasties: Set<string>
    }
  >()

  ;(fullBuildingsData as FullBuildingData[]).forEach((building) => {
    const province = building.region.province
    if (!provinceMap.has(province)) {
      // 使用真实的省份地理中心坐标而非建筑坐标
      const geocenter = provinceGeocenters[province] || building.region.coordinates
      provinceMap.set(province, {
        count: 0,
        buildings: [],
        coordinates: geocenter,
        dynasties: new Set(),
      })
    }
    const data = provinceMap.get(province)!
    data.count++
    data.buildings.push(building.nameZh)
    data.dynasties.add(building.dynasty)
  })

  return Array.from(provinceMap.entries())
    .map(([province, data]) => ({
      name: province,
      coordinates: data.coordinates,
      count: data.count,
      buildings: data.buildings,
      dynasties: Array.from(data.dynasties),
    }))
    .sort((a, b) => b.count - a.count) // 按建筑数排序
}

// 生成时间轴事件
function generateTimeline(): TimelineEvent[] {
  const events: TimelineEvent[] = []

  // 为每个建筑添加时间事件
  ;(fullBuildingsData as FullBuildingData[]).forEach((building) => {
    const { constructionDetails } = building
    if (constructionDetails) {
      events.push({
        year: constructionDetails.startYear,
        title: `${building.nameZh}开始建造`,
        description: `在${building.dynasty}朝代开始建造这一古建筑`,
        building: building.nameZh,
      })

      events.push({
        year: constructionDetails.endYear,
        title: `${building.nameZh}建造完成`,
        description: `经过${constructionDetails.durationYears}年的建造，该建筑最终完成`,
        building: building.nameZh,
      })
    }
  })

  return events.sort((a, b) => a.year - b.year)
}

// 生成完整统计数据
export function generateBuildingStats(): BuildingStats {
  const dynastyStats = generateDynastyStats()
  const typeStats = generateTypeStats()
  const provinceStats = generateProvinceStats()
  const timeline = generateTimeline()

  return {
    total: fullBuildingsData.length,
    byDynasty: dynastyStats,
    byType: typeStats,
    byProvince: provinceStats,
    timeline: timeline,
    topBuildings: fullBuildingsData
      .slice(0, 5)
      .map((b: FullBuildingData) => b.nameZh),
  }
}

// 按朝代范围过滤统计
export function filterBuildingsByDynasty(
  startDynasty: string,
  endDynasty: string,
): BuildingStats {
  const dynastyOrder = ['宋', '元', '明', '清']
  const startIdx = dynastyOrder.indexOf(startDynasty)
  const endIdx = dynastyOrder.indexOf(endDynasty)

  if (startIdx === -1 || endIdx === -1 || startIdx > endIdx) {
    return generateBuildingStats() // 返回全部数据
  }

  const selectedDynasties = dynastyOrder.slice(startIdx, endIdx + 1)

  // 过滤建筑数据
  const filtered = (fullBuildingsData as FullBuildingData[]).filter((b) =>
    selectedDynasties.includes(b.dynasty),
  )

  // 建立索引
  const buildingNameToDynastyMap = new Map<string, string>()
  ;(fullBuildingsData as FullBuildingData[]).forEach((b) => {
    buildingNameToDynastyMap.set(b.nameZh, b.dynasty)
  })

  // 重新计算统计数据
  const dynastyStats = generateDynastyStats().filter((d) =>
    selectedDynasties.includes(d.name),
  )

  const typeMap = new Map<string, { count: number; buildings: string[] }>()
  filtered.forEach((building) => {
    const type = building.buildingType
    if (!typeMap.has(type)) {
      typeMap.set(type, { count: 0, buildings: [] })
    }
    const data = typeMap.get(type)!
    data.count++
    data.buildings.push(building.nameZh)
  })

  const typeStats = Array.from(typeMap.entries()).map(([type, data]) => ({
    name: type,
    count: data.count,
    color: typeColorMap[type] || '#999999',
    percentage: Math.round((data.count / filtered.length) * 100),
    buildings: data.buildings,
  }))

  const provinceMap = new Map<
    string,
    {
      count: number
      buildings: string[]
      coordinates: { lat: number; lng: number }
      dynasties: Set<string>
    }
  >()

  filtered.forEach((building) => {
    const province = building.region.province
    if (!provinceMap.has(province)) {
      // 使用真实的省份地理中心坐标而非建筑坐标
      const geocenter = provinceGeocenters[province] || building.region.coordinates
      provinceMap.set(province, {
        count: 0,
        buildings: [],
        coordinates: geocenter,
        dynasties: new Set(),
      })
    }
    const data = provinceMap.get(province)!
    data.count++
    data.buildings.push(building.nameZh)
    data.dynasties.add(building.dynasty)
  })

  const provinceStats = Array.from(provinceMap.entries())
    .map(([province, data]) => ({
      name: province,
      coordinates: data.coordinates,
      count: data.count,
      buildings: data.buildings,
      dynasties: Array.from(data.dynasties),
    }))
    .sort((a, b) => b.count - a.count)

  const timeline = generateTimeline().filter((e) =>
    selectedDynasties.includes(buildingNameToDynastyMap.get(e.building) || ''),
  )

  return {
    total: filtered.length,
    byDynasty: dynastyStats,
    byType: typeStats,
    byProvince: provinceStats,
    timeline: timeline,
    topBuildings: filtered.slice(0, 5).map((b) => b.nameZh),
  }
}

// 导出单例
export const buildingStats = generateBuildingStats()
