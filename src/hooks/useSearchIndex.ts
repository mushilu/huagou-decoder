import { useEffect } from 'react'
import { initializeSearchIndex } from '@/services/SearchService'
import type { SearchableItem } from '@/services/SearchService'

// 建筑数据
const buildingsData: SearchableItem[] = [
  {
    id: 'forbidden-city',
    type: 'building',
    title: '故宫',
    description: '中国明清两代的皇家宫殿，世界上现存规模最大的木质结构古建筑群',
    url: '/codex/forbidden-city',
    tags: ['宫殿', '明清', '北京'],
  },
  {
    id: 'great-wall',
    type: 'building',
    title: '长城',
    description: '世界上最长的防御工事，中国古代的军事防线',
    url: '/codex/great-wall',
    tags: ['防御', '古代', '多地'],
  },
  {
    id: 'terracotta-army',
    type: 'building',
    title: '兵马俑',
    description: '秦始皇陵园的陶俑军阵，世界考古奇迹',
    url: '/codex/terracotta-army',
    tags: ['雕塑', '秦代', '陕西'],
  },
  {
    id: 'temple-of-heaven',
    type: 'building',
    title: '天坛',
    description: '明清两代皇帝祭天的场所，中国古代建筑的典范',
    url: '/codex/temple-of-heaven',
    tags: ['宗教', '明清', '北京'],
  },
]

// 知识数据（从 CipherPage 的知识库中提取）
const knowledgeData: SearchableItem[] = [
  {
    id: 'fengshui-basics',
    type: 'knowledge',
    title: '风水布局基础',
    description: '解读中国古建筑中的风水设计原则',
    url: '/cipher?section=fengshui',
    tags: ['风水', '布局', '设计'],
  },
  {
    id: 'dragon-symbol',
    type: 'knowledge',
    title: '龙纹装饰',
    description: '中国古建筑中龙纹的文化意义与应用',
    url: '/cipher?section=symbol',
    tags: ['装饰', '符号', '龙'],
  },
  {
    id: 'color-language',
    type: 'knowledge',
    title: '色彩语言',
    description: '五行五色在古建筑中的等级森严体系',
    url: '/cipher?section=color',
    tags: ['色彩', '五行', '等级'],
  },
  {
    id: 'space-philosophy',
    type: 'knowledge',
    title: '空间哲学',
    description: '中轴对称与院落布局中的礼制秩序',
    url: '/cipher?section=space',
    tags: ['空间', '哲学', '对称'],
  },
]

// 省份数据
const provinceData: SearchableItem[] = [
  {
    id: 'beijing',
    type: 'province',
    title: '北京',
    description: '中国首都，古建筑文化中心',
    url: '/dataviz?province=beijing',
    tags: ['华北', '首都'],
  },
  {
    id: 'shaanxi',
    type: 'province',
    title: '陕西',
    description: '西部文化古都，历史遗迹众多',
    url: '/dataviz?province=shaanxi',
    tags: ['西部', '古都'],
  },
  {
    id: 'zhejiang',
    type: 'province',
    title: '浙江',
    description: '江南水乡，民居建筑特色明显',
    url: '/dataviz?province=zhejiang',
    tags: ['江南', '民居'],
  },
]

// 全局初始化标志，防止重复初始化（幂等性）
let searchIndexInitialized = false

export function useSearchIndex() {
  useEffect(() => {
    // 只在第一次挂载时初始化，后续挂载跳过
    if (searchIndexInitialized) {
      return
    }

    const allSearchItems: SearchableItem[] = [...buildingsData, ...knowledgeData, ...provinceData]
    initializeSearchIndex(allSearchItems)
    searchIndexInitialized = true
  }, [])
}
