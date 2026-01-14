// 图片资源集成 - 将 content_tab 的图片资源映射整合到项目中

import { completeImageResources } from '@/../../content_tab/documentation/complete_challenges_and_images'

// 合并所有图片资源
export const allImageResources = [
  ...completeImageResources
]

// 按建筑 ID 索引图片
export const imagesByBuildingId = new Map<string, typeof allImageResources>()
allImageResources.forEach(img => {
  if (!imagesByBuildingId.has(img.buildingId)) {
    imagesByBuildingId.set(img.buildingId, [])
  }
  imagesByBuildingId.get(img.buildingId)!.push(img)
})

// 获取建筑的所有图片
export function getBuildingImages(buildingId: string) {
  return imagesByBuildingId.get(buildingId) || []
}

// 获取建筑的缩略图
export function getBuildingThumbnail(buildingId: string) {
  const images = getBuildingImages(buildingId)
  return images.find(img => img.type === 'thumbnail')
}

// 获取所有图片元数据
export function getAllImageMetadata() {
  return allImageResources.map(img => ({
    id: img.id,
    buildingId: img.buildingId,
    buildingName: img.buildingName,
    type: img.type,
    fileName: img.fileName,
    license: img.license,
    attribution: img.attribution,
  }))
}

// 导出给组件使用
export { allImageResources as imageResources }
