import type { BuildingStructure, StructureCategory } from '@/data/structureDefinitions'
import { motion } from 'framer-motion'
import { BookOpen, ChevronRight } from 'lucide-react'

interface OverviewPanelProps {
  structure: BuildingStructure
  onSelectCategory: (category: StructureCategory) => void
}

export function OverviewPanel({ structure, onSelectCategory }: OverviewPanelProps) {
  const categories = [...structure.categories].sort((a, b) => a.order - b.order)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="max-w-5xl mx-auto"
    >
      {/* 建筑全景卡片 */}
      <div className="mb-8 bg-gradient-to-br from-glaze-blue/10 via-white to-ink-gray/5 rounded-xl border border-glaze-blue/20 p-6 md:p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h2 className="font-serif text-2xl md:text-3xl font-bold text-ink-black mb-3">
              {structure.buildingName}
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <p className="text-ink-gray/60 text-xs uppercase tracking-wider mb-1">建筑年代</p>
                <p className="font-medium text-ink-black">{structure.era}</p>
              </div>
              <div>
                <p className="text-ink-gray/60 text-xs uppercase tracking-wider mb-1">英文名称</p>
                <p className="font-medium text-ink-black">{structure.buildingNameEn}</p>
              </div>
            </div>
          </div>

          {/* SVG预览 */}
          <div className="flex items-center justify-center bg-white rounded-lg border border-ink-gray/20 p-4 min-h-64 md:min-h-auto">
            <div
              dangerouslySetInnerHTML={{ __html: structure.svgDiagram.overview }}
              className="w-full h-full flex items-center justify-center [&_svg]:max-w-full [&_svg]:max-h-full"
            />
          </div>
        </div>

        {/* 建筑描述 */}
        <div className="mt-6 pt-6 border-t border-glaze-blue/20">
          <p className="text-sm text-ink-gray/80 leading-relaxed whitespace-pre-wrap">
            {structure.overviewDescription}
          </p>
        </div>
      </div>

      {/* 结构分类导航 */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="h-5 w-5 text-glaze-blue" />
          <h3 className="font-serif text-xl font-bold text-ink-black">
            建筑结构分类
          </h3>
        </div>

        <p className="text-sm text-ink-gray/70 mb-6">
          点击下方任一分类深入了解该部分的结构细节和工艺特点：
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((category, idx) => (
            <motion.button
              key={category.id}
              onClick={() => onSelectCategory(category)}
              className="text-left rounded-lg border-2 border-ink-gray/20 hover:border-glaze-blue/50 bg-white hover:bg-glaze-blue/5 p-4 transition-all group"
              whileHover={{ x: 4, y: -2 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05, duration: 0.3 }}
            >
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-serif font-bold text-ink-black group-hover:text-glaze-blue transition-colors">
                  {category.name}
                </h4>
                <ChevronRight className="h-4 w-4 text-ink-gray/40 group-hover:text-glaze-blue transition-colors" />
              </div>

              <p className="text-xs text-ink-gray/70 mb-3 line-clamp-2">
                {category.description}
              </p>

              <div className="flex items-center gap-1 text-xs">
                <span className="inline-block w-4 h-4 rounded-full bg-glaze-blue/20 flex items-center justify-center text-glaze-blue font-bold">
                  {category.components.length}
                </span>
                <span className="text-ink-gray/60">个部件</span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* 学习提示 */}
      <div className="bg-gradient-to-r from-ink-gray/5 to-transparent rounded-lg border border-ink-gray/20 p-6">
        <h4 className="font-serif font-bold text-ink-black mb-3 flex items-center gap-2">
          <span className="text-xl">📖</span>
          如何使用本解码器
        </h4>
        <ul className="text-sm text-ink-gray/80 space-y-2">
          <li className="flex items-start gap-3">
            <span className="text-glaze-blue font-bold mt-0.5">•</span>
            <span>选择任一分类来查看该部分的结构示意图</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-glaze-blue font-bold mt-0.5">•</span>
            <span>点击具体部件来了解其详细信息、材料和工艺</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-glaze-blue font-bold mt-0.5">•</span>
            <span>查看"相关关联部件"了解各部件如何相互配合</span>
          </li>
          <li className="flex items-start gap-3">
            <span className="text-glaze-blue font-bold mt-0.5">•</span>
            <span>阅读历史背景来理解建筑的文化意义</span>
          </li>
        </ul>
      </div>
    </motion.div>
  )
}
