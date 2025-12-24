import { useState, useMemo, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BarChart3, TrendingUp, Map, Clock, ChevronDown, CheckCircle2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { DynastyDistributionChart } from '../components/DynastyDistributionChart'
import { BuildingTypeChart } from '../components/BuildingTypeChart'
import { ChinaMap } from '../components/ChinaMap'
import { TimelineFilter } from '../components/TimelineFilter'
import { ProvinceDetailCard } from '../components/ProvinceDetailCard'
import { generateBuildingStats, filterBuildingsByDynasty } from '../data/buildingStatsData'
import { CloudPattern, MeanderPattern } from '@/components/moyu-guji/patterns'

// 生成实时统计数据
const stats = generateBuildingStats()

export function DataVizPage() {
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null)
  const [dynastyRange, setDynastyRange] = useState<[string, string]>(['宋', '清'])
  const [showUpdateNotice, setShowUpdateNotice] = useState(false)
  const [prevTotal, setPrevTotal] = useState(0)

  // 根据选中的朝代范围过滤数据
  const filteredStats = useMemo(
    () => filterBuildingsByDynasty(dynastyRange[0], dynastyRange[1]),
    [dynastyRange],
  )

  // 当数据变化时，显示更新提示
  useEffect(() => {
    if (prevTotal !== 0 && filteredStats.total !== prevTotal) {
      setShowUpdateNotice(true)
      const timer = setTimeout(() => setShowUpdateNotice(false), 2000)
      return () => clearTimeout(timer)
    }
    setPrevTotal(filteredStats.total)
  }, [filteredStats.total])

  // 获取省份详情信息
  const selectedProvinceData = useMemo(() => {
    if (!selectedProvince) return null
    const province = filteredStats.byProvince.find((p) => p.name === selectedProvince)
    return province
  }, [selectedProvince, filteredStats])

  // 获取朝代数据用于展示
  const dynastyData = useMemo(
    () =>
      filteredStats.byDynasty.map((d) => ({
        name: d.name,
        buildings: d.count,
        percentage: filteredStats.total > 0 ? Math.round((d.count / filteredStats.total) * 100) : 0,
        color: d.color,
      })),
    [filteredStats],
  )

  // 获取建筑类型数据
  const typeData = useMemo(
    () =>
      filteredStats.byType.map((t) => ({
        name: t.name,
        count: t.count,
        color: t.color,
        percentage: t.percentage,
      })),
    [filteredStats],
  )

  // 获取时间轴数据（仅显示前5个事件）
  const techMilestones = useMemo(
    () =>
      filteredStats.timeline
        .slice(0, 5)
        .map((event) => ({
          year: event.year.toString(),
          event: `${event.title}: ${event.description}`,
        })),
    [filteredStats],
  )

  // 生成地图数据
  const mapData = useMemo(
    () =>
      filteredStats.byProvince.map((province) => ({
        name: province.name,
        buildingCount: province.count,
        coordinates: [province.coordinates.lng, province.coordinates.lat] as [number, number],
      })),
    [filteredStats],
  )

  return (
    <div className="relative min-h-screen bg-paper-white">
      {/* Background Decoration */}
      <CloudPattern position="top" opacity={0.2} />
      <MeanderPattern position="bottom" thickness={3} opacity={0.1} />

      {/* Header */}
      <div className="border-b border-ink-gray/20 bg-paper-cream">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-serif text-4xl font-bold text-ink-black">数据可视</h1>
            <p className="mt-2 text-ink-black/70">
              时间轴演化、地域对比、技术脉络的可视化呈现
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">

        {/* 提示：当前显示的朝代范围 */}
        {filteredStats.total === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="mb-8 rounded-lg bg-yellow-50 border border-yellow-200 p-4"
          >
            <p className="text-yellow-800">
              ⚠️ 所选朝代范围内暂无建筑数据。请调整时间范围筛选。
            </p>
          </motion.div>
        ) : null}

        {/* TimelineFilter 组件 */}
        <TimelineFilter
          dynastyRange={dynastyRange}
          onRangeChange={setDynastyRange}
          availableDynasties={stats.byDynasty.map((d) => d.name)}
        />

        {/* Stats Overview */}
        <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: '建筑总数', value: filteredStats.total + '', icon: BarChart3, change: '', bgColor: 'bg-vermilion/10', badgeVariant: 'destructive' as const },
            { label: '覆盖朝代', value: filteredStats.byDynasty.length + '', icon: Clock, change: '', bgColor: 'bg-glaze-blue/10', badgeVariant: 'secondary' as const },
            { label: '省份覆盖', value: filteredStats.byProvince.length + '', icon: Map, change: '', bgColor: 'bg-gold/10', badgeVariant: 'gold' as const },
            { label: '建筑类型', value: filteredStats.byType.length + '', icon: TrendingUp, change: '', bgColor: 'bg-ink-black/5', badgeVariant: 'outline' as const },
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
                  {/* 背景梯度 */}
                  <div className={`absolute inset-0 ${stat.bgColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

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
                    {stat.change && (
                      <Badge variant={stat.badgeVariant} className="text-xs">
                        {stat.change}
                      </Badge>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          {/* Dynasty Distribution Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="group relative h-full overflow-hidden border-ink-gray/10 hover:border-ink-gray/30 transition-all duration-300 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-vermilion/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="relative z-10">
                <CardTitle className="group-hover:text-vermilion transition-colors">朝代分布</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <DynastyDistributionChart data={dynastyData} />
              </CardContent>
            </Card>
          </motion.div>

          {/* Building Types Chart */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Card className="group relative h-full overflow-hidden border-ink-gray/10 hover:border-ink-gray/30 transition-all duration-300 hover:shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-br from-glaze-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <CardHeader className="relative z-10">
                <CardTitle className="group-hover:text-vermilion transition-colors">建筑类型</CardTitle>
              </CardHeader>
              <CardContent className="relative z-10">
                <BuildingTypeChart data={typeData} />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Technology Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <Card className="group relative overflow-hidden border-ink-gray/10 hover:border-ink-gray/30 transition-all duration-300 hover:shadow-lg">
            {/* 背景梯度 */}
            <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <CardHeader className="relative z-10">
              <CardTitle className="flex items-center gap-2 group-hover:text-vermilion transition-colors">
                <Clock className="h-5 w-5" />
                技术发展脉络
              </CardTitle>
            </CardHeader>
            <CardContent className="relative z-10">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-[100px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-vermilion to-vermilion/30 md:left-[120px]" />

                <div className="space-y-6">
                  {techMilestones.map((milestone, index) => (
                    <motion.div
                      key={milestone.year}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                      className="flex gap-4 group/item hover:bg-ink-black/5 -mx-4 px-4 py-2 rounded-lg transition-colors"
                    >
                      <div className="w-[80px] flex-shrink-0 text-right font-serif text-lg font-bold text-vermilion group-hover/item:text-gold transition-colors md:w-[100px]">
                        {milestone.year}
                      </div>
                      <div className="relative flex-shrink-0">
                        <div className="absolute left-1/2 top-2 h-3 w-3 -translate-x-1/2 rounded-full border-2 border-vermilion bg-paper-white group-hover/item:border-gold group-hover/item:shadow-md transition-all" />
                      </div>
                      <div className="flex-1 pb-2 pl-4">
                        <p className="text-ink-black group-hover/item:text-ink-black font-medium">{milestone.event}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Geographic Distribution Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8"
        >
          <Card className="group relative h-full overflow-hidden border-ink-gray/10 hover:border-ink-gray/30 transition-all duration-300 hover:shadow-lg">
            {/* 背景梯度 */}
            <div className="absolute inset-0 bg-gradient-to-br from-glaze-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <CardHeader className="relative z-10 flex flex-row items-center justify-between">
              <div className="flex items-center gap-2">
                <CardTitle className="group-hover:text-vermilion transition-colors">地域分布</CardTitle>
                {selectedProvince && (
                  <Badge variant="secondary" className="text-xs">已选中：{selectedProvince}</Badge>
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

        {/* Province Detail Card */}
        {selectedProvinceData && (
          <ProvinceDetailCard
            province={selectedProvince}
            buildingCount={selectedProvinceData.count}
            buildings={selectedProvinceData.buildings}
            dynasties={selectedProvinceData.dynasties}
            onClose={() => setSelectedProvince(null)}
          />
        )}
      </div>

      {/* 数据更新提示 - Toast 样式，右下角 */}
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
              ✓ 数据已更新：{filteredStats.total} 座建筑，{filteredStats.byDynasty.length} 个朝代
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
