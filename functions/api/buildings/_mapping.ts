import {
  normalizeNumber,
  normalizeString,
  parseJsonArray,
  parseJsonObject,
  toIsoString,
  toJsonString,
} from '../_shared'

type BuildingRow = Record<string, unknown>

const DEFAULT_CAMERA = {
  position: [50, 30, 50] as [number, number, number],
  target: [0, 0, 0] as [number, number, number],
  fov: 50,
}

const buildTags = (dynasty: string, buildingType: string) => {
  const tags: { id: string; name: string; category: 'style' | 'feature' | 'material' | 'technique' }[] = []
  if (buildingType) {
    tags.push({ id: `type-${buildingType}`, name: buildingType, category: 'style' })
  }
  if (dynasty) {
    tags.push({ id: `dynasty-${dynasty}`, name: dynasty, category: 'feature' })
  }
  return tags
}

export function mapBuildingRow(row: BuildingRow) {
  const nameZh = typeof row.name_zh === 'string' ? row.name_zh : ''
  const nameEn = typeof row.name_en === 'string' ? row.name_en : ''
  const dynasty = typeof row.dynasty === 'string' ? row.dynasty : ''
  const buildingType = typeof row.building_type === 'string' ? row.building_type : ''

  const latValue = normalizeNumber(row.lat) ?? 0
  const lngValue = normalizeNumber(row.lng) ?? 0

  const images = parseJsonArray(row.images) ?? []
  const artifacts = parseJsonArray(row.artifacts)
  const constructionDetails = parseJsonObject<Record<string, unknown>>(row.construction_details)
  const visitingInfo = parseJsonObject<Record<string, unknown>>(row.visiting_info)

  return {
    id: typeof row.id === 'string' ? row.id : String(row.id ?? ''),
    slug: typeof row.slug === 'string' ? row.slug : '',
    nameZh,
    nameEn,
    dynasty,
    dynastyYear: normalizeNumber(row.dynasty_year),
    buildingType,
    region: {
      id: typeof row.region_id === 'string' ? row.region_id : '',
      name: typeof row.region_name === 'string' ? row.region_name : '',
      province: typeof row.province === 'string' ? row.province : undefined,
      coordinates: {
        lat: latValue,
        lng: lngValue,
      },
    },
    summary: typeof row.summary === 'string' ? row.summary : '',
    content: typeof row.content === 'string' ? row.content : '',
    detailedHistory: typeof row.detailed_history === 'string' ? row.detailed_history : undefined,
    constructionDetails,
    artifacts,
    culturalSignificance:
      typeof row.cultural_significance === 'string' ? row.cultural_significance : undefined,
    visitingInfo,
    thumbnail: typeof row.thumbnail === 'string' ? row.thumbnail : undefined,
    images,
    status: normalizeStatus(row.status) ?? 'published',
    viewCount: normalizeNumber(row.view_count) ?? 0,
    createdAt: toIsoString(row.created_at),
    updatedAt: toIsoString(row.updated_at),
    defaultCamera: DEFAULT_CAMERA,
    tags: buildTags(dynasty, buildingType),
  }
}

export function normalizeStatus(value: unknown) {
  if (value === 'draft' || value === 'published') return value
  return undefined
}

export function normalizeBuildingInput(body: Record<string, unknown>) {
  const region =
    body.region && typeof body.region === 'object' && !Array.isArray(body.region)
      ? (body.region as Record<string, unknown>)
      : {}
  const coordinates =
    region.coordinates && typeof region.coordinates === 'object' && !Array.isArray(region.coordinates)
      ? (region.coordinates as Record<string, unknown>)
      : {}

  return {
    id: normalizeString(body.id),
    slug: normalizeString(body.slug),
    name_zh: normalizeString(body.nameZh ?? body.name_zh),
    name_en: normalizeString(body.nameEn ?? body.name_en),
    dynasty: normalizeString(body.dynasty),
    dynasty_year: normalizeNumber(body.dynastyYear ?? body.dynasty_year),
    building_type: normalizeString(body.buildingType ?? body.building_type),
    region_id: normalizeString(region.id ?? body.regionId ?? body.region_id),
    region_name: normalizeString(region.name ?? body.regionName ?? body.region_name),
    province: normalizeString(region.province ?? body.province),
    lat: normalizeNumber(coordinates.lat ?? body.lat),
    lng: normalizeNumber(coordinates.lng ?? body.lng),
    summary: normalizeString(body.summary),
    content: normalizeString(body.content),
    detailed_history: normalizeString(body.detailedHistory ?? body.detailed_history),
    construction_details: toJsonString(body.constructionDetails ?? body.construction_details),
    artifacts: toJsonString(body.artifacts),
    cultural_significance: normalizeString(body.culturalSignificance ?? body.cultural_significance),
    visiting_info: toJsonString(body.visitingInfo ?? body.visiting_info),
    thumbnail: normalizeString(body.thumbnail),
    images: toJsonString(body.images),
    status: normalizeStatus(body.status),
  }
}
