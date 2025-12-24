import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

interface BuildingIcon {
  id: string
  name: string
  paths: string[]
}

const buildingIcons: BuildingIcon[] = [
  {
    id: 'residence',
    name: '民居',
    paths: [
      // 合院屋顶
      'M8 20 L24 12 L40 20',
      // 墙体
      'M12 20 L12 36 M36 20 L36 36',
      // 门
      'M22 28 L22 36 M26 28 L26 36 M22 28 L26 28',
      // 窗
      'M14 24 L18 24 M14 26 L18 26 M30 24 L34 24 M30 26 L34 26',
    ],
  },
  {
    id: 'mansion',
    name: '宫府',
    paths: [
      // 重檐屋顶
      'M6 22 L24 14 L42 22',
      'M10 26 L24 18 L38 26',
      // 柱子
      'M16 26 L16 38 M24 26 L24 38 M32 26 L32 38',
      // 台基
      'M12 38 L36 38 L38 40 L10 40 Z',
    ],
  },
  {
    id: 'palace',
    name: '皇宫',
    paths: [
      // 三重檐
      'M4 24 L24 16 L44 24',
      'M8 28 L24 20 L40 28',
      'M12 32 L24 24 L36 32',
      // 柱子
      'M18 32 L18 40 M24 32 L24 40 M30 32 L30 40',
      // 三层台基
      'M14 40 L34 40 M12 42 L36 42 M10 44 L38 44',
    ],
  },
  {
    id: 'bridge',
    name: '桥梁',
    paths: [
      // 拱桥
      'M8 32 Q24 20 40 32',
      // 桥面
      'M8 32 L8 34 L40 34 L40 32',
      // 栏杆
      'M10 30 L10 34 M16 28 L16 34 M24 26 L24 34 M32 28 L32 34 M38 30 L38 34',
      // 水纹
      'M4 36 Q8 38 12 36 M36 36 Q40 38 44 36',
    ],
  },
  {
    id: 'defense',
    name: '防御',
    paths: [
      // 城墙
      'M8 18 L8 42 L40 42 L40 18',
      // 垛口
      'M8 18 L12 18 L12 22 L16 22 L16 18 L20 18 L20 22 L24 22 L24 18 L28 18 L28 22 L32 22 L32 18 L36 18 L36 22 L40 22 L40 18',
      // 箭孔
      'M14 28 L14 32 M24 28 L24 32 M34 28 L34 32',
    ],
  },
  {
    id: 'garden',
    name: '园林',
    paths: [
      // 亭子
      'M16 18 L24 14 L32 18 L32 34 L16 34 Z',
      // 假山
      'M8 38 L12 30 L16 36 L20 32 L22 38',
      // 流水
      'M26 36 Q28 38 30 36 Q32 34 34 36 Q36 38 38 36 Q40 34 42 36',
      // 树
      'M10 24 Q12 20 14 24 M38 28 Q40 24 42 28',
    ],
  },
  {
    id: 'temple',
    name: '寺庙',
    paths: [
      // 佛塔尖顶
      'M24 8 L28 16 L20 16 Z',
      // 歇山顶
      'M8 22 L24 16 L40 22',
      // 柱子
      'M16 22 L16 38 M32 22 L32 38',
      // 门
      'M20 26 L28 26 L28 38 L20 38 Z',
      // 佛珠装饰
      'M24 10 L24 12 M24 12 Q26 12 26 14 Q26 16 24 16 Q22 16 22 14 Q22 12 24 12',
    ],
  },
  {
    id: 'tomb',
    name: '陵墓',
    paths: [
      // 封土堆
      'M10 34 Q24 16 38 34 L38 42 L10 42 Z',
      // 台阶
      'M18 34 L30 34 M16 38 L32 38 M14 42 L34 42',
      // 石碑
      'M22 24 L26 24 L26 32 L22 32 Z M22 22 L26 22',
    ],
  },
  {
    id: 'town',
    name: '城镇',
    paths: [
      // 多个房屋剪影
      'M6 28 L12 22 L18 28 L18 42 L6 42 Z',
      'M20 24 L28 18 L36 24 L36 42 L20 42 Z',
      'M38 30 L42 26 L46 30 L46 42 L38 42 Z',
      // 窗户点缀
      'M10 32 L14 32 M24 30 L32 30 M40 34 L44 34',
    ],
  },
  {
    id: 'fortress',
    name: '要塞',
    paths: [
      // 坚固的墙体
      'M8 20 L8 44 L40 44 L40 20 L24 12 Z',
      // 垛口
      'M10 20 L14 20 L14 24 L18 24 L18 20 L22 20 L22 24 L26 24 L26 20 L30 20 L30 24 L34 24 L34 20 L38 20',
      // 箭塔
      'M20 12 L20 16 L28 16 L28 12',
      // 加固
      'M16 30 L16 36 M24 28 L24 36 M32 30 L32 36',
    ],
  },
]

function generateBuildingIconSVG(icon: BuildingIcon): string {
  const pathElements = icon.paths
    .map(
      (d) =>
        `  <path d="${d}" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>`
    )
    .join('\n')

  return `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
${pathElements}
</svg>`
}

// 生成所有建筑类型图标
const outputDir = path.join(__dirname, '../public/moyu-guji/building-types')
fs.mkdirSync(outputDir, { recursive: true })

buildingIcons.forEach((icon) => {
  const svg = generateBuildingIconSVG(icon)
  const filePath = path.join(outputDir, `${icon.id}.svg`)
  fs.writeFileSync(filePath, svg, 'utf-8')
  console.log(`✓ Generated: ${icon.id}.svg (${icon.name})`)
})

console.log(`\n✅ Successfully generated ${buildingIcons.length} building type icons in ${outputDir}`)
