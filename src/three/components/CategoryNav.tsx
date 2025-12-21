import type { StructureCategory } from '@/data/structureDefinitions'
import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react'

interface CategoryNavProps {
  categories: StructureCategory[]
  selectedCategory: StructureCategory | null
  onSelectCategory: (category: StructureCategory) => void
}

export function CategoryNav({
  categories,
  selectedCategory,
  onSelectCategory
}: CategoryNavProps) {
  return (
    <div className="p-4 md:p-6 space-y-2">
      <p className="text-xs uppercase tracking-wider text-ink-gray/60 font-medium mb-4">
        结构分类导航
      </p>

      {categories
        .sort((a, b) => a.order - b.order)
        .map((category) => {
          const isSelected = selectedCategory?.id === category.id

          return (
            <motion.button
              key={category.id}
              onClick={() => onSelectCategory(category)}
              className={`w-full text-left rounded-lg transition-all p-3 md:p-4 border-2 relative group ${
                isSelected
                  ? 'bg-glaze-blue/10 border-glaze-blue shadow-md'
                  : 'bg-white border-ink-gray/20 hover:border-glaze-blue/40 hover:bg-glaze-blue/5'
              }`}
              whileHover={{ x: 4 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* 选中指示符 */}
              {isSelected && (
                <motion.div
                  layoutId="categoryIndicator"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-glaze-blue rounded-l"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}

              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className={`font-serif font-bold text-sm md:text-base truncate ${
                    isSelected ? 'text-glaze-blue' : 'text-ink-black'
                  }`}>
                    {category.name}
                  </h3>
                  <p className="text-xs text-ink-gray/60 mt-1 line-clamp-2">
                    {category.components.length} 个部件
                  </p>
                </div>

                <ChevronRight
                  className={`h-4 w-4 flex-shrink-0 ml-2 transition-all ${
                    isSelected ? 'text-glaze-blue' : 'text-ink-gray/40 group-hover:text-glaze-blue/60'
                  }`}
                />
              </div>

              {/* 鼠标悬停时显示简要描述 */}
              {!isSelected && (
                <p className="text-xs text-ink-gray/50 mt-2 line-clamp-1 group-hover:line-clamp-none">
                  {category.description.substring(0, 50)}...
                </p>
              )}
            </motion.button>
          )
        })}
    </div>
  )
}
