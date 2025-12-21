import type { ComponentInfo, StructureCategory, BuildingStructure } from '@/data/structureDefinitions'
import { motion } from 'framer-motion'
import { Layers, Zap, BookOpen, Link2 } from 'lucide-react'

interface DetailPanelProps {
  component: ComponentInfo
  category: StructureCategory
  structure: BuildingStructure
}

export function DetailPanel({ component, category, structure }: DetailPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="max-w-4xl mx-auto"
    >
      {/* 部件标题 */}
      <div className="mb-6">
        <div className="flex items-baseline gap-2 mb-2">
          <h2 className="font-serif text-3xl font-bold text-ink-black">
            {component.name}
          </h2>
          {component.nameEn && (
            <span className="text-lg text-ink-gray/60">{component.nameEn}</span>
          )}
        </div>
        <div className="flex items-center gap-2 text-sm text-ink-gray/70">
          <span className="px-3 py-1 bg-glaze-blue/10 text-glaze-blue rounded-full">
            {category.name}
          </span>
        </div>
      </div>

      {/* 部件信息卡片网格 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* 功能说明 */}
        <div className="bg-white rounded-lg border border-ink-gray/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="h-4 w-4 text-glaze-blue" />
            <h3 className="font-serif font-bold text-ink-black">功能与作用</h3>
          </div>
          <p className="text-sm text-ink-gray/80 leading-relaxed">
            {component.function}
          </p>
        </div>

        {/* 材料信息 */}
        <div className="bg-white rounded-lg border border-ink-gray/20 p-4">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="h-4 w-4 text-glaze-blue" />
            <h3 className="font-serif font-bold text-ink-black">材料组成</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {component.materials.map((material, idx) => (
              <span
                key={idx}
                className="px-3 py-1 text-xs bg-ink-gray/10 text-ink-gray/80 rounded-full border border-ink-gray/20"
              >
                {material}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 工艺细节 */}
      <div className="bg-gradient-to-br from-glaze-blue/5 to-white rounded-lg border border-glaze-blue/20 p-6 mb-6">
        <h3 className="font-serif font-bold text-ink-black mb-3 flex items-center gap-2">
          <div className="w-1 h-6 bg-glaze-blue rounded" />
          工艺与技术特点
        </h3>
        <p className="text-sm text-ink-gray/80 leading-relaxed whitespace-pre-wrap">
          {component.craftDetails}
        </p>
      </div>

      {/* 历史背景（如有） */}
      {component.historicalNotes && (
        <div className="bg-gradient-to-br from-vermilion/5 to-white rounded-lg border border-vermilion/20 p-6 mb-6">
          <h3 className="font-serif font-bold text-ink-black mb-3 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-vermilion" />
            历史背景与文化意义
          </h3>
          <p className="text-sm text-ink-gray/80 leading-relaxed whitespace-pre-wrap">
            {component.historicalNotes}
          </p>
        </div>
      )}

      {/* 关联部件（如有） */}
      {component.relatedComponents && component.relatedComponents.length > 0 && (
        <div className="bg-white rounded-lg border border-ink-gray/20 p-6">
          <h3 className="font-serif font-bold text-ink-black mb-3 flex items-center gap-2">
            <Link2 className="h-4 w-4 text-glaze-blue" />
            相关关联部件
          </h3>

          <div className="space-y-2">
            {component.relatedComponents.map((relatedId) => {
              // 查找关联部件
              let relatedComponent: ComponentInfo | null = null
              for (const cat of structure.categories) {
                const found = cat.components.find((c) => c.id === relatedId)
                if (found) {
                  relatedComponent = found
                  break
                }
              }

              if (!relatedComponent) return null

              return (
                <div
                  key={relatedId}
                  className="flex items-center gap-3 p-3 bg-glaze-blue/5 rounded-lg hover:bg-glaze-blue/10 transition-colors cursor-pointer"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-glaze-blue flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-ink-black">
                      {relatedComponent.name}
                    </p>
                    <p className="text-xs text-ink-gray/60">
                      {relatedComponent.function}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* 底部说明 */}
      <div className="mt-8 p-4 bg-ink-gray/5 rounded-lg border border-ink-gray/20">
        <p className="text-xs text-ink-gray/60">
          💡 点击左侧分类导航可以探索建筑的其他部件。这些信息综合了历史文献、考古研究和传统工艺知识。
        </p>
      </div>
    </motion.div>
  )
}
