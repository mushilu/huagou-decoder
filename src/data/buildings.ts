import type { Building } from '@/types/building'
import { fullBuildingsData } from '@/../../content_tab/buildings/complete_buildings_data'

// 使用完整数据，添加缺失的必要字段
export const buildings: Building[] = fullBuildingsData.map((b, index) => ({
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
  thumbnail: `/images/buildings/${b.slug}/thumbnail.jpg`,
  images: [
    `/images/buildings/${b.slug}/thumbnail.jpg`,
    `/images/buildings/${b.slug}/detail.jpg`,
  ],
  viewCount: 5000 + index * 1000,
  favoriteCount: 500 + index * 100,
})) as Building[]
