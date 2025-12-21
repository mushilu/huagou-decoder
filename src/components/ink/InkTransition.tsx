import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

interface InkTransitionProps {
  isVisible: boolean
  onComplete?: () => void
  variant?: 'spread' | 'wipe' | 'radial' | 'brush'
  duration?: number
  className?: string
  children?: React.ReactNode
}

/**
 * 水墨转场动效组件
 * 模拟水墨晕开扩散效果，用于页面转场
 */
export function InkTransition({
  isVisible,
  onComplete,
  variant = 'spread',
  duration = 0.8,
  className,
  children,
}: InkTransitionProps) {
  const [showContent, setShowContent] = useState(!isVisible)

  useEffect(() => {
    if (!isVisible) {
      const timer = setTimeout(() => {
        setShowContent(true)
        onComplete?.()
      }, duration * 1000)
      return () => clearTimeout(timer)
    } else {
      setShowContent(false)
    }
  }, [isVisible, duration, onComplete])

  const variants = {
    spread: {
      initial: { scale: 0, opacity: 1 },
      animate: { scale: 20, opacity: 1 },
      exit: { opacity: 0 },
    },
    wipe: {
      initial: { x: '-100%' },
      animate: { x: '100%' },
      exit: { x: '100%' },
    },
    radial: {
      initial: { clipPath: 'circle(0% at 50% 50%)' },
      animate: { clipPath: 'circle(150% at 50% 50%)' },
      exit: { clipPath: 'circle(0% at 50% 50%)' },
    },
    brush: {
      initial: { pathLength: 0, opacity: 1 },
      animate: { pathLength: 1, opacity: 1 },
      exit: { opacity: 0 },
    },
  }

  return (
    <div className={cn('relative', className)}>
      <AnimatePresence mode="wait">
        {isVisible && (
          <motion.div
            key="ink-overlay"
            className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: duration * 0.3 }}
          >
            {/* 水墨扩散效果 */}
            {variant === 'spread' && (
              <motion.div
                className="absolute h-32 w-32 rounded-full bg-ink-black"
                style={{
                  background: `radial-gradient(circle, #1a1a2e 0%, #16213e 40%, transparent 70%)`,
                }}
                initial={variants.spread.initial}
                animate={variants.spread.animate}
                transition={{
                  duration,
                  ease: [0.25, 0.46, 0.45, 0.94], // ease-ink-spread
                }}
              />
            )}

            {/* 横向水墨擦拭 */}
            {variant === 'wipe' && (
              <motion.div
                className="absolute inset-0 bg-ink-black"
                style={{
                  background: `linear-gradient(90deg,
                    transparent 0%,
                    #1a1a2e 10%,
                    #1a1a2e 90%,
                    transparent 100%
                  )`,
                }}
                initial={variants.wipe.initial}
                animate={variants.wipe.animate}
                transition={{
                  duration,
                  ease: [0.22, 0.61, 0.36, 1], // ease-brush-stroke
                }}
              />
            )}

            {/* 圆形径向展开 */}
            {variant === 'radial' && (
              <motion.div
                className="absolute inset-0 bg-ink-black"
                initial={variants.radial.initial}
                animate={variants.radial.animate}
                transition={{
                  duration,
                  ease: [0.25, 0.46, 0.45, 0.94],
                }}
              />
            )}

            {/* 毛笔书写轨迹 */}
            {variant === 'brush' && (
              <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100">
                <motion.path
                  d="M 10,50 Q 25,30 40,50 T 70,50 T 90,50"
                  fill="none"
                  stroke="#1a1a2e"
                  strokeWidth="40"
                  strokeLinecap="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{
                    duration,
                    ease: [0.22, 0.61, 0.36, 1],
                  }}
                />
              </svg>
            )}

            {/* 墨点粒子效果 */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(8)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute h-2 w-2 rounded-full bg-ink-black/60"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{
                    scale: [0, 1.5, 0],
                    opacity: [0, 0.8, 0],
                  }}
                  transition={{
                    duration: duration * 0.6,
                    delay: Math.random() * duration * 0.4,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 内容区域 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: showContent ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        {children}
      </motion.div>
    </div>
  )
}

/**
 * 简化的页面转场 Hook
 */
export function useInkTransition(initialState = false) {
  const [isTransitioning, setIsTransitioning] = useState(initialState)

  const startTransition = () => setIsTransitioning(true)
  const endTransition = () => setIsTransitioning(false)

  return {
    isTransitioning,
    startTransition,
    endTransition,
  }
}
