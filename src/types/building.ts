// 朝代类型
export type Dynasty =
  | '商'
  | '先秦'
  | '秦'
  | '汉'
  | '秦汉'
  | '南北朝'
  | '魏晋南北朝'
  | '五代'
  | '隋唐'
  | '宋'
  | '辽'
  | '金'
  | '元'
  | '明'
  | '清'

// 建筑类型
export type BuildingType =
  | '古建筑'
  | '民居'
  | '宫府'
  | '皇宫'
  | '桥梁'
  | '防御'
  | '园林'
  | '寺庙'
  | '陵墓'
  | '城镇'
  | '要塞'

// 地区
export interface Region {
  id: string
  name: string
  province?: string
  coordinates: {
    lat: number
    lng: number
  }
}

// 3D资源
export interface Asset {
  id: string
  buildingId: string
  kind: 'model' | 'texture' | 'audio' | 'video'
  lod: 0 | 1 | 2
  url: string
  bytes: number
  mime: string
}

// 导览点
export interface POI {
  id: string
  buildingId: string
  title: string
  description: string
  position: {
    x: number
    y: number
    z: number
  }
  mediaAssetId?: string
  sortOrder: number
}

// 建筑标签
export interface Tag {
  id: string
  name: string
  category: 'style' | 'feature' | 'material' | 'technique'
}

// 建筑主体
export interface Building {
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

  // 3D相关
  defaultCamera: {
    position: [number, number, number]
    target: [number, number, number]
    fov: number
  }

  // 元数据
  tags: Tag[]
  assets?: Asset[]
  pois?: POI[]

  // 统计
  viewCount?: number
  favoriteCount?: number

  // 状态
  status: 'draft' | 'published'
  createdAt: string
  updatedAt: string

  // 图片
  thumbnail?: string
  images?: string[]

  // 详细信息
  detailedHistory?: string
  constructionDetails?: {
    startYear: number
    endYear: number
    durationYears: number
    workforce: string
    materials?: string[]
  }
  artifacts?: string[]
  culturalSignificance?: string
  visitingInfo?: {
    openingHours: string
    location: string
    distance: string
    recommendedDuration: string
    relatedSites?: string[]
    famousGardens?: string[]
  }
}

// 建筑列表响应
export interface BuildingsResponse {
  buildings: Building[]
  total: number
  page: number
  pageSize: number
}

// 朝代信息
export interface DynastyInfo {
  id: string
  name: Dynasty
  startYear: number
  endYear: number
  description: string
  buildingCount: number
}
