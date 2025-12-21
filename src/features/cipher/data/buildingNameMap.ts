/**
 * 建筑 ID 到中文名称的映射
 */
export const buildingNameMap: Record<string, string> = {
  'forbidden-city': '故宫太和殿',
  'zhaozhou-bridge': '赵州桥',
  'pingyao-ancient-city': '平遥古城',
  'qiao-family-compound': '乔家大院',
  'wang-family-courtyard': '王家大院',
  'huizhou-architecture': '徽州古建筑群',
  'fenghuang-ancient-town': '凤凰古城',
  'summer-palace': '颐和园',
  'zhenyuan-temple': '真源寺',
  'hakka-tulou': '客家土楼',
}

export function getBuildingChineseName(buildingId: string): string {
  return buildingNameMap[buildingId] || buildingId
}
