import rawData from './nationalKeyUnits.json'
import { provinceGeocenters } from './provinceGeocenterCoordinates'

export interface NationalKeyUnitItem {
  id: string
  batch: number
  batchLabel: string
  serial: number
  name: string
  category: string
  categoryCode: string
  location: string
  province: string
  sourceUrl: string
}

export interface NationalKeyUnitsDataset {
  generatedAt: string
  items: NationalKeyUnitItem[]
  sources: Array<{
    title: string
    url: string
    total: number
    note?: string
  }>
  coverage?: {
    batches: number[]
    missingBatches: number[]
    note?: string
  }
  metadata?: {
    totalRecords?: number
    pageCount?: number
    columnId?: number
  }
}

export interface BatchStats {
  batch: number
  label: string
  total: number
  color: string
}

export interface CategoryStats {
  name: string
  count: number
  percentage: number
  color: string
}

export interface ProvinceItemSummary {
  name: string
  category: string
  batch: number
}

export interface ProvinceStats {
  name: string
  coordinates: { lat: number; lng: number }
  hasCoordinates: boolean
  count: number
  categories: string[]
  batches: number[]
  items: ProvinceItemSummary[]
}

export interface NationalStats {
  total: number
  provinceCount: number
  batchCount: number
  categoryCount: number
  byBatch: BatchStats[]
  byCategory: CategoryStats[]
  byProvince: ProvinceStats[]
}

const dataset = rawData as NationalKeyUnitsDataset

const CATEGORY_COLOR_MAP: Record<string, string> = {
  古遗址: '#C8342B',
  古墓葬: '#9F6A4B',
  古建筑: '#D8A657',
  古建筑及历史纪念建筑物: '#B36A5E',
  石窟寺及石刻: '#3F6C8F',
  石窟寺: '#4F7C99',
  石刻及其他: '#7D7D7D',
  近现代重要史迹及代表性建筑: '#5A8F7B',
  革命遗址及革命纪念建筑物: '#D88C4A',
  未标注: '#BDBDBD',
  其他: '#8A8A8A',
}

const CATEGORY_COLOR_PALETTE = [
  '#C8342B',
  '#9F6A4B',
  '#D8A657',
  '#3F6C8F',
  '#5A8F7B',
  '#7B5E9A',
  '#8A8A8A',
  '#B56576',
  '#2F4858',
  '#6D597A',
]

const BATCH_COLORS: Record<number, string> = {
  1: '#8C1D2C',
  2: '#B64E3B',
  3: '#D89B46',
  4: '#7A9E7E',
  5: '#3F6C8F',
  6: '#2B6CB0',
  7: '#6D4C41',
  8: '#4C6B9B',
}

export const nationalKeyUnitsDataset = dataset
export const nationalKeyUnitsItems = dataset.items ?? []

export const buildNationalStats = (items: NationalKeyUnitItem[]): NationalStats => {
  const batchMap = new Map<number, number>()
  const categoryMap = new Map<string, number>()
  const provinceMap = new Map<
    string,
    {
      count: number
      categories: Set<string>
      batches: Set<number>
      items: ProvinceItemSummary[]
    }
  >()

  items.forEach((item) => {
    batchMap.set(item.batch, (batchMap.get(item.batch) ?? 0) + 1)

    const province = item.province || '未知'
    if (!provinceMap.has(province)) {
      provinceMap.set(province, {
        count: 0,
        categories: new Set(),
        batches: new Set(),
        items: [],
      })
    }
    const provinceRecord = provinceMap.get(province)!
    provinceRecord.count += 1
    provinceRecord.batches.add(item.batch)
    provinceRecord.items.push({
      name: item.name,
      category: item.category,
      batch: item.batch,
    })
    if (item.category) {
      provinceRecord.categories.add(item.category)
      categoryMap.set(item.category, (categoryMap.get(item.category) ?? 0) + 1)
    }
  })

  const byBatch = Array.from(batchMap.entries())
    .map(([batch, data]) => ({
      batch,
      label: `第${batch}批`,
      total: data,
      color: BATCH_COLORS[batch] ?? '#888888',
    }))
    .sort((a, b) => a.batch - b.batch)

  const total = items.length
  const byCategory = Array.from(categoryMap.entries())
    .map(([name, count], index) => ({
      name,
      count,
      percentage: total ? Math.round((count / total) * 100) : 0,
      color: CATEGORY_COLOR_MAP[name] ?? CATEGORY_COLOR_PALETTE[index % CATEGORY_COLOR_PALETTE.length],
    }))
    .sort((a, b) => b.count - a.count)

  const byProvince = Array.from(provinceMap.entries())
    .map(([province, data]) => {
      const geocenter = provinceGeocenters[province]
      return {
        name: province,
        coordinates: geocenter ?? { lat: 35.0, lng: 105.0 },
        hasCoordinates: Boolean(geocenter),
        count: data.count,
        categories: Array.from(data.categories),
        batches: Array.from(data.batches).sort((a, b) => a - b),
        items: data.items,
      }
    })
    .sort((a, b) => b.count - a.count)

  return {
    total,
    provinceCount: byProvince.length,
    batchCount: byBatch.length,
    categoryCount: byCategory.length,
    byBatch,
    byCategory,
    byProvince,
  }
}
