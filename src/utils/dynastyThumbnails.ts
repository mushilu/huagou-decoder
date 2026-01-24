import type { Dynasty } from '@/types/building'

// 获取建筑缩略图
export function getBuildingThumbnail(
  thumbnail: string | undefined,
  _dynasty: Dynasty
): string {
  // 无图返空
  return thumbnail ?? ''
}
