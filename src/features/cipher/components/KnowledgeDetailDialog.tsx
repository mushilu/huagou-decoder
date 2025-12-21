import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getBuildingChineseName } from '../data/buildingNameMap'
import type { CipherKnowledge } from '../types'

interface KnowledgeDetailDialogProps {
  knowledge: CipherKnowledge | null
  isOpen: boolean
  onClose: () => void
}

export function KnowledgeDetailDialog({
  knowledge,
  isOpen,
  onClose,
}: KnowledgeDetailDialogProps) {
  if (!knowledge) return null

  const paragraphs = knowledge.content.split('\n\n')

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-ink-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            transition={{ duration: 0.2 }}
          />

          {/* Dialog */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            <motion.div
              className="max-h-[90vh] w-full max-w-3xl overflow-hidden rounded-2xl bg-paper-white shadow-2xl relative"
              layoutId="dialog"
            >
              {/* 顶部装饰背景 */}
              <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-glaze-blue/10 via-glaze-blue/5 to-transparent pointer-events-none" />

              {/* 关闭按钮 */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="absolute top-6 right-6 z-20 flex items-center justify-center w-10 h-10 rounded-lg bg-ink-black/5 hover:bg-ink-black/10 transition-colors duration-200"
              >
                <X className="h-5 w-5 text-ink-gray" />
              </motion.button>

              {/* Content */}
              <div className="overflow-y-auto max-h-[90vh]">
                {/* Header */}
                <div className="relative px-8 md:px-12 pt-12 pb-8 border-b border-ink-gray/20 bg-gradient-to-r from-glaze-blue/5 via-transparent to-transparent">
                  {/* 装饰线条 */}
                  <div className="absolute left-0 top-0 h-1 w-24 bg-gradient-to-r from-glaze-blue to-transparent" />

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-start gap-6 mb-6"
                  >
                    <motion.div
                      className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-glaze-blue/30 to-glaze-blue/10 flex items-center justify-center shadow-md"
                      whileHover={{ scale: 1.05, rotate: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <BookOpen className="w-7 h-7 text-glaze-blue" />
                    </motion.div>
                    <div className="flex-1">
                      <motion.h2
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="font-serif text-4xl md:text-5xl font-bold text-ink-black leading-tight tracking-tight"
                      >
                        {knowledge.title}
                      </motion.h2>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="mt-3 space-y-2"
                      >
                        <p className="text-ink-gray text-lg leading-relaxed font-light">
                          {knowledge.description}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <div className="w-1 h-1 rounded-full bg-glaze-blue" />
                          <span className="text-sm text-glaze-blue font-medium">文化知识</span>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                </div>

                {/* Main Content */}
                <div className="px-8 md:px-12 py-8 space-y-6">
                  {/* Image Placeholder */}
                  {knowledge.imageUrl && (
                    <motion.div
                      className="rounded-xl overflow-hidden bg-gradient-to-br from-ink-gray/10 to-ink-gray/5 aspect-[16/9]"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.25 }}
                    >
                      <img
                        src={knowledge.imageUrl}
                        alt={knowledge.title}
                        className="w-full h-full object-cover"
                      />
                    </motion.div>
                  )}

                  {/* Text Content */}
                  <motion.div
                    className="prose prose-lg max-w-none space-y-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {paragraphs.map((paragraph, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        className="relative pl-6"
                      >
                        {/* 左边装饰线 */}
                        {idx === 0 && (
                          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-glaze-blue via-glaze-blue/50 to-transparent rounded-full" />
                        )}
                        <p className="text-ink-black leading-8 font-light whitespace-pre-wrap text-justify text-base md:text-lg">
                          {paragraph}
                        </p>
                      </motion.div>
                    ))}
                  </motion.div>

                  {/* Tags Section */}
                  {knowledge.tags && knowledge.tags.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="pt-8 border-t-2 border-glaze-blue/20 bg-gradient-to-r from-glaze-blue/5 to-transparent rounded-xl p-6"
                    >
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-2 h-6 bg-gradient-to-b from-glaze-blue to-glaze-blue/50 rounded-full" />
                        <span className="font-serif text-lg font-bold text-ink-black">相关标签</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {knowledge.tags.map((tag, idx) => (
                          <motion.span
                            key={tag}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.5 + idx * 0.03 }}
                            whileHover={{ scale: 1.12, y: -3 }}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-glaze-blue/20 to-glaze-blue/10 text-sm font-semibold text-glaze-blue border border-glaze-blue/40 hover:border-glaze-blue/70 hover:shadow-md transition-all"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-glaze-blue" />
                            {tag}
                          </motion.span>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Related Buildings */}
                  {knowledge.relatedBuildings && knowledge.relatedBuildings.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="pt-8 border-t-2 border-vermilion/20 bg-gradient-to-r from-vermilion/5 to-transparent rounded-xl p-6"
                    >
                      <h3 className="font-serif text-xl font-bold text-ink-black mb-6 flex items-center gap-3">
                        <div className="w-1.5 h-7 bg-gradient-to-b from-vermilion to-vermilion/50 rounded-full" />
                        相关建筑
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {knowledge.relatedBuildings.map((slug, idx) => (
                          <motion.div
                            key={slug}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ type: "spring", stiffness: 300, damping: 18, delay: 0.6 + idx * 0.04 }}
                            whileHover={{ x: 10 }}
                          >
                            <Link
                              to={`/codex/${slug}`}
                              onClick={onClose}
                              className="flex items-center justify-between rounded-xl border-2 border-vermilion/30 bg-gradient-to-r from-vermilion/8 to-transparent p-5 transition-all hover:border-vermilion/60 hover:bg-gradient-to-r hover:from-vermilion/15 hover:to-transparent hover:shadow-lg group"
                            >
                              <span className="text-sm font-semibold text-ink-black group-hover:text-vermilion transition-colors">
                                {getBuildingChineseName(slug)}
                              </span>
                              <motion.div
                                animate={{ x: [0, 3, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                                className="text-vermilion opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <ArrowRight className="h-4 w-4" />
                              </motion.div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 border-t-2 border-ink-gray/15 bg-gradient-to-r from-paper-white via-paper-white to-glaze-blue/3 backdrop-blur-sm px-8 md:px-12 py-6 flex justify-between items-center gap-4 shadow-lg">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 }}
                    className="flex items-center gap-2 text-xs text-ink-gray/70"
                  >
                    <div className="w-1 h-1 rounded-full bg-glaze-blue" />
                    <span>点击相关建筑卡片浏览更多信息</span>
                  </motion.div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onClose}
                    className="px-7 py-2.5 rounded-lg border-2 border-ink-gray/30 text-ink-black font-semibold hover:border-ink-black/60 hover:bg-ink-black/5 transition-all duration-200 backdrop-blur-sm"
                  >
                    关闭
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
