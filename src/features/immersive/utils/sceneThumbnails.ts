/**
 * 沉浸漫游场景缩略图映射
 * AI 生成的水墨意境风格场景图
 */
const SCENE_THUMBNAILS: Record<string, string> = {
  'forbidden-city': '/images/immersive/forbidden-city-scene.png',
  'zhaozhou-bridge': '/images/immersive/zhaozhou-bridge-scene.png',
  'pingyao-ancient-city': '/images/immersive/pingyao-city-scene.png',
}

/**
 * 获取建筑场景缩略图
 */
export function getSceneThumbnail(buildingId: string): string | undefined {
  return SCENE_THUMBNAILS[buildingId]
}
