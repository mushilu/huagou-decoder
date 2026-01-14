import { useState } from 'react'
import { motion } from 'framer-motion'
import { Clock, MapPin, BookOpen } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { immersiveHistories } from '../data/buildingHistories'
import type { BuildingHistory } from '../data/buildingHistories'
import { CloudPattern, WavePattern } from '@/components/moyu-guji/patterns'
import { getSceneThumbnail } from '../utils/sceneThumbnails'

const buildings = [
  { id: 'forbidden-city', name: '故宫太和殿', region: '北京' },
  { id: 'zhaozhou-bridge', name: '赵州桥', region: '河北' },
  { id: 'pingyao-ancient-city', name: '平遥古城', region: '山西' },
]

export function ImmersivePage() {
  const [selectedBuilding, setSelectedBuilding] = useState<string>('forbidden-city')
  const [selectedPeriod, setSelectedPeriod] = useState<string>('original')

  const currentHistory = immersiveHistories[selectedBuilding] as BuildingHistory | undefined
  const currentPeriod = currentHistory?.periods.find((p) => p.id === selectedPeriod)

  return (
    <div className="relative min-h-screen bg-paper-white">
      {/* 背景装饰 */}
      <CloudPattern position="top" opacity={0.2} />
      <WavePattern position="bottom" opacity={0.2} />

      {/* 顶部标题 */}
      <div className="relative border-b border-ink-gray/20 bg-gradient-to-r from-paper-cream via-paper-cream to-glaze-blue/5 overflow-hidden">
        {/* 装饰背景 */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-96 h-96 rounded-full bg-glaze-blue/20 blur-3xl -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-vermilion/20 blur-3xl translate-x-1/2 translate-y-1/2" />
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="h-1 w-12 bg-gradient-to-r from-glaze-blue to-vermilion rounded-full" />
              <span className="text-sm font-medium text-glaze-blue uppercase tracking-widest">时空漫游</span>
            </div>

            <h1 className="font-serif text-5xl md:text-6xl font-bold text-ink-black mb-4">沉浸漫游</h1>

            <p className="text-lg text-ink-gray max-w-2xl leading-relaxed">
              通过历史时期的演变，深入体验古建筑的建造、兴衰与重生。每座建筑都有属于自己的时代故事。
            </p>

            <p className="mt-4 text-sm text-ink-gray/70">
              探索多个历史时期，理解建筑如何见证历史的演进与文化的沉淀
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* 建筑选择 */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-1 h-8 bg-gradient-to-b from-glaze-blue to-glaze-blue/50 rounded-full" />
            <h2 className="font-serif text-3xl font-bold text-ink-black">选择建筑</h2>
            <span className="text-sm text-ink-gray/60 font-medium ml-2">({buildings.length} 座)</span>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {buildings.map((building, idx) => (
              <motion.button
                key={building.id}
                onClick={() => {
                  setSelectedBuilding(building.id)
                  setSelectedPeriod('original')
                }}
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", stiffness: 400, damping: 15, delay: idx * 0.08 }}
                className={`relative rounded-2xl border-2 text-left transition-all overflow-hidden group h-48 ${
                  selectedBuilding === building.id
                    ? 'border-glaze-blue shadow-xl'
                    : 'border-ink-gray/20 hover:border-glaze-blue/50 hover:shadow-lg'
                }`}
              >
                {/* 场景缩略图背景 */}
                {(() => {
                  const thumb = getSceneThumbnail(building.id)
                  return thumb ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                      style={{ backgroundImage: `url(${thumb})` }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-glaze-blue/10 to-ink-black/5" />
                  )
                })()}

                {/* 渐变遮罩 */}
                <div className={`absolute inset-0 transition-opacity ${
                  selectedBuilding === building.id
                    ? 'bg-gradient-to-t from-glaze-blue/90 via-glaze-blue/50 to-transparent'
                    : 'bg-gradient-to-t from-ink-black/80 via-ink-black/40 to-transparent group-hover:from-glaze-blue/70 group-hover:via-glaze-blue/30'
                }`} />

                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                  <h3 className={`font-serif text-xl font-bold mb-2 transition-colors ${
                    selectedBuilding === building.id ? 'text-paper-white' : 'text-paper-white group-hover:text-paper-cream'
                  }`}>
                    {building.name}
                  </h3>
                  <div className={`flex items-center gap-2 text-sm transition-colors ${
                    selectedBuilding === building.id ? 'text-paper-white/80' : 'text-paper-white/70 group-hover:text-paper-cream/90'
                  }`}>
                    <MapPin className="h-4 w-4 flex-shrink-0" />
                    <span>{building.region}</span>
                  </div>
                </div>

                {selectedBuilding === building.id && (
                  <motion.div
                    className="absolute top-4 right-4 w-3 h-3 rounded-full bg-paper-white shadow-lg"
                    layoutId="selected-indicator"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* 主要内容 */}
        {currentHistory && (
          <motion.div
            key={selectedBuilding}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* 建筑信息 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-14"
            >
              <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-r from-ink-black/2 via-transparent to-glaze-blue/3">
                <div className="relative bg-gradient-to-r from-glaze-blue/10 to-transparent px-10 py-10 border-b border-glaze-blue/20">
                  {/* 装饰元素 */}
                  <div className="absolute right-0 top-0 w-64 h-64 bg-glaze-blue/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />

                  <div className="relative z-10">
                    <motion.h2
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="font-serif text-4xl md:text-5xl font-bold text-ink-black mb-4"
                    >
                      {currentHistory.fullName}
                    </motion.h2>
                    <motion.p
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.1 }}
                      className="text-lg text-ink-gray leading-relaxed font-light"
                    >
                      {currentHistory.summary}
                    </motion.p>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* 时间轴选择 */}
            <motion.div
              className="mb-12"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <div className="flex items-center gap-3 mb-7">
                <div className="w-1 h-8 bg-gradient-to-b from-vermilion to-vermilion/50 rounded-full" />
                <h3 className="font-serif text-2xl font-bold text-ink-black flex items-center gap-2">
                  <Clock className="h-6 w-6 text-vermilion" />
                  历史时期
                </h3>
              </div>
              <div className="grid gap-4 md:grid-cols-3">
                {currentHistory.periods.map((period, idx) => (
                  <motion.button
                    key={period.id}
                    onClick={() => setSelectedPeriod(period.id)}
                    whileHover={{ scale: 1.04, y: -4 }}
                    whileTap={{ scale: 0.96 }}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 400, damping: 15, delay: idx * 0.07 }}
                    className={`relative rounded-2xl border-2 p-6 text-left transition-all overflow-hidden group ${
                      selectedPeriod === period.id
                        ? 'border-vermilion bg-vermilion/8 shadow-lg'
                        : 'border-ink-gray/20 hover:border-vermilion/50 hover:bg-vermilion/4 hover:shadow-md'
                    }`}
                  >
                    {/* 背景装饰 */}
                    <div className="absolute inset-0 bg-gradient-to-br from-vermilion/0 to-vermilion/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                    <div className="relative z-10">
                      <div className="mb-3 flex items-center gap-3">
                        <motion.div
                          className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-vermilion to-vermilion/70 text-xs font-bold text-paper-white shadow-md"
                          whileHover={{ scale: 1.1 }}
                        >
                          {idx + 1}
                        </motion.div>
                        <span className="text-sm font-semibold text-ink-gray group-hover:text-ink-black transition-colors">
                          {period.year}
                        </span>
                      </div>
                      <h4 className="font-serif text-lg font-bold text-ink-black group-hover:text-vermilion transition-colors">
                        {period.name}
                      </h4>
                    </div>

                    {selectedPeriod === period.id && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl border-2 border-vermilion/40"
                        initial={{ scale: 0.9 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring" }}
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* 时期详情 */}
            {currentPeriod && (
              <motion.div
                key={currentPeriod.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="space-y-6"
              >
                {/* 标题 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4 }}
                  className="mb-8"
                >
                  <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-r from-vermilion/5 to-transparent">
                    <div className="relative bg-gradient-to-r from-vermilion/15 to-transparent px-10 py-8 border-b border-vermilion/20">
                      {/* 装饰元素 */}
                      <div className="absolute left-0 top-0 w-40 h-40 bg-vermilion/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl" />

                      <div className="relative z-10">
                        <h3 className="font-serif text-3xl md:text-4xl font-bold text-ink-black mb-3">
                          {currentPeriod.title}
                        </h3>
                        <div className="flex items-center gap-3">
                          <div className="h-1 w-12 bg-gradient-to-r from-vermilion to-vermilion/50 rounded-full" />
                          <span className="text-sm font-semibold text-vermilion">{currentPeriod.year}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* 主要描述 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-paper-white to-ink-black/2">
                    <CardHeader className="border-b border-ink-gray/15 bg-gradient-to-r from-glaze-blue/5 to-transparent">
                      <CardTitle className="text-2xl flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-glaze-blue rounded-full" />
                        历史叙述
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-8">
                      <div className="prose prose-sm max-w-none space-y-6 text-ink-black">
                        {currentPeriod.description.split('\n\n').map((paragraph, idx) => (
                          <motion.p
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: idx * 0.05 }}
                            className="leading-8 text-ink-gray whitespace-pre-wrap text-justify font-light"
                          >
                            {paragraph}
                          </motion.p>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* 要点 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                >
                  <Card className="border-0 shadow-lg overflow-hidden bg-gradient-to-br from-paper-white to-ink-black/2">
                    <CardHeader className="border-b border-ink-gray/15 bg-gradient-to-r from-glaze-blue/5 to-transparent">
                      <CardTitle className="text-2xl flex items-center gap-3">
                        <BookOpen className="h-5 w-5 text-glaze-blue" />
                        关键信息
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-8">
                      <div className="grid gap-4 md:grid-cols-2">
                        {currentPeriod.keyPoints.map((point, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: idx * 0.04 }}
                            className="relative flex items-start gap-4 rounded-xl border border-glaze-blue/30 bg-gradient-to-br from-glaze-blue/8 to-glaze-blue/3 p-5 hover:border-glaze-blue/50 hover:shadow-md transition-all group"
                          >
                            {/* 背景装饰 */}
                            <div className="absolute inset-0 bg-gradient-to-br from-glaze-blue/0 to-glaze-blue/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />

                            <motion.div
                              className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-glaze-blue to-glaze-blue/70 shadow-sm"
                              whileHover={{ scale: 1.15 }}
                              transition={{ type: "spring", stiffness: 400, damping: 10 }}
                            >
                              <div className="w-1.5 h-1.5 rounded-full bg-paper-white" />
                            </motion.div>
                            <p className="relative z-10 text-sm text-ink-gray font-light leading-relaxed">
                              {point}
                            </p>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* 亮点 */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                >
                  <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-vermilion/10 to-vermilion/5">
                    <div className="absolute inset-0 bg-gradient-to-br from-vermilion/5 via-transparent to-transparent" />
                    <CardHeader className="relative z-10 border-b-2 border-vermilion/30 bg-gradient-to-r from-vermilion/15 to-transparent">
                      <CardTitle className="text-2xl flex items-center gap-3">
                        <div className="w-1.5 h-6 bg-gradient-to-b from-vermilion to-vermilion/50 rounded-full" />
                        精彩亮点
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10 pt-8">
                      <p className="leading-8 text-ink-gray italic font-light text-justify">
                        {currentPeriod.highlights}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            )}

            {/* 导航提示 */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.05 }}
              className="mt-16 relative"
            >
              <div className="relative overflow-hidden rounded-2xl border-2 border-ink-gray/20 bg-gradient-to-r from-glaze-blue/8 to-vermilion/8 p-8 md:p-12 text-center backdrop-blur-sm">
                {/* 装饰背景 */}
                <div className="absolute inset-0">
                  <div className="absolute top-0 right-0 w-48 h-48 bg-glaze-blue/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
                  <div className="absolute bottom-0 left-0 w-48 h-48 bg-vermilion/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl" />
                </div>

                <div className="relative z-10">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-glaze-blue/30 to-vermilion/30 mb-4">
                    <span className="text-xl">💡</span>
                  </div>
                  <p className="text-lg text-ink-black font-medium">
                    点击不同的时期卡片，探索这座建筑在各个历史时代的精彩故事与变化
                  </p>
                  <p className="mt-3 text-sm text-ink-gray/70">
                    每个时期都蕴含着独特的历史意义和建筑智慧
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
