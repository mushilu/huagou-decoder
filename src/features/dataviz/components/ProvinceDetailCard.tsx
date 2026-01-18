import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ProvinceDetailCardProps {
  province: string | null
  totalCount: number
  categories: string[]
  batches: number[]
  items: Array<{
    name: string
    category: string
    batch: number
  }>
  onClose: () => void
}

export function ProvinceDetailCard({
  province,
  totalCount,
  categories,
  batches,
  items,
  onClose,
}: ProvinceDetailCardProps) {
  if (!province) return null

  return (
    <AnimatePresence>
      {province && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          className="fixed right-4 top-1/2 z-50 w-80 -translate-y-1/2"
        >
          <Card className="group relative overflow-hidden border-ink-gray/20 shadow-2xl hover:shadow-2xl transition-shadow">
            {/* 背景梯度 */}
            <div className="absolute inset-0 bg-gradient-to-br from-glaze-blue/5 via-transparent to-transparent" />

            <CardHeader className="relative z-10 pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-vermilion" />
                  <CardTitle className="text-xl">{province}</CardTitle>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-6 w-6 p-0 hover:bg-ink-black/10"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="mt-2 flex gap-2">
                <Badge variant="outline" className="bg-vermilion/10 text-vermilion border-vermilion/30">
                  总计 {totalCount} 项
                </Badge>
                <Badge variant="outline" className="bg-glaze-blue/10 text-glaze-blue border-glaze-blue/30">
                  类别 {categories.length}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="relative z-10">
              {/* 单位列表 */}
              <div>
                <h3 className="flex items-center gap-2 mb-3 text-sm font-semibold text-ink-black">
                  <Building2 className="h-4 w-4" />
                  名录摘录
                </h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {items.slice(0, 8).map((item, index) => (
                    <motion.div
                      key={`${item.name}-${item.batch}-${index}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex flex-col gap-1 p-2 rounded-lg bg-ink-black/5 hover:bg-ink-black/10 transition-colors group/item"
                    >
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-vermilion group-hover/item:bg-gold transition-colors" />
                        <span className="text-xs text-ink-gray group-hover/item:text-ink-black transition-colors flex-1 truncate">
                          {item.name}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-1 pl-4">
                        <Badge variant="secondary" className="text-[10px]">
                          第{item.batch}批
                        </Badge>
                        <Badge variant="outline" className="text-[10px]">
                          {item.category}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                  {items.length > 8 && (
                    <div className="text-xs text-ink-gray/60 p-2 text-center">
                      还有 {items.length - 8} 项
                    </div>
                  )}
                </div>
              </div>

              {/* 覆盖维度 */}
              <div className="mt-4 pt-4 border-t border-ink-gray/10">
                <h3 className="mb-2 text-sm font-semibold text-ink-black">类别覆盖</h3>
                {categories.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category) => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-ink-gray/70">暂无类别统计信息。</p>
                )}
                <h3 className="mt-4 mb-2 text-sm font-semibold text-ink-black">批次覆盖</h3>
                <div className="flex flex-wrap gap-2">
                  {batches.map((batch) => (
                    <Badge key={batch} variant="outline" className="text-xs">
                      第{batch}批
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
