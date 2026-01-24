import type { Building, Dynasty, BuildingType, Region } from '@/types/building'
import { fullBuildingsData } from '../../content_tab/buildings/complete_buildings_data'

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

const BRIDGE_KEYWORDS = ['桥', '渡', '堤', '闸', '坝', '堰', '渠']
const PALACE_KEYWORDS = ['皇宫', '宫殿', '行宫', '宫城', '禁城', '故宫', '大内', '皇城', '帝宫']
const IMPERIAL_GARDEN_HINTS = ['御', '皇', '宫', '苑', '禁', '颐和', '圆明', '避暑', '上林', '离宫']
const GOVERNMENT_KEYWORDS = [
  '府',
  '署',
  '衙',
  '公署',
  '官署',
  '都督',
  '总督',
  '巡抚',
  '将军府',
  '王府',
  '城墙',
  '城楼',
  '城堡',
  '关城',
  '关隘',
  '关口',
  '堡',
  '寨',
  '驿',
  '驿站',
  '台',
  '仓',
  '书院',
  '贡院',
  '试院',
  '学宫',
  '古城',
]
const RESIDENCE_KEYWORDS = ['宅', '院', '居', '里', '村', '坊', '街', '巷', '楼', '庄', '店', '号', '馆', '堂', '园']

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

const containsKeyword = (text: string, keywords: string[]) =>
  keywords.some((keyword) => text.includes(keyword))

// 类型映射
const normalizeBuildingType = (building: FullBuildingData): BuildingType => {
  const rawType = building.buildingType
  if (rawType === '皇宫' || rawType === '民居' || rawType === '桥梁' || rawType === '官府') {
    return rawType
  }
  if (rawType === '宫府') return '官府'

  const name = building.nameZh || ''
  if (containsKeyword(name, BRIDGE_KEYWORDS)) return '桥梁'
  if (containsKeyword(name, PALACE_KEYWORDS)) return '皇宫'
  if (name.includes('园') && containsKeyword(name, IMPERIAL_GARDEN_HINTS)) return '皇宫'
  if (containsKeyword(name, GOVERNMENT_KEYWORDS)) return '官府'
  if (containsKeyword(name, RESIDENCE_KEYWORDS)) return '民居'
  return '民居'
}

const getLocalImages = (slug: string) => {
  if (!LOCAL_IMAGE_SLUGS.has(slug)) return null
  const base = `/images/buildings/${slug}`
  return {
    thumbnail: `${base}/thumbnail.jpg`,
    images: [`${base}/thumbnail.jpg`, `${base}/detail.jpg`],
  }
}

const buildCommonsProxyUrl = (
  slug: string,
  nameZh: string,
  nameEn: string | undefined,
  regionName: string | undefined,
  provinceName: string | undefined
) => {
  const params = new URLSearchParams()
  params.set('q', nameZh)
  if (nameEn && nameEn !== nameZh) {
    params.set('e', nameEn)
  }
  if (regionName) {
    params.set('r', regionName)
  }
  if (provinceName) {
    params.set('p', provinceName)
  }
  return `/commons/${slug}?${params.toString()}`
}

// 使用完整数据，添加缺失的必要字段
const typedBuildings = fullBuildingsData as FullBuildingData[]

export const buildings: Building[] = typedBuildings.map((b, index) => {
  const localImages = getLocalImages(b.slug)
  const commonsThumbnail = buildCommonsProxyUrl(
    b.slug,
    b.nameZh,
    b.nameEn,
    b.region?.name,
    b.region?.province
  )
  const imagesCandidate = Array.isArray(b.images) && b.images.length > 0
    ? b.images
    : (localImages?.images || [commonsThumbnail])
  const images = imagesCandidate ? [...imagesCandidate] : undefined
  const thumbnail = b.thumbnail || localImages?.thumbnail || commonsThumbnail
  const buildingType = normalizeBuildingType(b)

  return {
  id: b.id,
  slug: b.slug,
  nameZh: b.nameZh,
  nameEn: b.nameEn,
  dynasty: b.dynasty,
  dynastyYear: b.dynastyYear,
  buildingType,
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
    { id: '1', name: buildingType, category: 'style' },
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
