/**
 * 建筑-文化密码知识映射
 * 将每个建筑与相关的文化密码知识点关联
 */

export interface BuildingCipherPoint {
  type: 'fengshui' | 'symbol' | 'color' | 'space'
  id: string
  confidence: 'high' | 'medium' | 'low'
}

export interface BuildingCipherMapping {
  buildingId: string
  buildingName: string
  location: string
  cipherPoints: BuildingCipherPoint[]
}

export const buildingCipherMappings: BuildingCipherMapping[] = [
  // 故宫太和殿
  {
    buildingId: 'forbidden-city',
    buildingName: '故宫太和殿',
    location: '北京',
    cipherPoints: [
      {
        type: 'fengshui',
        id: 'fs-1',
        confidence: 'high',
      },
      {
        type: 'fengshui',
        id: 'fs-2',
        confidence: 'high',
      },
      {
        type: 'fengshui',
        id: 'fs-3',
        confidence: 'high',
      },
      {
        type: 'fengshui',
        id: 'fs-4',
        confidence: 'high',
      },
      {
        type: 'fengshui',
        id: 'fs-5',
        confidence: 'high',
      },
      {
        type: 'symbol',
        id: 'sym-1',
        confidence: 'high',
      },
      {
        type: 'symbol',
        id: 'sym-2',
        confidence: 'high',
      },
      {
        type: 'symbol',
        id: 'sym-5',
        confidence: 'medium',
      },
      {
        type: 'color',
        id: 'col-1',
        confidence: 'high',
      },
      {
        type: 'color',
        id: 'col-2',
        confidence: 'high',
      },
      {
        type: 'color',
        id: 'col-5',
        confidence: 'high',
      },
      {
        type: 'space',
        id: 'spa-1',
        confidence: 'high',
      },
      {
        type: 'space',
        id: 'spa-4',
        confidence: 'high',
      },
      {
        type: 'space',
        id: 'spa-5',
        confidence: 'high',
      },
    ],
  },
  // 赵州桥
  {
    buildingId: 'zhaozhou-bridge',
    buildingName: '赵州桥',
    location: '河北',
    cipherPoints: [
      {
        type: 'fengshui',
        id: 'fs-2',
        confidence: 'high',
      },
      {
        type: 'fengshui',
        id: 'fs-4',
        confidence: 'medium',
      },
      {
        type: 'space',
        id: 'spa-4',
        confidence: 'medium',
      },
      {
        type: 'space',
        id: 'spa-1',
        confidence: 'low',
      },
    ],
  },
  // 平遥古城
  {
    buildingId: 'pingyao-ancient-city',
    buildingName: '平遥古城',
    location: '山西',
    cipherPoints: [
      {
        type: 'fengshui',
        id: 'fs-1',
        confidence: 'high',
      },
      {
        type: 'fengshui',
        id: 'fs-3',
        confidence: 'medium',
      },
      {
        type: 'space',
        id: 'spa-1',
        confidence: 'high',
      },
      {
        type: 'space',
        id: 'spa-2',
        confidence: 'medium',
      },
      {
        type: 'color',
        id: 'col-2',
        confidence: 'medium',
      },
    ],
  },
  // 乔家大院
  {
    buildingId: 'qiao-family-compound',
    buildingName: '乔家大院',
    location: '山西',
    cipherPoints: [
      {
        type: 'fengshui',
        id: 'fs-2',
        confidence: 'high',
      },
      {
        type: 'symbol',
        id: 'sym-4',
        confidence: 'high',
      },
      {
        type: 'color',
        id: 'col-2',
        confidence: 'high',
      },
      {
        type: 'space',
        id: 'spa-2',
        confidence: 'high',
      },
      {
        type: 'space',
        id: 'spa-3',
        confidence: 'high',
      },
      {
        type: 'space',
        id: 'spa-5',
        confidence: 'medium',
      },
    ],
  },
  // 王家大院
  {
    buildingId: 'wang-family-courtyard',
    buildingName: '王家大院',
    location: '山西',
    cipherPoints: [
      {
        type: 'fengshui',
        id: 'fs-1',
        confidence: 'high',
      },
      {
        type: 'symbol',
        id: 'sym-4',
        confidence: 'medium',
      },
      {
        type: 'space',
        id: 'spa-2',
        confidence: 'high',
      },
      {
        type: 'space',
        id: 'spa-3',
        confidence: 'high',
      },
    ],
  },
  // 徽州建筑
  {
    buildingId: 'huizhou-architecture',
    buildingName: '徽州古建筑群',
    location: '安徽',
    cipherPoints: [
      {
        type: 'symbol',
        id: 'sym-3',
        confidence: 'high',
      },
      {
        type: 'symbol',
        id: 'sym-4',
        confidence: 'high',
      },
      {
        type: 'symbol',
        id: 'sym-5',
        confidence: 'medium',
      },
      {
        type: 'color',
        id: 'col-3',
        confidence: 'high',
      },
      {
        type: 'color',
        id: 'col-4',
        confidence: 'high',
      },
      {
        type: 'space',
        id: 'spa-2',
        confidence: 'high',
      },
      {
        type: 'space',
        id: 'spa-4',
        confidence: 'high',
      },
    ],
  },
  // 凤凰古城
  {
    buildingId: 'fenghuang-ancient-town',
    buildingName: '凤凰古城',
    location: '湖南',
    cipherPoints: [
      {
        type: 'color',
        id: 'col-3',
        confidence: 'high',
      },
      {
        type: 'color',
        id: 'col-2',
        confidence: 'medium',
      },
      {
        type: 'space',
        id: 'spa-2',
        confidence: 'medium',
      },
    ],
  },
  // 颐和园
  {
    buildingId: 'summer-palace',
    buildingName: '颐和园',
    location: '北京',
    cipherPoints: [
      {
        type: 'fengshui',
        id: 'fs-4',
        confidence: 'high',
      },
      {
        type: 'fengshui',
        id: 'fs-2',
        confidence: 'high',
      },
      {
        type: 'color',
        id: 'col-1',
        confidence: 'medium',
      },
      {
        type: 'space',
        id: 'spa-4',
        confidence: 'high',
      },
    ],
  },
  // 真源寺
  {
    buildingId: 'zhenyuan-temple',
    buildingName: '真源寺',
    location: '陕西',
    cipherPoints: [
      {
        type: 'symbol',
        id: 'sym-3',
        confidence: 'high',
      },
      {
        type: 'symbol',
        id: 'sym-5',
        confidence: 'high',
      },
      {
        type: 'space',
        id: 'spa-1',
        confidence: 'medium',
      },
      {
        type: 'space',
        id: 'spa-5',
        confidence: 'medium',
      },
    ],
  },
  // 客家土楼
  {
    buildingId: 'hakka-tulou',
    buildingName: '客家土楼',
    location: '福建',
    cipherPoints: [
      {
        type: 'fengshui',
        id: 'fs-1',
        confidence: 'high',
      },
      {
        type: 'space',
        id: 'spa-2',
        confidence: 'high',
      },
      {
        type: 'space',
        id: 'spa-4',
        confidence: 'medium',
      },
    ],
  },
]

/**
 * 根据建筑ID获取相关的文化密码知识
 */
export function getBuildingCipherPoints(buildingId: string): BuildingCipherMapping | undefined {
  return buildingCipherMappings.find((mapping) => mapping.buildingId === buildingId)
}

/**
 * 根据建筑ID和知识类型获取高置信度的知识点
 */
export function getHighConfidenceCipherPoints(
  buildingId: string,
  type?: BuildingCipherPoint['type']
): BuildingCipherPoint[] {
  const mapping = getBuildingCipherPoints(buildingId)
  if (!mapping) return []

  let points = mapping.cipherPoints.filter((p) => p.confidence === 'high')
  if (type) {
    points = points.filter((p) => p.type === type)
  }
  return points
}
