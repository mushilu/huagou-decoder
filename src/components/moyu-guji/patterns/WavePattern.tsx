import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface WavePatternProps {
  position?: 'top' | 'bottom'
  opacity?: number
  animated?: boolean
  className?: string
}

/**
 * 海水纹装饰组件
 *
 * 用于页面底部装饰，模拟传统海水江崖纹
 *
 * @example
 * ```tsx
 * <WavePattern position="bottom" opacity={0.3} />
 * ```
 */
export function WavePattern({
  position = 'bottom',
  opacity = 0.3,
  animated = true,
  className,
}: WavePatternProps) {
  const positionClass =
    position === 'bottom' ? 'bottom-0 left-0 right-0' : 'top-0 left-0 right-0'

  return (
    <motion.div
      className={cn(
        'absolute h-24 pointer-events-none',
        positionClass,
        'pattern-wave',
        className
      )}
      style={{ opacity }}
      initial={
        animated
          ? { y: position === 'bottom' ? 20 : -20, opacity: 0 }
          : undefined
      }
      animate={animated ? { y: 0, opacity } : undefined}
      transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
    />
  )
}
