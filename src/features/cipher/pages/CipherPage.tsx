import { useEffect, useState, type ComponentType } from 'react'
import { motion } from 'framer-motion'
import { Compass, Palette, Layout, Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { KnowledgeDetailDialog } from '../components/KnowledgeDetailDialog'
import {
  fengshuiKnowledge,
  symbolKnowledge,
  colorKnowledge,
  spaceKnowledge,
} from '../data/knowledge'
import type { CipherCategory, CipherKnowledge } from '../types'
import { RuyiPattern, CloudPattern } from '@/components/moyu-guji/patterns'
import { useCmsPage } from '@/hooks/useCmsPage'
import { cmsDefaults } from '@/content/cmsDefaults'

const fallbackKnowledge: Record<string, CipherKnowledge[]> = {
  fengshui: fengshuiKnowledge,
  symbol: symbolKnowledge,
  color: colorKnowledge,
  space: spaceKnowledge,
}

const iconMap: Record<string, ComponentType<{ className?: string }>> = {
  fengshui: Compass,
  symbol: Sparkles,
  color: Palette,
  space: Layout,
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5 },
  },
}

export function CipherPage() {
  const [selectedKnowledge, setSelectedKnowledge] = useState<CipherKnowledge | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [knowledgeMap, setKnowledgeMap] = useState(fallbackKnowledge)
  const { content } = useCmsPage('cipher', cmsDefaults.cipher)

  const handleKnowledgeClick = (knowledge: CipherKnowledge) => {
    setSelectedKnowledge(knowledge)
    setIsDialogOpen(true)
  }

  useEffect(() => {
    let active = true
    fetch('/api/cipher')
      .then(async (res) => {
        if (!res.ok) return null
        return (await res.json()) as unknown
      })
      .then((data) => {
        if (!active) return
        const items = Array.isArray(data) ? data : (data as { items?: unknown[] })?.items
        if (!items || !Array.isArray(items) || items.length === 0) return
        const nextMap: Record<string, CipherKnowledge[]> = {
          fengshui: [],
          symbol: [],
          color: [],
          space: [],
        }
        items.forEach((item) => {
          if (!item || typeof item !== 'object') return
          const record = item as Record<string, unknown>
          const category = typeof record.category === 'string' ? record.category : 'other'
          const normalized: CipherKnowledge = {
            id: typeof record.id === 'string' ? record.id : String(record.id ?? ''),
            title: typeof record.title === 'string' ? record.title : '',
            description: typeof record.description === 'string'
              ? record.description
              : typeof record.summary === 'string'
                ? record.summary
                : '',
            content: typeof record.content === 'string' ? record.content : '',
            relatedBuildings: Array.isArray(record.relatedBuildings)
              ? (record.relatedBuildings.filter((value) => typeof value === 'string') as string[])
              : [],
            imageUrl: typeof record.imageUrl === 'string' ? record.imageUrl : undefined,
            tags: Array.isArray(record.tags)
              ? (record.tags.filter((value) => typeof value === 'string') as string[])
              : [],
          }
          if (!nextMap[category]) {
            nextMap[category] = []
          }
          nextMap[category].push(normalized)
        })
        setKnowledgeMap({ ...fallbackKnowledge, ...nextMap })
      })
      .catch(() => {
        // 接口不可用时继续使用本地内容
      })

    return () => {
      active = false
    }
  }, [])

  const hero = { ...cmsDefaults.cipher.hero, ...content.hero }
  const baseCategories =
    content.categories?.length ? content.categories : cmsDefaults.cipher.categories
  const highlightSource =
    content.highlight && typeof content.highlight === 'object' ? content.highlight : {}
  const highlight = { ...cmsDefaults.cipher.highlight, ...highlightSource }
  const cipherCategories: CipherCategory[] = baseCategories.map((category) => ({
    ...category,
    icon: iconMap[category.id] ?? Sparkles,
    knowledge: knowledgeMap[category.id] ?? [],
  }))

  const highlightParagraphs =
    highlight.paragraphs?.length ? highlight.paragraphs : cmsDefaults.cipher.highlight.paragraphs
  const allKnowledge = Object.values(knowledgeMap).flat()
  const highlightKnowledge =
    allKnowledge.find((item) => item.id === highlight.knowledgeId) ?? spaceKnowledge[0]

  const cta = { ...cmsDefaults.cipher.cta, ...content.cta }
  const ctaStats = cta.stats?.length ? cta.stats : cmsDefaults.cipher.cta.stats

  return (
    <div className="relative min-h-screen bg-paper-white">
      {/* 背景装饰 */}
      <CloudPattern position="top" opacity={0.25} />

      {/* 顶部标题 */}
      <div className="relative border-b border-ink-gray/20 bg-gradient-to-r from-paper-cream via-paper-cream to-vermilion/5 overflow-hidden">
        {/* 装饰背景 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-vermilion/20 blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-glaze-blue/20 blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-12 bg-gradient-to-r from-vermilion to-glaze-blue rounded-full" />
              <span className="text-sm font-medium text-vermilion uppercase tracking-widest">
                {hero.eyebrow}
              </span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl font-bold text-ink-black mb-4">
              {hero.title}
            </h1>

            <p className="text-lg text-ink-gray max-w-2xl leading-relaxed">
              {hero.description}
            </p>

            <p className="mt-4 text-sm text-ink-gray/70">
              {hero.subtext}
            </p>
          </motion.div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-16">
        {/* 分类说明 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4"
        >
          {cipherCategories.map((category, idx) => {
            const Icon = category.icon
            return (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <div className="h-full rounded-xl bg-gradient-to-br from-ink-black/5 to-ink-gray/5 p-6 border border-ink-gray/10 hover:border-ink-gray/20 transition-all duration-300">
                  <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${category.bgColor} mb-4`}>
                    <Icon className={`w-6 h-6 ${category.color}`} />
                  </div>
                  <h3 className="font-serif text-lg font-bold text-ink-black mb-2">{category.title}</h3>
                  <p className="text-sm text-ink-gray leading-relaxed">{category.description}</p>
                  <div className="mt-4 text-xs text-ink-gray/60">
                    {category.knowledge.length} 个知识点
                  </div>
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* 知识体系详细卡片 */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-8 md:grid-cols-2 mb-16"
        >
          {cipherCategories.map((category) => {
            const Icon = category.icon
            return (
              <motion.div key={category.id} variants={itemVariants}>
                <Card className="group relative h-full overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border border-ink-gray/15 hover:border-ink-gray/30 bg-gradient-to-br from-paper-white to-ink-black/2">
                  {/* 背景梯度装饰 */}
                  <div className="absolute inset-0 bg-gradient-to-br from-ink-black/3 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* 装饰圆形 */}
                  <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-gradient-to-br from-vermilion/10 to-glaze-blue/10 blur-2xl group-hover:scale-150 transition-transform duration-500" />

                  <CardHeader className={`relative z-10 ${category.bgColor} border-b border-ink-gray/10`}>
                    <div className="flex items-start justify-between mb-6">
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-paper-white/90 p-3 shadow-md group-hover:shadow-lg transition-shadow">
                          <Icon className={`h-6 w-6 ${category.color}`} />
                        </div>
                        <div>
                          <CardTitle className="font-serif text-2xl group-hover:text-vermilion transition-colors">
                            {category.title}
                          </CardTitle>
                          <p className="text-xs text-ink-gray mt-1 uppercase tracking-wide">
                            {category.knowledge.length} 个知识点
                          </p>
                        </div>
                      </div>
                    </div>
                    <CardDescription className="text-ink-gray text-base leading-relaxed">
                      {category.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="relative z-10 pt-8">
                    <div className="space-y-3">
                      {category.knowledge.slice(0, 5).map((k, idx) => (
                        <motion.button
                          key={k.id}
                          onClick={() => handleKnowledgeClick(k)}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ type: "spring", stiffness: 300, damping: 20, delay: idx * 0.04 }}
                          className="w-full rounded-lg border border-transparent bg-gradient-to-r from-ink-gray/3 to-transparent p-4 text-left transition-all hover:border-ink-gray/30 hover:bg-gradient-to-r hover:from-ink-gray/8 hover:to-ink-gray/3 group/item hover:shadow-md"
                        >
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 mt-1">
                              <div className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-br from-vermilion/30 to-glaze-blue/30 text-xs font-bold text-ink-black group-hover/item:from-vermilion/50 group-hover/item:to-glaze-blue/50 transition-all">
                                {idx + 1}
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-ink-black text-sm group-hover/item:text-vermilion transition-colors">
                                {k.title}
                              </p>
                              <p className="text-xs text-ink-gray/70 mt-1 line-clamp-2 group-hover/item:text-ink-gray transition-colors">
                                {k.description}
                              </p>
                            </div>
                            <div className="flex-shrink-0 text-ink-gray/30 group-hover/item:text-vermilion transition-colors">
                              →
                            </div>
                          </div>
                        </motion.button>
                      ))}
                    </div>
                  </CardContent>

                  {/* 底部高亮线 */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-vermilion to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Card>
              </motion.div>
            )
          })}
        </motion.div>

        {/* 精选卡片 */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-ink-black via-ink-black/95 to-ink-black text-paper-white shadow-2xl cursor-pointer transition-all duration-500 hover:shadow-3xl hover:-translate-y-2">
            {/* 如意纹装饰 */}
            <RuyiPattern position="top-left" size={150} opacity={0.2} />
            <RuyiPattern position="bottom-right" size={150} opacity={0.2} />

            {/* 装饰背景 */}
            <div className="absolute inset-0">
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-vermilion/10 to-glaze-blue/10 blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-glaze-blue/10 to-vermilion/10 blur-3xl translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
            </div>

            <div className="relative z-10 grid md:grid-cols-2 gap-0">
              {/* 左侧图片区域 */}
              <div className="aspect-[4/3] md:aspect-auto overflow-hidden bg-gradient-to-br from-ink-black/50 to-ink-gray/50 flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-vermilion/20 via-transparent to-glaze-blue/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div
                  animate={{ rotate: [0, 5, -5, 0], y: [0, 10, -10, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                  className="relative z-10 text-center"
                >
                  <span className="font-serif text-4xl md:text-5xl font-bold text-paper-white/80 drop-shadow-lg">
                    {highlight.coverText}
                  </span>
                </motion.div>
              </div>

              {/* 右侧内容区域 */}
              <div className="p-8 md:p-12 flex flex-col justify-between">
                <div>
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    <span className="rounded-full bg-gradient-to-r from-vermilion to-glaze-blue px-4 py-1.5 text-xs font-bold tracking-widest inline-block mb-6 shadow-lg">
                      {highlight.badge}
                    </span>
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 font-serif text-3xl md:text-4xl font-bold mb-6 leading-tight"
                  >
                    {highlight.title}
                  </motion.h3>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                  >
                    {highlightParagraphs.map((paragraph, index) => (
                      <p
                        key={`${paragraph}-${index}`}
                        className={`leading-relaxed text-base font-light ${
                          index === 0 ? 'text-paper-white/90' : 'text-paper-white/75'
                        }`}
                      >
                        {paragraph}
                      </p>
                    ))}
                  </motion.div>
                </div>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.05 }}
                  onClick={() => handleKnowledgeClick(highlightKnowledge)}
                  className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-vermilion to-glaze-blue font-semibold text-ink-black hover:shadow-lg hover:scale-105 transition-all duration-300 group/btn"
                >
                  <span>{highlight.actionText}</span>
                  <motion.span
                    animate={{ x: [0, 5, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="group-hover/btn:translate-x-1 transition-transform"
                  >
                    →
                  </motion.span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-xl bg-gradient-to-r from-glaze-blue/10 via-transparent to-vermilion/10 border border-glaze-blue/20 p-8 md:p-12 text-center"
        >
          <h3 className="font-serif text-2xl md:text-3xl font-bold text-ink-black mb-4">
            {cta.title}
          </h3>
          <p className="text-ink-gray max-w-2xl mx-auto mb-8">
            {cta.description}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {ctaStats.map((stat, index) => (
              <div key={`${stat.value}-${stat.label}`} className="flex items-center gap-4">
                <div className="text-sm text-ink-gray/70">
                  <span className="font-bold text-ink-black">{stat.value}</span> {stat.label}
                </div>
                {index < ctaStats.length - 1 && (
                  <div className="w-1 h-1 rounded-full bg-ink-gray/30" />
                )}
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* 详情弹窗 */}
      <KnowledgeDetailDialog
        knowledge={selectedKnowledge}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  )
}
