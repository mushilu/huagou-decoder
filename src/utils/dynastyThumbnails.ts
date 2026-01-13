import type { Dynasty } from '@/types/building'

/**
 * 朝代默认缩略图映射
 * AI 生成的国潮插画风格建筑图
 */
const DYNASTY_THUMBNAILS: Record<Dynasty, string> = {
  '先秦': '/images/buildings/pre-qin-palace.png',
  '秦汉': '/images/buildings/han-weiyang.png',
  '魏晋南北朝': '/images/buildings/han-weiyang.png', // 暂用秦汉图
  '隋唐': '/images/buildings/tang-daming.png',
  '宋': '/images/buildings/song-kaifeng.png',
  '元': '/images/buildings/song-kaifeng.png', // 暂用宋图
  '明': '/images/buildings/ming-qing-forbidden.png',
  '清': '/images/buildings/ming-qing-forbidden.png',
}

/**
 * 获取建筑缩略图
 * 优先使用建筑自身的 thumbnail，否则返回朝代默认图
 */
export function getBuildingThumbnail(
  thumbnail: string | undefined,
  dynasty: Dynasty
): string {
  return thumbnail || DYNASTY_THUMBNAILS[dynasty] || DYNASTY_THUMBNAILS['明']
}
