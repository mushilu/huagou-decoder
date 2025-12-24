import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Search, Filter, Grid3X3, List, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/shared'
import { useBuildingsList, useDynasties, useBuildingTypes } from '@/hooks/useBuildings'
import { InkLoading } from '@/components/ink/InkLoading'
import { DynastySeal, BuildingTypeIcon } from '@/components/moyu-guji/icons'
import { CloudPattern } from '@/components/moyu-guji/patterns'
import type { Dynasty } from '@/types/building'

export function CodexPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedDynasty, setSelectedDynasty] = useState<Dynasty | null>(null)
  const [selectedType, setSelectedType] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [currentPage, setCurrentPage] = useState(1)

  const { dynasties } = useDynasties()
  const { types } = useBuildingTypes()

  const filters = useMemo(
    () => ({
      dynasty: selectedDynasty || undefined,
      buildingType: selectedType || undefined,
      search: searchQuery,
    }),
    [selectedDynasty, selectedType, searchQuery]
  )

  const { buildings, isLoading, total } = useBuildingsList(currentPage, 12, filters)

  const totalPages = Math.ceil(total / 12)

  return (
    <div className="relative min-h-screen bg-paper-white">
      {/* Background Decoration */}
      <CloudPattern position="top" opacity={0.3} />

      {/* Header */}
      <div className="border-b border-ink-gray/20 bg-paper-cream">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-serif text-4xl font-bold text-ink-black">建筑图鉴</h1>
            <p className="mt-2 text-ink-gray">
              浏览中国古代建筑瑰宝，探索民居、宫府、皇宫、桥梁的建筑之美
            </p>
          </motion.div>
        </div>
      </div>

      {/* Filters */}
      <div className="sticky top-16 z-30 border-b border-ink-gray/20 bg-paper-white/95 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          {/* Search Bar */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            {/* Search */}
            <div className="relative flex-1 min-w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-gray" />
              <input
                type="text"
                placeholder="搜索建筑名称、地点..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full rounded-lg border border-ink-gray/30 bg-paper-white py-2 pl-10 pr-4 text-ink-black placeholder:text-ink-gray/50 focus:border-vermilion focus:outline-none focus:ring-1 focus:ring-vermilion"
              />
            </div>

            {/* View Toggle */}
            <div className="flex gap-1 rounded-lg border border-ink-gray/30 p-1 bg-paper-cream/50">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="icon"
                className="h-8 w-8"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>

            {/* Reset Filters */}
            {(selectedDynasty || selectedType || searchQuery) && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedDynasty(null)
                  setSelectedType(null)
                  setSearchQuery('')
                  setCurrentPage(1)
                }}
              >
                <Filter className="mr-2 h-4 w-4" />
                重置筛选
              </Button>
            )}
          </div>

          {/* Tabs for Dynasty and Type Filters */}
          <div className="space-y-4">
            {/* Dynasty Tabs */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Badge variant="gold" className="text-xs">朝代</Badge>
                <span className="text-xs text-ink-gray">
                  {selectedDynasty ? `已选择: ${selectedDynasty}` : '全部朝代'}
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => {
                    setSelectedDynasty(null)
                    setCurrentPage(1)
                  }}
                  className={`rounded-lg border-2 px-4 py-2 text-sm font-medium transition-all ${
                    !selectedDynasty
                      ? 'border-vermilion bg-vermilion/10 text-vermilion'
                      : 'border-ink-gray/20 text-ink-black hover:border-vermilion/50'
                  }`}
                >
                  全部
                </button>
                {dynasties.map((dynasty) => (
                  <button
                    key={dynasty}
                    onClick={() => {
                      setSelectedDynasty(dynasty)
                      setCurrentPage(1)
                    }}
                    className={`flex items-center gap-2 rounded-lg border-2 px-4 py-2 transition-all ${
                      selectedDynasty === dynasty
                        ? 'border-vermilion bg-vermilion/10'
                        : 'border-ink-gray/20 hover:border-vermilion/50'
                    }`}
                  >
                    <DynastySeal
                      dynasty={dynasty}
                      size="standard"
                      state={selectedDynasty === dynasty ? 'selected' : 'default'}
                      animated={true}
                    />
                    <span className={`text-sm ${
                      selectedDynasty === dynasty ? 'text-vermilion font-medium' : 'text-ink-black'
                    }`}>
                      {dynasty}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Type Tabs */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Badge variant="secondary" className="text-xs">类型</Badge>
                <span className="text-xs text-ink-gray">
                  {selectedType ? `已选择: ${selectedType}` : '全部类型'}
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    setSelectedType(null)
                    setCurrentPage(1)
                  }}
                  className={`rounded-full border-2 px-4 py-2 text-sm font-medium transition-all ${
                    !selectedType
                      ? 'border-glaze-blue bg-glaze-blue text-paper-white shadow-md'
                      : 'border-ink-gray/20 text-ink-black hover:border-glaze-blue/50'
                  }`}
                >
                  全部
                </button>
                {types.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setSelectedType(type)
                      setCurrentPage(1)
                    }}
                    className={`rounded-full border-2 px-4 py-2 text-sm transition-all ${
                      selectedType === type
                        ? 'border-glaze-blue bg-glaze-blue text-paper-white shadow-md'
                        : 'border-ink-gray/20 text-ink-black hover:border-glaze-blue/50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Building Grid/List */}
      <div className="container mx-auto px-4 py-8">
        {isLoading ? (
          <div className="py-20 text-center">
            <InkLoading variant="dots" />
          </div>
        ) : buildings.length === 0 ? (
          <div className="py-20 text-center">
            <p className="text-ink-gray">未找到匹配的建筑</p>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className={viewMode === 'grid' ? 'grid gap-6 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-4'}
            >
              {buildings.map((building, index) => (
                <motion.div
                  key={building.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link to={`/codex/${building.slug}`}>
                    {viewMode === 'grid' ? (
                      <Card className="group relative cursor-pointer overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl border-ink-gray/10 hover:border-ink-gray/30">
                        {/* Building Type Icon */}
                        <div className="absolute top-3 right-3 z-10">
                          <BuildingTypeIcon
                            type={building.buildingType}
                            size="card"
                            state="default"
                          />
                        </div>

                        {/* Image */}
                        <div className="relative aspect-[4/3] overflow-hidden bg-gradient-to-br from-ink-black/5 to-ink-gray/10">
                          {building.thumbnail ? (
                            <img
                              src={building.thumbnail}
                              alt={building.nameZh}
                              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-ink-gray/30">
                              <span className="font-serif text-center text-lg">{building.nameZh}</span>
                            </div>
                          )}
                          <div className="absolute inset-0 bg-gradient-to-t from-ink-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                          {/* Stats overlay on hover */}
                          <div className="absolute bottom-3 right-3 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                            <Badge variant="destructive" className="flex items-center gap-1 text-xs">
                              <Eye className="h-3 w-3" />
                              {building.viewCount || 0}
                            </Badge>
                          </div>

                          {/* Tags */}
                          <div className="absolute left-3 top-3 flex gap-2">
                            <Badge variant="default" className="text-xs">
                              {building.dynasty}
                            </Badge>
                            <Badge variant="outline" className="text-xs bg-ink-black/70 border-ink-black/70 text-paper-white hover:bg-ink-black/80">
                              {building.buildingType}
                            </Badge>
                          </div>
                        </div>

                        <CardHeader className="pb-2">
                          <CardTitle className="text-lg group-hover:text-vermilion transition-colors">
                            {building.nameZh}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex flex-col gap-3 text-sm text-ink-gray">
                            <p className="line-clamp-2">{building.summary}</p>
                            <div className="flex items-center gap-2 text-xs flex-wrap">
                              <Badge variant="secondary" className="text-xs">
                                📍 {building.region.name}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ) : (
                      <Card className="group cursor-pointer transition-all hover:shadow-lg border-ink-gray/10 hover:border-ink-gray/30">
                        <div className="flex gap-4 p-4">
                          {/* Building Type Icon */}
                          <div className="flex-shrink-0">
                            <BuildingTypeIcon
                              type={building.buildingType}
                              size="list"
                              state="default"
                            />
                          </div>

                          <div className="h-20 w-24 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-ink-black/5 to-ink-gray/10">
                            {building.thumbnail ? (
                              <img
                                src={building.thumbnail}
                                alt={building.nameZh}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center text-xs text-ink-gray/30 font-serif">
                                {building.nameZh}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-ink-black group-hover:text-vermilion transition-colors">
                              {building.nameZh}
                            </h3>
                            <p className="mt-1 text-sm text-ink-gray line-clamp-1">
                              {building.summary}
                            </p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <Badge variant="default" className="text-xs">
                                {building.dynasty}
                              </Badge>
                              <Badge variant="secondary" className="text-xs">
                                {building.buildingType}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                📍 {building.region.name}
                              </Badge>
                              <Badge variant="gold" className="text-xs gap-1 flex items-center">
                                <Eye className="h-3 w-3" />
                                {building.viewCount || 0}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </Card>
                    )}
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  上一页
                </Button>
                <div className="flex items-center gap-2">
                  {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                    const page = currentPage > 3 ? currentPage - 2 + i : i + 1
                    if (page > totalPages) return null
                    return (
                      <Button
                        key={page}
                        variant={page === currentPage ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  下一页
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
