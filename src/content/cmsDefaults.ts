export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline' | 'gold'

export type HomeFeatureIconKey = 'BookOpen' | 'Layers' | 'Sparkles' | 'Globe' | 'BarChart3'

export interface HomeHeroContent {
  title: string
  subtitle: string
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText: string
  secondaryButtonLink: string
  backgroundImage: string
}

export interface HomeFeatureContent {
  title: string
  description: string
  path: string
  badge: string
  category: string
  icon: HomeFeatureIconKey
  color: string
  badgeVariant: BadgeVariant
}

export interface HomeStatContent {
  value: string
  label: string
  icon: string
  color: string
}

export interface HomeCtaContent {
  badge: string
  title: string
  description: string
  primaryButtonText: string
  primaryButtonLink: string
  secondaryButtonText: string
  secondaryButtonLink: string
}

export interface HomePageContent {
  hero: HomeHeroContent
  features: HomeFeatureContent[]
  stats: HomeStatContent[]
  cta: HomeCtaContent
}

export interface CipherHeroContent {
  eyebrow: string
  title: string
  description: string
  subtext: string
}

export interface CipherCategoryContent {
  id: string
  title: string
  description: string
  color: string
  bgColor: string
  badgeVariant: BadgeVariant
}

export interface CipherHighlightContent {
  badge: string
  title: string
  paragraphs: string[]
  coverText: string
  actionText: string
  knowledgeId: string
}

export interface CipherCtaStatContent {
  value: string
  label: string
}

export interface CipherCtaContent {
  title: string
  description: string
  stats: CipherCtaStatContent[]
}

export interface CipherPageContent {
  hero: CipherHeroContent
  categories: CipherCategoryContent[]
  highlight: CipherHighlightContent
  cta: CipherCtaContent
}

export interface SimpleHeroContent {
  title: string
  description: string
}

export interface ImmersiveHeroContent {
  eyebrow: string
  title: string
  description: string
  subtext: string
}

export interface ImmersiveBuildingContent {
  id: string
  name: string
  region: string
}

export interface ImmersivePageContent {
  hero: ImmersiveHeroContent
  buildings: ImmersiveBuildingContent[]
}

export interface CodexPageContent {
  hero: SimpleHeroContent
  searchPlaceholder: string
}

export interface DecoderPageContent {
  hero: SimpleHeroContent
}

export interface DataVizPageContent {
  hero: SimpleHeroContent
}

type CmsDefaults = {
  home: HomePageContent
  cipher: CipherPageContent
  immersive: ImmersivePageContent
  codex: CodexPageContent
  decoder: DecoderPageContent
  dataviz: DataVizPageContent
}

