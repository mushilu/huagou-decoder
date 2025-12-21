import { useState } from 'react'
import type { StructureCategory, BuildingStructure, ComponentInfo } from '@/data/structureDefinitions'
import { CategoryNav } from './CategoryNav'
import { SVGDiagram } from './SVGDiagram'
import { ComponentCard } from './ComponentCard'
import { DetailPanel } from './DetailPanel'
import { OverviewPanel } from './OverviewPanel'
import { motion } from 'framer-motion'
import { ChevronLeft } from 'lucide-react'

interface StructureViewerProps {
  structure: BuildingStructure
}

type ViewMode = 'overview' | 'category' | 'detail'

export function StructureViewer({ structure }: StructureViewerProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('overview')
  const [selectedCategory, setSelectedCategory] = useState<StructureCategory | null>(null)
  const [selectedComponent, setSelectedComponent] = useState<ComponentInfo | null>(null)

  // 处理分类选择
  const handleSelectCategory = (category: StructureCategory) => {
    setSelectedCategory(category)
    setSelectedComponent(null)
    setViewMode('category')
  }

  // 处理部件选择
  const handleSelectComponent = (component: ComponentInfo) => {
    setSelectedComponent(component)
    setViewMode('detail')
  }

  // 返回上一层
  const handleGoBack = () => {
    if (viewMode === 'detail') {
      setViewMode('category')
      setSelectedComponent(null)
    } else if (viewMode === 'category') {
      setViewMode('overview')
      setSelectedCategory(null)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-ink-gray/5 to-white">
      {/* 顶部标题栏 */}
      <div className="border-b border-ink-gray/20 bg-white/50 backdrop-blur-sm p-4 md:p-6 sticky top-0 z-10">
        <div className="flex items-center justify-between mb-2">
          {viewMode !== 'overview' && (
            <motion.button
              onClick={handleGoBack}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-glaze-blue/10 text-glaze-blue hover:bg-glaze-blue/20 hover:text-glaze-blue/90 transition-all text-sm font-medium group"
              whileHover={{ x: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
              返回上一步
            </motion.button>
          )}
          <h1 className="font-serif text-2xl font-bold text-ink-black flex-1 text-center md:text-left md:ml-4">
            {structure.buildingName}
          </h1>
          <div className="text-xs text-ink-gray/60 hidden sm:block">{structure.era}</div>
        </div>

        {viewMode === 'overview' && (
          <p className="text-xs md:text-sm text-ink-gray leading-relaxed max-w-3xl">
            {structure.overviewDescription.substring(0, 120)}...
          </p>
        )}
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
        {/* 左侧导航面板 */}
        <div className="w-full lg:w-64 border-r border-ink-gray/20 bg-white overflow-y-auto">
          <CategoryNav
            categories={structure.categories}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
          />
        </div>

        {/* 中央展示区域 */}
        <div className="flex-1 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 md:p-6"
          >
            {viewMode === 'overview' && (
              <OverviewPanel
                structure={structure}
                onSelectCategory={handleSelectCategory}
              />
            )}

            {viewMode === 'category' && selectedCategory && (
              <div className="space-y-4">
                <div className="mb-6">
                  <h2 className="font-serif text-xl font-bold text-ink-black mb-2">
                    {selectedCategory.name}
                  </h2>
                  <p className="text-sm text-ink-gray/80 leading-relaxed">
                    {selectedCategory.description}
                  </p>
                </div>

                {/* SVG 示意图 */}
                <div className="bg-white rounded-lg border border-ink-gray/20 p-4 mb-6">
                  <SVGDiagram
                    svgContent={structure.svgDiagram.overview}
                    selectedComponentId={selectedComponent?.id}
                  />
                </div>

                {/* 部件卡片列表 */}
                <div className="space-y-3">
                  <p className="text-xs uppercase tracking-wider text-ink-gray/60 font-medium">
                    该分类包含的部件
                  </p>
                  {selectedCategory.components.map((component) => (
                    <ComponentCard
                      key={component.id}
                      component={component}
                      isSelected={selectedComponent?.id === component.id}
                      onClick={() => handleSelectComponent(component)}
                    />
                  ))}
                </div>
              </div>
            )}

            {viewMode === 'detail' && selectedComponent && selectedCategory && (
              <DetailPanel
                component={selectedComponent}
                category={selectedCategory}
                structure={structure}
              />
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
