import type { ComponentInfo } from '@/data/structureDefinitions'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'

interface ComponentCardProps {
  component: ComponentInfo
  isSelected: boolean
  onClick: () => void
}

export function ComponentCard({ component, isSelected, onClick }: ComponentCardProps) {
  return (
    <motion.button
      onClick={onClick}
      className={`w-full text-left rounded-lg p-3 md:p-4 border-2 transition-all group ${
        isSelected
          ? 'bg-glaze-blue/10 border-glaze-blue shadow-md'
          : 'bg-white/50 border-ink-gray/20 hover:border-glaze-blue/40 hover:bg-glaze-blue/5'
      }`}
      whileHover={{ x: 2 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <h4 className={`font-serif font-bold text-sm ${
              isSelected ? 'text-glaze-blue' : 'text-ink-black'
            }`}>
              {component.name}
            </h4>
            {component.nameEn && (
              <span className="text-xs text-ink-gray/50">{component.nameEn}</span>
            )}
          </div>

          <p className="text-xs text-ink-gray/70 mt-1">{component.function}</p>

          {/* 材料信息 */}
          <div className="mt-2 flex flex-wrap gap-1">
            {component.materials.slice(0, 2).map((material, idx) => (
              <span
                key={idx}
                className="inline-block px-2 py-0.5 text-xs bg-ink-gray/10 text-ink-gray/80 rounded"
              >
                {material}
              </span>
            ))}
            {component.materials.length > 2 && (
              <span className="inline-block px-2 py-0.5 text-xs text-ink-gray/50">
                +{component.materials.length - 2}
              </span>
            )}
          </div>
        </div>

        {isSelected && (
          <ArrowRight className="h-4 w-4 text-glaze-blue flex-shrink-0 ml-2" />
        )}
      </div>
    </motion.button>
  )
}