export const cmsDefaults: CmsDefaults = {
  home: {
    hero: {
      title: '华构解码',
      subtitle: '用现代科技解读中国古代建筑的智慧密码\n探索千年建筑文明的工程奇迹与文化瑰宝',
      primaryButtonText: '开始探索',
      primaryButtonLink: '/codex',
      secondaryButtonText: '沉浸漫游',
      secondaryButtonLink: '/immersive',
      backgroundImage: '/images/hero/forbidden-city-ink.png',
    },
    features: [
      {
        title: '建筑图鉴',
        description: '浏览中国古代建筑瑰宝，探索民居、宫府、皇宫、桥梁的建筑之美',
        path: '/codex',
        badge: '参考',
        category: '知识库',
        icon: 'BookOpen',
        color: 'text-vermilion',
        badgeVariant: 'gold',
      },
      {
        title: '结构解码',
        description: '3D爆炸图解析榫卯结构、斗拱力学，揭示古建筑的工程智慧',
        path: '/decoder',
        badge: '3D互动',
        category: '实验室',
        icon: 'Layers',
        color: 'text-glaze-blue',
        badgeVariant: 'destructive',
      },
      {
        title: '文化密码',
        description: '解读风水布局、装饰符号、色彩语言背后的文化内涵',
        path: '/cipher',
        badge: '深度',
        category: '研究',
        icon: 'Sparkles',
        color: 'text-gold',
        badgeVariant: 'secondary',
      },
      {
        title: '沉浸漫游',
        description: '3D自由漫游与VR体验，穿越时空感受古建筑的宏伟',
        path: '/immersive',
        badge: 'VR开发中',
        category: '体验',
        icon: 'Globe',
        color: 'text-vermilion',
        badgeVariant: 'destructive',
      },
      {
        title: '数据可视',
        description: '时间轴演化、地域对比、技术脉络的可视化呈现',
        path: '/dataviz',
        badge: '数据',
        category: '分析',
        icon: 'BarChart3',
        color: 'text-glaze-blue',
        badgeVariant: 'outline',
      },
    ],
    stats: [
      { value: '1000+', label: '古建筑档案', icon: '🏛️', color: 'from-vermilion/20 to-transparent' },
      { value: '6', label: '主要朝代', icon: '📜', color: 'from-glaze-blue/20 to-transparent' },
      { value: '4', label: '建筑类型', icon: '🏗️', color: 'from-gold/20 to-transparent' },
      { value: '34', label: '省份覆盖', icon: '🗺️', color: 'from-vermilion/20 to-transparent' },
    ],
    cta: {
      badge: '开启探索之旅',
      title: '准备好探索了吗？',
      description: '开启一段穿越千年的建筑文化之旅\n感受中华民族的建筑智慧与文化瑰宝',
      primaryButtonText: '进入建筑图鉴',
      primaryButtonLink: '/codex',
      secondaryButtonText: '沉浸漫游体验',
      secondaryButtonLink: '/immersive',
    },
  },
  cipher: {
    hero: {
      eyebrow: '文化解读',
      title: '文化密码',
      description:
        '风水布局的山水意蕴、装饰符号的深层寓意、色彩语言的等级制度、空间哲学的权力演绎。' +
        '这不仅是建筑表面的装饰，更是中国古人智慧的具体体现。',
      subtext: '探索四大知识体系，理解古建筑背后的文化底蕴与建筑哲学',
    },
    categories: [
      {
        id: 'fengshui',
        title: '风水布局',
        description: '坐北朝南、负阴抱阳，解读建筑选址与朝向的智慧',
        color: 'text-glaze-blue',
        bgColor: 'bg-glaze-blue/10',
        badgeVariant: 'secondary',
      },
      {
        id: 'symbol',
        title: '装饰符号',
        description: '龙凤呈祥、福禄寿喜，每一处雕刻都有深意',
        color: 'text-glaze-blue',
        bgColor: 'bg-glaze-blue/10',
        badgeVariant: 'secondary',
      },
      {
        id: 'color',
        title: '色彩语言',
        description: '五行五色，等级森严的建筑色彩密码',
        color: 'text-glaze-blue',
        bgColor: 'bg-glaze-blue/10',
        badgeVariant: 'secondary',
      },
      {
        id: 'space',
        title: '空间哲学',
        description: '中轴对称、院落递进，空间布局中的礼制秩序',
        color: 'text-ink-black',
        bgColor: 'bg-ink-black/10',
        badgeVariant: 'outline',
      },
    ],
    highlight: {
      badge: '精选知识',
      title: '中轴对称的权力秩序',
      paragraphs: [
        '中国古建筑的对称设计源自宇宙观：认为宇宙有一条"中线"，代表秩序和平衡。紫禁城以中轴线为核心，建筑左右对称分布，体现了中国传统的"中"与"和"的思想。',
        '从午门到神武门，全长约960米的中轴线上，依次排列着三大殿和后宫建筑，形成气势恢宏的建筑群。这种布局不仅体现了皇权的至高无上，更蕴含着中国古人"天人合一"的宇宙观。',
      ],
      coverText: '紫禁城中轴线',
      actionText: '深入了解',
      knowledgeId: 'spa-1',
    },
    cta: {
      title: '探索文化密码的无限世界',
      description:
        '20个精心设计的知识点，从不同角度诠释中国古建筑的文化内涵。每一个知识点都连接到真实的建筑案例，帮助你理解古人的智慧。',
      stats: [
        { value: '4', label: '大知识体系' },
        { value: '20', label: '个知识点' },
        { value: '10+', label: '相关建筑' },
      ],
    },
  },
  immersive: {
    hero: {
      eyebrow: '时空漫游',
      title: '沉浸漫游',
      description:
        '通过历史时期的演变，深入体验古建筑的建造、兴衰与重生。每座建筑都有属于自己的时代故事。',
      subtext: '探索多个历史时期，理解建筑如何见证历史的演进与文化的沉淀',
    },
    buildings: [
      { id: 'forbidden-city', name: '故宫太和殿', region: '北京' },
      { id: 'zhaozhou-bridge', name: '赵州桥', region: '河北' },
      { id: 'pingyao-ancient-city', name: '平遥古城', region: '山西' },
    ],
  },
  codex: {
    hero: {
      title: '建筑图鉴',
      description: '浏览中国古代建筑瑰宝，探索民居、宫府、皇宫、桥梁的建筑之美',
    },
    searchPlaceholder: '搜索建筑名称、地点...',
  },
  decoder: {
    hero: {
      title: '结构解码',
      description: '通过详细的建筑结构分析，探索中国古代建筑的工程智慧与工艺精髓',
    },
  },
  dataviz: {
    hero: {
      title: '数据可视',
      description: '时间轴演化、地域对比、技术脉络的可视化呈现',
    },
  },
}

