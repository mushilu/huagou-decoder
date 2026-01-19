import type { Building, Dynasty, BuildingType, Region } from '@/types/building'
import { fullBuildingsData } from '@/../../content_tab/buildings/complete_buildings_data'

const LOCAL_IMAGE_SLUGS = new Set([
  'fenghuang-ancient-town',
  'forbidden-city',
  'great-wall',
  'hakka-tulou',
  'han-palace',
  'huizhou-architecture',
  'marco-polo-bridge',
  'pingyao-ancient-city',
  'qiao-family-compound',
  'qinshihuang-mausoleum',
  'summer-palace',
  'suzhou-garden',
  'wang-family-courtyard',
  'zhao-zhou-bridge',
])

type FullBuildingData = {
  id: string
  slug: string
  nameZh: string
  nameEn: string
  dynasty: Dynasty
  dynastyYear?: number
  buildingType: BuildingType
  region: Region
  summary: string
  content?: string
  detailedHistory?: string
  constructionDetails?: Building['constructionDetails']
  artifacts?: string[]
  culturalSignificance?: string
  visitingInfo?: Building['visitingInfo']
  thumbnail?: string
  images?: string[]
}

const getLocalImages = (slug: string) => {
  if (!LOCAL_IMAGE_SLUGS.has(slug)) return null
  const base = `/images/buildings/${slug}`
  return {
    thumbnail: `${base}/thumbnail.jpg`,
    images: [`${base}/thumbnail.jpg`, `${base}/detail.jpg`],
  }
}

// 使用完整数据，添加缺失的必要字段
const typedBuildings = fullBuildingsData as FullBuildingData[]

export const buildings: Building[] = typedBuildings.map((b, index) => {
  const localImages = getLocalImages(b.slug)
  const images = Array.isArray(b.images) && b.images.length > 0 ? b.images : localImages?.images
  const thumbnail = b.thumbnail || localImages?.thumbnail

  return {
  id: b.id,
  slug: b.slug,
  nameZh: b.nameZh,
  nameEn: b.nameEn,
  dynasty: b.dynasty,
  dynastyYear: b.dynastyYear,
  buildingType: b.buildingType,
  region: b.region,
  summary: b.summary,
  content: b.content,
  detailedHistory: b.detailedHistory,
  constructionDetails: b.constructionDetails,
  artifacts: b.artifacts,
  culturalSignificance: b.culturalSignificance,
  visitingInfo: b.visitingInfo,
  defaultCamera: {
    position: [50, 30, 50] as [number, number, number],
    target: [0, 0, 0] as [number, number, number],
    fov: 50,
  },
  tags: [
    { id: '1', name: b.buildingType, category: 'style' },
    { id: '2', name: b.dynasty, category: 'period' },
  ],
  status: 'published' as const,
  createdAt: '2024-01-01',
  updatedAt: '2024-01-01',
  thumbnail,
  images,
  viewCount: 5000 + index * 1000,
  favoriteCount: 500 + index * 100,
  }
}) as Building[]
