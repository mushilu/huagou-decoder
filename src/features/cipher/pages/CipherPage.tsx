import { useState } from 'react'
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

const cipherCategories: CipherCategory[] = [
  {
    id: 'fengshui',
    icon: Compass,
    title: '风水布局',
    description: '坐北朝南、负阴抱阳，解读建筑选址与朝向的智慧',
    color: 'text-glaze-blue',
    bgColor: 'bg-glaze-blue/10',
    knowledge: fengshuiKnowledge,
    badgeVariant: 'secondary' as const,
  },
  {
    id: 'symbol',
    icon: Sparkles,
    title: '装饰符号',
    description: '龙凤呈祥、福禄寿喜，每一处雕刻都有深意',
    color: 'text-glaze-blue',
    bgColor: 'bg-glaze-blue/10',
    knowledge: symbolKnowledge,
    badgeVariant: 'secondary' as const,
  },
  {
    id: 'color',
    icon: Palette,
    title: '色彩语言',
    description: '五行五色，等级森严的建筑色彩密码',
    color: 'text-glaze-blue',
    bgColor: 'bg-glaze-blue/10',
    knowledge: colorKnowledge,
    badgeVariant: 'secondary' as const,
  },
  {
    id: 'space',
    icon: Layout,
    title: '空间哲学',
    description: '中轴对称、院落递进，空间布局中的礼制秩序',
    color: 'text-ink-black',
    bgColor: 'bg-ink-black/10',
    knowledge: spaceKnowledge,
    badgeVariant: 'outline' as const,
  },
]

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

  const handleKnowledgeClick = (knowledge: CipherKnowledge) => {
    setSelectedKnowledge(knowledge)
    setIsDialogOpen(true)
  }

  return (
    <div className="relative min-h-screen bg-paper-white">
      {/* Background Decoration */}
      <CloudPattern position="top" opacity={0.25} />

      {/* Header */}
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
              <span className="text-sm font-medium text-vermilion uppercase tracking-widest">文化解读</span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl font-bold text-ink-black mb-4">文化密码</h1>

            <p className="text-lg text-ink-gray max-w-2xl leading-relaxed">
              风水布局的山水意蕴、装饰符号的深层寓意、色彩语言的等级制度、空间哲学的权力演绎。
              这不仅是建筑表面的装饰，更是中国古人智慧的具体体现。
            </p>

            <p className="mt-4 text-sm text-ink-gray/70">
              探索四大知识体系，理解古建筑背后的文化底蕴与建筑哲学
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
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

        {/* Featured Knowledge Card */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16"
        >
          <div className="relative group overflow-hidden rounded-2xl bg-gradient-to-br from-ink-black via-ink-black/95 to-ink-black text-paper-white shadow-2xl cursor-pointer transition-all duration-500 hover:shadow-3xl hover:-translate-y-2">
            {/* Ruyi Pattern Decorations */}
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
                  <span className="font-serif text-4xl md:text-5xl font-bold text-paper-white/80 drop-shadow-lg">紫禁城中轴线</span>
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
                      精选知识
                    </span>
                  </motion.div>

                  <motion.h3
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 font-serif text-3xl md:text-4xl font-bold mb-6 leading-tight"
                  >
                    中轴对称的权力秩序
                  </motion.h3>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.4 }}
                    className="space-y-4"
                  >
                    <p className="text-paper-white/90 leading-relaxed text-base font-light">
                      中国古建筑的对称设计源自宇宙观：认为宇宙有一条"中线"，代表秩序和平衡。紫禁城以中轴线为核心，建筑左右对称分布，体现了中国传统的"中"与"和"的思想。
                    </p>
                    <p className="text-paper-white/75 leading-relaxed text-base font-light">
                      从午门到神武门，全长约960米的中轴线上，依次排列着三大殿和后宫建筑，形成气势恢宏的建筑群。这种布局不仅体现了皇权的至高无上，更蕴含着中国古人"天人合一"的宇宙观。
                    </p>
                  </motion.div>
                </div>

                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.05 }}
                  onClick={() => handleKnowledgeClick(spaceKnowledge[0])}
                  className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-vermilion to-glaze-blue font-semibold text-ink-black hover:shadow-lg hover:scale-105 transition-all duration-300 group/btn"
                >
                  <span>深入了解</span>
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
            探索文化密码的无限世界
          </h3>
          <p className="text-ink-gray max-w-2xl mx-auto mb-8">
            20个精心设计的知识点，从不同角度诠释中国古建筑的文化内涵。每一个知识点都连接到真实的建筑案例，帮助你理解古人的智慧。
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <div className="text-sm text-ink-gray/70">
              <span className="font-bold text-ink-black">4</span> 大知识体系
            </div>
            <div className="w-1 h-1 rounded-full bg-ink-gray/30" />
            <div className="text-sm text-ink-gray/70">
              <span className="font-bold text-ink-black">20</span> 个知识点
            </div>
            <div className="w-1 h-1 rounded-full bg-ink-gray/30" />
            <div className="text-sm text-ink-gray/70">
              <span className="font-bold text-ink-black">10+</span> 相关建筑
            </div>
          </div>
        </motion.div>
      </div>

      {/* Knowledge Detail Dialog */}
      <KnowledgeDetailDialog
        knowledge={selectedKnowledge}
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
      />
    </div>
  )
}
