import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const dynasties = [
  { id: 'pre-qin', char: '秦', label: '先秦' },
  { id: 'qin-han', char: '汉', label: '秦汉' },
  { id: 'wei-jin', char: '晋', label: '魏晋' },
  { id: 'sui-tang', char: '唐', label: '隋唐' },
  { id: 'song', char: '宋', label: '宋' },
  { id: 'yuan', char: '元', label: '元' },
  { id: 'ming', char: '明', label: '明' },
  { id: 'qing', char: '清', label: '清' },
]

function generateSealSVG(dynasty: typeof dynasties[0]): string {
  const seed = Math.floor(Math.random() * 1000)

  return `<svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="seal-gradient-${dynasty.id}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#c8102e"/>
      <stop offset="100%" stop-color="#a00c24"/>
    </linearGradient>
    <filter id="texture-${dynasty.id}">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="${seed}"/>
      <feColorMatrix type="saturate" values="0"/>
      <feBlend mode="multiply" in="SourceGraphic"/>
    </filter>
  </defs>

  <!-- 底座 -->
  <rect x="2" y="2" width="44" height="44" rx="3" fill="#faf7f2" stroke="#d4cfc6" stroke-width="1"/>

  <!-- 印面 -->
  <rect x="6" y="6" width="36" height="36" rx="2" fill="url(#seal-gradient-${dynasty.id})"/>

  <!-- 磨损纹理 -->
  <rect x="6" y="6" width="36" height="36" rx="2" fill="white" opacity="0.1" filter="url(#texture-${dynasty.id})"/>

  <!-- 朝代文字 -->
  <text x="24" y="32" text-anchor="middle" font-family="serif, 'Noto Serif SC'" font-size="20" font-weight="bold" fill="#faf7f2">${dynasty.char}</text>
</svg>`
}

// 生成所有印章
const outputDir = path.join(__dirname, '../public/assets/moyu-guji/seals')
fs.mkdirSync(outputDir, { recursive: true })

dynasties.forEach((dynasty) => {
  const svg = generateSealSVG(dynasty)
  const filePath = path.join(outputDir, `seal-${dynasty.id}.svg`)
  fs.writeFileSync(filePath, svg, 'utf-8')
  console.log(`✓ Generated: seal-${dynasty.id}.svg`)
})

console.log(`\n✅ Successfully generated ${dynasties.length} dynasty seals in ${outputDir}`)
