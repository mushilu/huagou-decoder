/**
 * 时间范围筛选组件 - 两步式选择
 * 第一步：选择是修改起始点还是结束点
 * 第二步：选择具体的朝代
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, RotateCcw } from 'lucide-react'

interface TimelineFilterProps {
  dynastyRange: [string, string]
  onRangeChange: (range: [string, string]) => void
  availableDynasties: string[]
}

const dynastyOrder = ['宋', '元', '明', '清']
const dynastyLabels: Record<string, string> = {
  宋: '宋 (960-1279)',
  元: '元 (1271-1368)',
  明: '明 (1368-1644)',
  清: '清 (1644-1912)',
}

type SelectionMode = 'none' | 'start' | 'end'

export function TimelineFilter({
  dynastyRange,
  onRangeChange,
  availableDynasties,
}: TimelineFilterProps) {
  const [selectionMode, setSelectionMode] = useState<SelectionMode>('none')
  const [startDynasty, endDynasty] = dynastyRange

  const handleDynastySelect = (dynasty: string) => {
    if (selectionMode === 'start') {
      const endIdx = dynastyOrder.indexOf(endDynasty)
      const selectedIdx = dynastyOrder.indexOf(dynasty)
      if (selectedIdx <= endIdx) {
        onRangeChange([dynasty, endDynasty])
        setSelectionMode('none')
      }
    } else if (selectionMode === 'end') {
      const startIdx = dynastyOrder.indexOf(startDynasty)
      const selectedIdx = dynastyOrder.indexOf(dynasty)
      if (selectedIdx >= startIdx) {
        onRangeChange([startDynasty, dynasty])
        setSelectionMode('none')
      }
    }
  }

  const resetRange = () => {
    onRangeChange(['宋', '清'])
    setSelectionMode('none')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="mb-6"
    >
      <Card className="group relative overflow-hidden border-ink-gray/10 hover:border-ink-gray/30 transition-all duration-300">
        {/* 背景梯度 */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <CardHeader className="relative z-10 pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2 group-hover:text-vermilion transition-colors">
              <ChevronDown className="h-5 w-5" />
              时间范围筛选
            </CardTitle>
            {(startDynasty !== '宋' || endDynasty !== '清') && (
              <Button
                variant="ghost"
                size="sm"
                onClick={resetRange}
                className="text-xs gap-1 hover:text-vermilion"
              >
                <RotateCcw className="h-3 w-3" />
                重置范围
              </Button>
            )}
          </div>
        </CardHeader>

        <CardContent className="relative z-10">
          <div className="space-y-4">
            {/* 第一步：选择修改起始点还是结束点 */}
            <div>
              <p className="text-sm font-medium text-ink-gray mb-3">第一步：选择要修改的范围</p>
              <div className="flex gap-3">
                <Button
                  variant={selectionMode === 'start' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectionMode(selectionMode === 'start' ? 'none' : 'start')}
                  className={selectionMode === 'start' ? 'bg-vermilion hover:bg-vermilion/90 text-paper-white' : ''}
                >
                  修改起始点
                </Button>
                <Button
                  variant={selectionMode === 'end' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectionMode(selectionMode === 'end' ? 'none' : 'end')}
                  className={selectionMode === 'end' ? 'bg-glaze-blue hover:bg-glaze-blue/90 text-paper-white' : ''}
                >
                  修改结束点
                </Button>
              </div>
            </div>

            {/* 第二步：选择朝代 */}
            <AnimatePresence>
              {selectionMode !== 'none' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div>
                    <p className="text-sm font-medium text-ink-gray mb-3">
                      第二步：选择{selectionMode === 'start' ? '起始' : '结束'}朝代
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {dynastyOrder.map((dynasty, index) => {
                        const isAvailable = availableDynasties.includes(dynasty)
                        const isCurrentStart = dynasty === startDynasty
                        const isCurrentEnd = dynasty === endDynasty
                        let isSelectable = false

                        if (selectionMode === 'start') {
                          // 起始点只能选择不超过结束点的朝代
                          const endIdx = dynastyOrder.indexOf(endDynasty)
                          isSelectable = dynastyOrder.indexOf(dynasty) <= endIdx
                        } else if (selectionMode === 'end') {
                          // 结束点只能选择不小于起始点的朝代
                          const startIdx = dynastyOrder.indexOf(startDynasty)
                          isSelectable = dynastyOrder.indexOf(dynasty) >= startIdx
                        }

                        return (
                          <motion.div
                            key={dynasty}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.05 }}
                          >
                            <Button
                              size="sm"
                              disabled={!isAvailable || !isSelectable}
                              onClick={() => handleDynastySelect(dynasty)}
                              className={`${
                                (selectionMode === 'start' && isCurrentStart) ||
                                (selectionMode === 'end' && isCurrentEnd)
                                  ? selectionMode === 'start'
                                    ? 'bg-vermilion hover:bg-vermilion/90 text-paper-white'
                                    : 'bg-glaze-blue hover:bg-glaze-blue/90 text-paper-white'
                                  : 'border border-ink-gray/20'
                              }`}
                              variant="outline"
                            >
                              {dynasty}
                            </Button>
                          </motion.div>
                        )
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* 当前范围显示 */}
            <div className="mt-3 p-3 bg-ink-black/5 rounded-lg border border-ink-gray/10">
              <p className="text-xs text-ink-gray mb-2">当前范围：</p>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-ink-black border-vermilion/40 bg-vermilion/10">
                  {dynastyLabels[startDynasty]}
                </Badge>
                <span className="text-xs text-ink-gray font-medium">至</span>
                <Badge variant="outline" className="text-ink-black border-glaze-blue/40 bg-glaze-blue/10">
                  {dynastyLabels[endDynasty]}
                </Badge>
              </div>
            </div>

            {/* 提示信息 */}
            {selectionMode === 'none' && (
              <p className="text-xs text-ink-gray/60 italic">
                提示：先选择要修改的范围（起始点或结束点），再选择具体朝代
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
