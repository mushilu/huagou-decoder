import type { Dynasty } from '@/types/building'

// 获取建筑缩略图
export function getBuildingThumbnail(
  thumbnail: string | undefined,
  _dynasty: Dynasty
): string {
  // 无真实图片时返回空字符串，避免使用非对应建筑的占位图
  return thumbnail ?? ''
}
