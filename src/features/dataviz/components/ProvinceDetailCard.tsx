import { motion, AnimatePresence } from 'framer-motion'
import { X, MapPin, Building2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

interface ProvinceDetailCardProps {
  province: string | null
  buildingCount: number
  buildings: string[]
  dynasties: string[]
  onClose: () => void
}

export function ProvinceDetailCard({
  province,
  buildingCount,
  buildings,
  dynasties,
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
                  {buildingCount} 座建筑
                </Badge>
                <Badge variant="outline" className="bg-glaze-blue/10 text-glaze-blue border-glaze-blue/30">
                  {dynasties.length} 个朝代
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="relative z-10">
              {/* 建筑列表 */}
              <div>
                <h3 className="flex items-center gap-2 mb-3 text-sm font-semibold text-ink-black">
                  <Building2 className="h-4 w-4" />
                  主要建筑
                </h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto">
                  {buildings.slice(0, 8).map((building, index) => (
                    <motion.div
                      key={building}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-2 p-2 rounded-lg bg-ink-black/5 hover:bg-ink-black/10 transition-colors group/item"
                    >
                      <div className="h-2 w-2 rounded-full bg-vermilion group-hover/item:bg-gold transition-colors" />
                      <span className="text-xs text-ink-gray group-hover/item:text-ink-black transition-colors flex-1 truncate">
                        {building}
                      </span>
                    </motion.div>
                  ))}
                  {buildings.length > 8 && (
                    <div className="text-xs text-ink-gray/60 p-2 text-center">
                      还有 {buildings.length - 8} 座建筑
                    </div>
                  )}
                </div>
              </div>

              {/* 朝代分布 */}
              <div className="mt-4 pt-4 border-t border-ink-gray/10">
                <h3 className="mb-2 text-sm font-semibold text-ink-black">朝代覆盖</h3>
                <div className="flex flex-wrap gap-2">
                  {dynasties.map((dynasty) => (
                    <Badge key={dynasty} variant="secondary" className="text-xs">
                      {dynasty}
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