export type CmsPageSlug = keyof typeof cmsDefaults
export type CmsPageContentMap = typeof cmsDefaults

type UnknownRecord = Record<string, unknown>

function isPlainObject(value: unknown): value is UnknownRecord {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value)
}

function mergeArrayWithDefaults(defaults: unknown[], nextValue: unknown): unknown[] {
  if (!Array.isArray(nextValue)) {
    return defaults
  }

  if (defaults.length === 0) {
    return nextValue
  }

  const defaultItem = defaults[0]
  const result: unknown[] = []
  const length = Math.max(defaults.length, nextValue.length)

  for (let index = 0; index < length; index += 1) {
    const template = index < defaults.length ? defaults[index] : defaultItem
    const incoming = nextValue[index]

    if (isPlainObject(template)) {
      result[index] = mergeCmsContent(template, incoming)
      continue
    }

    if (typeof template === 'string') {
      if (typeof incoming === 'string' && incoming.trim()) {
        result[index] = incoming
      } else {
        result[index] = template
      }
      continue
    }

    if (incoming === undefined || incoming === null) {
      result[index] = template
      continue
    }

    result[index] = incoming
  }

  return result
}

export function mergeCmsContent<T extends object>(defaults: T, data: unknown): T {
  if (!isPlainObject(data)) {
    return defaults
  }

  const defaultsRecord = defaults as UnknownRecord
  const result: UnknownRecord = { ...data }

  Object.keys(defaultsRecord).forEach((key) => {
    const defaultValue = defaultsRecord[key]
    const nextValue = (data as UnknownRecord)[key]

    if (Array.isArray(defaultValue)) {
      result[key] = mergeArrayWithDefaults(defaultValue, nextValue)
      return
    }

    if (isPlainObject(defaultValue)) {
      result[key] = mergeCmsContent(defaultValue, nextValue)
      return
    }

    if (typeof defaultValue === 'string') {
      if (typeof nextValue === 'string' && nextValue.trim()) {
        result[key] = nextValue
      } else {
        result[key] = defaultValue
      }
      return
    }

    result[key] = typeof nextValue === typeof defaultValue ? nextValue : defaultValue
  })

  return result as T
}
