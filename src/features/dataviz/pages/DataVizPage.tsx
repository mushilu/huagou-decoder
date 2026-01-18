import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BadgeCheck, BarChart3, CheckCircle2, ChevronDown, GitMerge, Layers, Map } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CloudPattern, MeanderPattern } from '@/components/moyu-guji/patterns'
import { useCmsPage } from '@/hooks/useCmsPage'
import { cmsDefaults } from '@/content/cmsDefaults'
import { BatchDistributionChart } from '../components/BatchDistributionChart'
import { CategoryDistributionChart } from '../components/CategoryDistributionChart'
import { ChinaMap } from '../components/ChinaMap'
import { ProvinceDetailCard } from '../components/ProvinceDetailCard'
import {
  buildNationalStats,
  nationalKeyUnitsDataset,
  nationalKeyUnitsItems,
} from '../data/nationalKeyUnitsStats'

export function DataVizPage() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)
  const [batchFilter, setBatchFilter] = useState<'all' | number>('all')
  const [showUpdateNotice, setShowUpdateNotice] = useState(false)
  const [prevTotal, setPrevTotal] = useState(0)
  const { content } = useCmsPage('dataviz', cmsDefaults.dataviz)
  const hero = { ...cmsDefaults.dataviz.hero, ...content.hero }

  const batchOptions = useMemo(() => {
    const batches = Array.from(new Set(nationalKeyUnitsItems.map((item) => item.batch))).sort(
      (a, b) => a - b,
    )
    return [
      { label: '全部批次', value: 'all' as const },
      ...batches.map((batch) => ({ label: `第${batch}批`, value: batch })),
    ]
  }, [nationalKeyUnitsItems])

  const filteredItems = useMemo(
    () =>
      nationalKeyUnitsItems.filter((item) => {
        return batchFilter === 'all' || item.batch === batchFilter
      }),
    [batchFilter],
  )

  const stats = useMemo(() => buildNationalStats(filteredItems), [filteredItems])

  useEffect(() => {
    if (prevTotal !== 0 && stats.total !== prevTotal) {
      setShowUpdateNotice(true)
      const timer = setTimeout(() => setShowUpdateNotice(false), 2000)
      return () => clearTimeout(timer)
    }
    setPrevTotal(stats.total)
  }, [stats.total])

  const selectedProvinceData = useMemo(() => {
    if (!selectedProvince) return null
    return stats.byProvince.find((province) => province.name === selectedProvince) ?? null
  }, [selectedProvince, stats.byProvince])

  const mapData = useMemo(
    () =>
      stats.byProvince
        .filter((province) => province.hasCoordinates)
        .map((province) => ({
          name: province.name,
          buildingCount: province.count,
          coordinates: [province.coordinates.lng, province.coordinates.lat] as [number, number],
        })),
    [stats.byProvince],
  )

  const formattedGeneratedAt = useMemo(() => {
    if (!nationalKeyUnitsDataset.generatedAt) return ''
    return new Date(nationalKeyUnitsDataset.generatedAt).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }, [nationalKeyUnitsDataset.generatedAt])

  return (
    <div className="relative min-h-screen bg-paper-white">
      <CloudPattern position="top" opacity={0.2} />
      <MeanderPattern position="bottom" thickness={3} opacity={0.1} />

      <div className="border-b border-ink-gray/20 bg-paper-cream">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-serif text-4xl font-bold text-ink-black">{hero.title}</h1>
            <p className="mt-2 text-ink-black/70">{hero.description}</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {stats.total === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 rounded-lg bg-yellow-50 border border-yellow-200 p-4"
          >
            <p className="text-yellow-800">⚠️ 当前筛选下暂无可视数据，请调整筛选范围。</p>
          </motion.div>
        ) : null}

        <div className="mb-8 rounded-2xl border border-ink-gray/10 bg-paper-cream/70 p-4 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-sm font-medium text-ink-gray">批次范围</span>
              <div className="flex flex-wrap gap-2">
                {batchOptions.map((option) => (
                  <Button
                    key={option.label}
                    variant={batchFilter === option.value ? 'gold' : 'outline'}
                    size="sm"
                    className="rounded-full px-4"
                    onClick={() => setBatchFilter(option.value)}
                  >
                    {option.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: '条目总数',
              value: stats.total.toString(),
              icon: BarChart3,
              bgColor: 'bg-vermilion/10',
            },
            {
              label: '批次覆盖',
              value: stats.batchCount.toString(),
              icon: Layers,
              bgColor: 'bg-glaze-blue/10',
            },
            {
              label: '类别覆盖',
              value: stats.categoryCount.toString(),
              icon: GitMerge,
              bgColor: 'bg-gold/10',
            },
            {
              label: '省份覆盖',
              value: stats.provinceCount.toString(),
              icon: Map,
              bgColor: 'bg-ink-black/5',
            },
          ].map((stat, index) => {
            const Icon = stat.icon
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(index * 0.1, 0.3) }}
              >
                <Card className="group relative overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg border-ink-gray/10 hover:border-ink-gray/30">
                  <div
                    className={`absolute inset-0 ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
                  />

                  <CardContent className="relative z-10 pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-sm text-ink-gray">{stat.label}</p>
                        <p className="mt-1 font-serif text-3xl font-bold text-ink-black group-hover:text-vermilion transition-colors">
                          {stat.value}
                        </p>
                      </div>
                      <div className="rounded-lg bg-gradient-to-br from-ink-black/10 to-ink-black/5 p-3">
                        <Icon className="h-5 w-5 text-ink-gray group-hover:text-vermilion transition-colors" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="group relative h-full overflow-hidden border-ink-gray/10 hover:border-ink-gray/30 transition-all duration-300 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-vermilion/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="relative z-10">
                <CardTitle className="group-hover:text-vermilion transition-colors">批次分布</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <BatchDistributionChart data={stats.byBatch} />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="group relative h-full overflow-hidden border-ink-gray/10 hover:border-ink-gray/30 transition-all duration-300 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-glaze-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2 group-hover:text-vermilion transition-colors">
                  类别分布
                </CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                {stats.byCategory.length > 0 ? (
                  <CategoryDistributionChart data={stats.byCategory} />
                ) : (
                  <div className="flex h-[300px] items-center justify-center text-sm text-ink-gray">
                    当前筛选下暂无类别分布数据。
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <Card className="group relative overflow-hidden border-ink-gray/10 hover:border-ink-gray/30 transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2 group-hover:text-vermilion transition-colors">
                <BadgeCheck className="h-5 w-5" />
                数据来源与覆盖说明
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
                <div className="space-y-4">
                  {nationalKeyUnitsDataset.sources?.map((source) => (
                    <div
                      key={source.url}
                      className="rounded-xl border border-ink-gray/10 bg-white/80 p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-sm font-semibold text-ink-black">{source.title}</p>
                          <p className="text-xs text-ink-gray">国家文物局公开名录</p>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {source.total} 项
                        </Badge>
                      </div>
                      {source.note ? (
                        <p className="mt-2 text-xs text-ink-gray/80">{source.note}</p>
                      ) : null}
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex text-xs text-glaze-blue hover:text-vermilion transition-colors"
                      >
                        查看国家文物局原文
                      </a>
                    </div>
                  ))}
                  {formattedGeneratedAt ? (
                    <p className="text-xs text-ink-gray/70">数据生成时间：{formattedGeneratedAt}</p>
                  ) : null}
                </div>
                <div className="space-y-4">
                  {nationalKeyUnitsDataset.coverage ? (
                    <div className="rounded-xl border border-ink-gray/10 bg-ink-black/5 p-4">
                      <p className="text-sm font-semibold text-ink-black">覆盖批次</p>
                      <p className="mt-2 text-xs text-ink-gray">
                        已包含：{nationalKeyUnitsDataset.coverage.batches.join('、')} 批
                      </p>
                      {nationalKeyUnitsDataset.coverage.missingBatches.length > 0 ? (
                        <p className="text-xs text-ink-gray">
                          缺失：{nationalKeyUnitsDataset.coverage.missingBatches.join('、')} 批
                        </p>
                      ) : (
                        <p className="text-xs text-ink-gray">缺失：无</p>
                      )}
                      {nationalKeyUnitsDataset.coverage.note ? (
                        <p className="mt-2 text-xs text-ink-gray/80">
                          {nationalKeyUnitsDataset.coverage.note}
                        </p>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8"
        >
          <Card className="group relative h-full overflow-hidden border-ink-gray/10 hover:border-ink-gray/30 transition-all duration-300 hover:shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-glaze-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <CardHeader className="relative z-10 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="group-hover:text-vermilion transition-colors">地域分布</CardTitle>
                {selectedProvince && (
                  <Badge variant="secondary" className="text-xs">
                    已选中：{selectedProvince}
                  </Badge>
                )}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedProvince(null)}>
                重置
                <ChevronDown className="ml-1 h-4 w-4" />
              </Button>
            </CardHeader>
            <CardContent className="relative z-10">
              <ChinaMap
                data={mapData}
                selectedProvince={selectedProvince}
                onProvinceSelect={setSelectedProvince}
              />
            </CardContent>
          </Card>
        </motion.div>

        {selectedProvinceData && (
          <ProvinceDetailCard
            province={selectedProvince}
            totalCount={selectedProvinceData.count}
            categories={selectedProvinceData.categories}
            batches={selectedProvinceData.batches}
            items={selectedProvinceData.items}
            onClose={() => setSelectedProvince(null)}
          />
        )}
      </div>

      <AnimatePresence>
        {showUpdateNotice && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: 20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100, y: 20 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-8 right-8 rounded-lg bg-green-50 border border-green-200 p-4 flex items-center gap-3 shadow-lg z-50 max-w-sm"
          >
            <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
            <p className="text-green-800 font-medium text-sm">
              ✓ 数据已更新：当前筛选 {stats.total} 项
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
