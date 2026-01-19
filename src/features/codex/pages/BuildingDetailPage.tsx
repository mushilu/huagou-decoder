import { useParams, useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Heart, Share2, MapPin, Calendar, ArrowLeft, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MarkdownContent } from '@/components/MarkdownContent'
import { useBuildingDetail, useRelatedBuildings } from '@/hooks/useBuildings'
import { useBuildingStore } from '@/stores/buildingStore'
import { InkLoading } from '@/components/ink/InkLoading'
import { getBuildingCipherPoints } from '@/features/cipher/data/buildingCipherMapping'
import { getBuildingThumbnail } from '@/utils/dynastyThumbnails'
import {
  fengshuiKnowledge,
  symbolKnowledge,
  colorKnowledge,
  spaceKnowledge,
} from '@/features/cipher/data/knowledge'
import type { CipherKnowledge } from '@/features/cipher/types'

export function BuildingDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const navigate = useNavigate()
  const { building, isLoading } = useBuildingDetail(slug || '')
  const { addFavorite, removeFavorite, isFavorite } = useBuildingStore()
  const { buildings: relatedBuildings } = useRelatedBuildings(building?.id || '', 4)

  // 获取相关密码知识
  const getRelatedCipherKnowledge = (): CipherKnowledge[] => {
    if (!slug) return []

    const cipherPoints = getBuildingCipherPoints(slug)
    if (!cipherPoints || cipherPoints.cipherPoints.length === 0) return []

    const allKnowledge = [...fengshuiKnowledge, ...symbolKnowledge, ...colorKnowledge, ...spaceKnowledge]
    const relatedKnowledge: CipherKnowledge[] = []

    cipherPoints.cipherPoints.forEach((point) => {
      const knowledge = allKnowledge.find((k) => k.id === point.id)
      if (knowledge && relatedKnowledge.length < 3) {
        relatedKnowledge.push(knowledge)
      }
    })

    return relatedKnowledge
  }

  const relatedCipherKnowledge = getRelatedCipherKnowledge()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <InkLoading variant="brush" />
      </div>
    )
  }

  if (!building) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <p className="text-ink-gray mb-4">建筑不存在</p>
        <Button onClick={() => navigate('/codex')}>返回图鉴</Button>
      </div>
    )
  }

  const isFav = isFavorite(building.slug)
  const heroImage =
    (building.images && building.images[1]) ||
    (building.images && building.images[0]) ||
    building.thumbnail ||
    getBuildingThumbnail(undefined, building.dynasty)
  const heroBackgroundStyle = heroImage
    ? { backgroundImage: `url(${heroImage})`, filter: 'blur(2px)' }
    : { backgroundImage: 'linear-gradient(135deg, #f5efe6 0%, #ede4d7 50%, #f7f1e8 100%)' }

  return (
    <div className="min-h-screen bg-paper-white">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-40 border-b border-ink-gray/20 bg-paper-white/95 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回
          </Button>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (isFav) {
                  removeFavorite(building.slug)
                } else {
                  addFavorite(building.slug)
                }
              }}
            >
              <Heart className={`mr-2 h-4 w-4 ${isFav ? 'fill-vermilion text-vermilion' : ''}`} />
              {isFav ? '已收藏' : '收藏'}
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              分享
            </Button>
          </div>
        </div>
      </div>

      {/* 头图区域 */}
      <div className="relative h-96 overflow-hidden">
        {/* 背景图 */}
        <div className="absolute inset-0 bg-cover bg-center" style={heroBackgroundStyle} />

        {/* 暗色遮罩 */}
        <div className="absolute inset-0 bg-ink-black/50" />

        {/* 渐变遮罩 */}
        <div className="absolute inset-0 bg-gradient-to-b from-ink-black/30 via-transparent to-ink-black/40" />

        {/* 内容 */}
        <div className="relative h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h2 className="font-serif text-6xl font-bold text-paper-white drop-shadow-lg">{building.nameZh}</h2>
            <p className="text-paper-white/80 text-sm mt-2 drop-shadow">{building.buildingType}</p>
          </motion.div>
        </div>
      </div>

      {/* 主要内容 */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          {/* 内容 */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {/* Title & Info */}
            <div className="mb-8">
              <h1 className="mb-2 font-serif text-4xl font-bold text-ink-black">{building.nameZh}</h1>
              <p className="text-lg text-ink-gray">{building.nameEn}</p>

              {/* 元信息 */}
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2 text-ink-gray">
                  <Calendar className="h-4 w-4" />
                  <span>{building.dynasty}</span>
                  {building.dynastyYear && <span>（{building.dynastyYear}年）</span>}
                </div>
                <div className="flex items-center gap-2 text-ink-gray">
                  <MapPin className="h-4 w-4" />
                  <span>{building.region.province}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-block rounded-full bg-vermilion/20 px-3 py-1 text-sm text-vermilion">
                  {building.buildingType}
                </span>
                {building.tags.map((tag) => (
                  <span key={tag.id} className="inline-block rounded-full bg-ink-gray/10 px-3 py-1 text-sm text-ink-gray">
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Summary */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-xl">建筑概览</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="leading-relaxed text-ink-gray">{building.summary}</p>
              </CardContent>
            </Card>

            {/* 详细介绍 */}
            {building.content && (
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle className="text-xl">详细介绍</CardTitle>
                </CardHeader>
                <CardContent>
                  <MarkdownContent content={building.content} />
                </CardContent>
              </Card>
            )}

            {/* 文化密码 */}
            {relatedCipherKnowledge.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="mb-8"
              >
                <Card className="overflow-hidden border-0 shadow-lg bg-gradient-to-br from-paper-white to-ink-black/2">
                  <CardHeader className="bg-gradient-to-r from-vermilion/10 to-transparent border-b-2 border-vermilion/20 px-8 py-8">
                    <div className="flex items-start gap-4">
                      <motion.div
                        className="rounded-xl bg-gradient-to-br from-vermilion/25 to-vermilion/10 p-3 shadow-md"
                        whileHover={{ scale: 1.05, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <BookOpen className="h-6 w-6 text-vermilion" />
                      </motion.div>
                      <div>
                        <CardTitle className="text-2xl font-serif">文化密码解读</CardTitle>
                        <p className="text-sm text-ink-gray mt-2 font-light">
                          这座建筑蕴含的深层文化内涵与建筑智慧
                        </p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-8 py-8">
                    <div className="space-y-5">
                      {relatedCipherKnowledge.map((knowledge, idx) => (
                        <motion.div
                          key={knowledge.id}
                          initial={{ opacity: 0, x: -15 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ type: "spring", stiffness: 350, damping: 18, delay: idx * 0.08 }}
                          whileHover={{ x: 6 }}
                          className="relative overflow-hidden rounded-2xl border-2 border-vermilion/30 bg-gradient-to-r from-vermilion/8 to-transparent p-6 hover:border-vermilion/60 hover:shadow-lg transition-all group"
                        >
                          {/* 装饰背景 */}
                          <div className="absolute inset-0 bg-gradient-to-br from-vermilion/0 to-vermilion/5 opacity-0 group-hover:opacity-100 transition-opacity" />

                          <div className="relative z-10">
                            <div className="flex items-start justify-between mb-3">
                              <h4 className="font-serif text-lg font-bold text-ink-black group-hover:text-vermilion transition-colors">
                                {knowledge.title}
                              </h4>
                              <div className="flex-shrink-0 w-2 h-8 bg-gradient-to-b from-vermilion to-vermilion/30 rounded-full" />
                            </div>
                            <p className="text-sm text-ink-gray/80 mb-4 leading-relaxed font-light">
                              {knowledge.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mb-4">
                              {knowledge.tags.slice(0, 3).map((tag) => (
                                <motion.span
                                  key={tag}
                                  whileHover={{ scale: 1.05 }}
                                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-vermilion/20 to-vermilion/10 text-xs font-semibold text-vermilion border border-vermilion/30 hover:border-vermilion/60 transition-all"
                                >
                                  <span className="w-1 h-1 rounded-full bg-vermilion" />
                                  {tag}
                                </motion.span>
                              ))}
                            </div>
                            <Link
                              to={`/cipher?knowledge=${knowledge.id}`}
                              className="inline-flex items-center gap-2 text-sm font-semibold text-vermilion hover:text-vermilion/80 transition-colors group/link"
                            >
                              深入了解
                              <motion.span
                                animate={{ x: [0, 3, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="group-hover/link:translate-x-1 transition-transform"
                              >
                                →
                              </motion.span>
                            </Link>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    {/* 了解更多 */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.15 }}
                      className="mt-8 pt-8 border-t-2 border-ink-gray/15"
                    >
                      <Link
                        to="/cipher"
                        className="inline-flex items-center gap-3 px-6 py-3 rounded-xl bg-gradient-to-r from-vermilion/15 to-vermilion/8 text-vermilion hover:from-vermilion/25 hover:to-vermilion/15 hover:shadow-lg transition-all font-semibold text-sm border border-vermilion/30 hover:border-vermilion/60 group"
                      >
                        <BookOpen className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        浏览完整文化密码库
                        <motion.span
                          animate={{ x: [0, 3, 0] }}
                          transition={{ duration: 2, repeat: Infinity }}
                          className="group-hover:translate-x-1 transition-transform"
                        >
                          →
                        </motion.span>
                      </Link>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {/* 建筑信息 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">建筑信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-ink-gray/70">中文名称</p>
                  <p className="font-medium text-ink-black">{building.nameZh}</p>
                </div>
                <div>
                  <p className="text-ink-gray/70">英文名称</p>
                  <p className="font-medium text-ink-black">{building.nameEn}</p>
                </div>
                <div>
                  <p className="text-ink-gray/70">朝代</p>
                  <p className="font-medium text-ink-black">{building.dynasty}</p>
                </div>
                <div>
                  <p className="text-ink-gray/70">建筑类型</p>
                  <p className="font-medium text-ink-black">{building.buildingType}</p>
                </div>
                <div>
                  <p className="text-ink-gray/70">位置</p>
                  <p className="font-medium text-ink-black">
                    {building.region.province} {building.region.name}
                  </p>
                </div>
                {building.dynastyYear && (
                  <div>
                    <p className="text-ink-gray/70">建造时间</p>
                    <p className="font-medium text-ink-black">{building.dynastyYear} 年</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Statistics */}
            {(building.viewCount || building.favoriteCount) && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">热度指数</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-ink-gray">浏览量</span>
                    <span className="font-bold text-vermilion">{building.viewCount || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-ink-gray">收藏数</span>
                    <span className="font-bold text-vermilion">{building.favoriteCount || 0}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* 参观信息 */}
            {building.visitingInfo && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">参观信息</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <p className="text-ink-gray/70">地址</p>
                    <p className="font-medium text-ink-black">{building.visitingInfo.location}</p>
                  </div>
                  <div>
                    <p className="text-ink-gray/70">开放时间</p>
                    <p className="font-medium text-ink-black">{building.visitingInfo.openingHours}</p>
                  </div>
                  <div>
                    <p className="text-ink-gray/70">距离参考</p>
                    <p className="font-medium text-ink-black">{building.visitingInfo.distance}</p>
                  </div>
                  <div>
                    <p className="text-ink-gray/70">推荐游览时间</p>
                    <p className="font-medium text-ink-black">{building.visitingInfo.recommendedDuration}</p>
                  </div>
                  {building.visitingInfo.relatedSites && (
                    <div>
                      <p className="text-ink-gray/70">相关景点</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {building.visitingInfo.relatedSites.map((site, idx) => (
                          <span key={idx} className="inline-block px-2 py-1 rounded bg-ink-gray/10 text-xs">
                            {site}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* 建筑特色 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">建筑特色</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {building.constructionDetails && (
                  <div className="space-y-3">
                    <div>
                      <p className="text-ink-gray/70">建造时期</p>
                      <p className="font-medium text-ink-black">
                        {building.constructionDetails.startYear} - {building.constructionDetails.endYear}
                      </p>
                      <p className="text-xs text-ink-gray">耗时 {building.constructionDetails.durationYears} 年</p>
                    </div>
                    {building.constructionDetails.materials && building.constructionDetails.materials.length > 0 && (
                      <div>
                        <p className="text-ink-gray/70 mb-2">主要材料</p>
                        <div className="flex flex-wrap gap-1">
                          {building.constructionDetails.materials.map((material, idx) => (
                            <span key={idx} className="inline-block px-2 py-1 rounded-full bg-glaze-blue/20 text-xs text-glaze-blue">
                              {material}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    <div>
                      <p className="text-ink-gray/70">工匠</p>
                      <p className="text-xs text-ink-black">{building.constructionDetails.workforce}</p>
                    </div>
                  </div>
                )}
                {building.artifacts && building.artifacts.length > 0 && (
                  <div>
                    <p className="text-ink-gray/70 mb-2">重要遗物</p>
                    <div className="flex flex-wrap gap-1">
                      {building.artifacts.map((artifact, idx) => (
                        <span key={idx} className="inline-block px-2 py-1 rounded-full bg-vermilion/20 text-xs text-vermilion">
                          {artifact}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {building.culturalSignificance && (
                  <div>
                    <p className="text-ink-gray/70 mb-2">文化意义</p>
                    <p className="text-xs text-ink-gray leading-relaxed">{building.culturalSignificance}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* 地图位置 */}
            <Card className="overflow-hidden border-0 shadow-md">
              <div className="relative">
                {/* Background with gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-glaze-blue/10 via-vermilion/5 to-ink-gray/10" />

                {/* 内容 */}
                <div className="relative p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="rounded-full bg-glaze-blue/20 p-2">
                      <MapPin className="h-5 w-5 text-glaze-blue" />
                    </div>
                    <h3 className="font-serif text-lg font-semibold text-ink-black">地理位置</h3>
                  </div>

                  <div className="space-y-4">
                    {/* 位置信息 */}
                    <div className="space-y-2">
                      <p className="text-xs text-ink-gray/60 uppercase tracking-wider">位置信息</p>
                      <div className="flex items-start gap-2">
                        <div className="mt-1 flex-shrink-0">
                          <div className="h-2 w-2 rounded-full bg-glaze-blue" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-medium text-ink-black">{building.region.province}</p>
                          <p className="text-xs text-ink-gray/70">{building.region.name}</p>
                        </div>
                      </div>
                    </div>

                    {/* Coordinates if available */}
                    {building.region.coordinates && (
                      <div className="space-y-2 border-t border-ink-gray/10 pt-3">
                        <p className="text-xs text-ink-gray/60 uppercase tracking-wider">坐标信息</p>
                        <div className="grid grid-cols-2 gap-2">
                          <div className="rounded-lg bg-white/50 p-2">
                            <p className="text-xs text-ink-gray/60">纬度</p>
                            <p className="text-sm font-medium text-ink-black">{building.region.coordinates.lat.toFixed(4)}</p>
                          </div>
                          <div className="rounded-lg bg-white/50 p-2">
                            <p className="text-xs text-ink-gray/60">经度</p>
                            <p className="text-sm font-medium text-ink-black">{building.region.coordinates.lng.toFixed(4)}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CTA Button */}
                    <a
                      href={`https://amap.com/search?query=${building.region.name},${building.region.province}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-4 block w-full rounded-lg border-2 border-glaze-blue bg-white px-4 py-3 text-center text-sm font-medium text-glaze-blue transition-all hover:bg-glaze-blue/5 hover:shadow-md active:scale-95"
                    >
                      在高德地图中查看 →
                    </a>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* 相关建筑 */}
        {relatedBuildings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mt-16 border-t border-ink-gray/20 pt-12"
          >
            <h2 className="font-serif text-2xl font-bold text-ink-black mb-8">相关建筑</h2>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {relatedBuildings.map((relBuilding) => (
                <Link key={relBuilding.id} to={`/codex/${relBuilding.slug}`}>
                  <Card className="group cursor-pointer overflow-hidden transition-all hover:-translate-y-1 hover:shadow-lg">
                    <div className="aspect-[3/2] bg-ink-gray/10 flex items-center justify-center overflow-hidden">
                      {relBuilding.thumbnail ? (
                        <img
                          src={relBuilding.thumbnail}
                          alt={relBuilding.nameZh}
                          referrerPolicy="no-referrer"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                      ) : (
                        <span className="text-center text-sm text-ink-gray/30">{relBuilding.nameZh}</span>
                      )}
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm group-hover:text-vermilion transition-colors">
                        {relBuilding.nameZh}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-xs text-ink-gray">{relBuilding.dynasty}</div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
