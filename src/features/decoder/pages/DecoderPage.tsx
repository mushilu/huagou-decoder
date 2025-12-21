import { forbiddenCityStructure } from '@/data/structureDefinitions'
import { StructureViewer } from '@/three/components/StructureViewer'
import { motion } from 'framer-motion'

export function DecoderPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header */}
      <div className="border-b border-ink-gray/20 bg-gradient-to-b from-paper-cream to-white">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="font-serif text-3xl md:text-4xl font-bold text-ink-black">结构解码</h1>
            <p className="mt-2 text-sm md:text-base text-ink-gray/80">
              通过详细的建筑结构分析，探索中国古代建筑的工程智慧与工艺精髓
            </p>
          </motion.div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 container mx-auto w-full px-0 py-0 md:px-4 md:py-8">
        <StructureViewer structure={forbiddenCityStructure} />
      </div>
    </div>
  )
}
